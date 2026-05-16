const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
dotenv.config(); 
const multer = require("multer");
const cors = require("cors");

const prisma = new PrismaClient();

async function testDbConnection() {
      try {
            await prisma.$connect();
            console.log("✅ Database connection established successfully.");
      } catch (error) {
            console.error("❌ Database connection failed:");
            console.error(error.message);
            console.error("Server will not start without a database connection.");
            process.exit(1);
      }
}

testDbConnection();

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
  }
});

const upload = multer({ storage: storage });


// --- Shared Helpers ---
const userSelect = {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      plan: true,
      organisation: true,
      createdAt: true,
};

const getUserStats = async (userId) => {
      const [total, authentic, suspicious, highRisk, processing] = await Promise.all([
            prisma.certificate.count({
                  where: { userId },
            }),
            prisma.certificate.count({
                  where: { userId, status: "APPROVED" },
            }),
            prisma.certificate.count({
                  where: { userId, status: "SUSPICIOUS" },
            }),
            prisma.certificate.count({
                  where: { userId, status: "HIGH_RISK" },
            }),
            prisma.certificate.count({
                  where: { userId, status: "PENDING" },
            }),
      ]);
      return { total, authentic, suspicious, highRisk, processing };
};

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET; 

if (!JWT_SECRET) {
      console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
      process.exit(1); 
}

// Middleware
//app.use(cors());
app.use(cors({
  origin: true, // Reflects the origin of the request, allowing any domain during dev
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
  credentials: true // If you're sending cookies or authorization headers
}));
app.use(express.json());

// --- Nodemailer Transporter Setup ---
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Basic route
app.get("/", (req, res) => {
      res.send("FinForge Backend is running!");
});

// --- Authentication Routes ---

// User Registration
app.post("/register", async (req, res) => {
      const { email, password, firstName, lastName, role, organisation } = req.body;

      if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "Required fields: email, password, firstName, lastName" });
      }

      try {
            const existingUser = await prisma.user.findUnique({
                  where: { email },
            });
            if (existingUser) {
                  return res.status(409).json({ message: "User with this email already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.user.create({
                  data: {
                        email,
                        password: hashedPassword,
                        firstName,
                        lastName,
                        role: role || "USER", // Use provided role or default to USER
                        organisation,
                  },
                  select: userSelect,
            });

            res.status(201).json({
                  message: "User registered successfully",
                  user: newUser,
            });
      } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ message: "Internal server error during registration" });
      }
});

// User Login
app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
      }

      try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                  return res.status(401).json({ message: "Invalid email or password" });
            }

            const token = jwt.sign(
                  { userId: user.id, email: user.email, role: user.role },
                  JWT_SECRET,
                  { expiresIn: "24h" } // Set to 24 hours for easier development
            );

            res.status(200).json({ 
                  message: "Login successful", 
                  token,
                  user: {
                        id: user.id,
                        email: user.email,
                        role: user.role
                  }
            });
      } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: "Internal server error during login" });
      }
});

// --- Password Reset Routes ---

// Request Password Reset
app.post("/forgot-password", async (req, res) => {
      const { email } = req.body;

      if (!email) {
            return res.status(400).json({ message: "Email is required" });
      }

      try {
            const user = await prisma.user.findUnique({ where: { email } });

            // For security, don't reveal if a user exists or not
            if (!user) {
                  return res.status(200).json({ message: "If an account exists with that email, a reset link has been sent." });
            }

            // Generate a random token
            const resetToken = crypto.randomBytes(32).toString("hex");
            
            // Hash the token and set expiry (e.g., 1 hour)
            const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
            const expiry = new Date(Date.now() + 3600000); // 1 hour from now

            await prisma.user.update({
                  where: { id: user.id },
                  data: {
                        resetPasswordToken: hashedToken,
                        resetPasswordExpires: expiry,
                  },
            });

            const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

            // Send Password Reset Email
            await transporter.sendMail({
                  from: `"FinForge Support" <${process.env.EMAIL_USER}>`,
                  to: email,
                  subject: "Password Reset Request",
                  text: `You requested a password reset. Please click on the link below to reset your password: \n\n ${resetUrl}`,
                  html: `<p>You requested a password reset. Please click on the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
            });

            console.log(`Password Reset Email successfully sent to ${email}`);

            res.status(200).json({ message: "If an account exists with that email, a reset link has been sent." });
      } catch (error) {
            console.error("Forgot password error:", error);
            res.status(500).json({ message: "Internal server error" });
      }
});

// Reset Password using Token
app.post("/reset-password/:token", async (req, res) => {
      const { token } = req.params;
      const { password } = req.body;

      if (!password) {
            return res.status(400).json({ message: "New password is required" });
      }

      try {
            const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

            const user = await prisma.user.findFirst({
                  where: {
                        resetPasswordToken: hashedToken,
                        resetPasswordExpires: { gt: new Date() },
                  },
            });

            if (!user) {
                  return res.status(400).json({ message: "Token is invalid or has expired" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.user.update({
                  where: { id: user.id },
                  data: {
                        password: hashedPassword,
                        resetPasswordToken: null,
                        resetPasswordExpires: null,
                  },
            });

            res.status(200).json({ message: "Password updated successfully" });
      } catch (error) {
            console.error("Reset password error:", error);
            res.status(500).json({ message: "Internal server error" });
      }
});

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
      const authHeader = req.headers["authorization"];
      // Look for token in Header OR in Query String (?token=...)
      const token = (authHeader && authHeader.split(" ")[1]) || req.query.token;

      if (!token) return res.status(401).json({ message: "Access token required" });
      console.log("Received token:", token ? "YES" : "NO"); // Log token presence
      if (token) {
        console.log("Token starts with:", token.substring(0, 10), "..."); // Log part of the token
      }

      jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
              console.error("JWT verification error:", err.message); // Log JWT error
              return res.status(403).json({ message: "Invalid or expired token" });
            }
            
            // Optionally fetch the latest role from the database
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
            if (!user) return res.status(404).json({ message: "User no longer exists" });

            req.user = {
                  userId: user.id,
                  email: user.email,
                  role: user.role // Now this is always current
            };
            next();
      });
};

// --- Protected Routes ---

// Get User Profile
app.get("/profile", authenticateToken, async (req, res) => {
      try {
            const user = await prisma.user.findUnique({
                  where: { id: req.user.userId },
                  select: {
                        ...userSelect,
                        certificates: true,
                  },
            });

            if (!user) {
                  return res.status(404).json({ message: "User not found" });
            }

            // Filter history to include only certificates that have been analyzed (status is not PENDING)
            const history = user.certificates.filter(cert => cert.status !== "PENDING");
            const stats = await getUserStats(user.id);
            res.json({ ...user, history, stats });
      } catch (error) {
            res.status(500).json({ message: "Error fetching profile" });
      }
});

// Update User Profile
app.patch("/profile", authenticateToken, async (req, res) => {
      const { firstName, lastName, email, organisation } = req.body;
      const userId = req.user.userId;

      try {
            // If email is being changed, check if it's already taken
            if (email) {
                  const existingUser = await prisma.user.findUnique({ where: { email } });
                  if (existingUser && existingUser.id !== userId) {
                        return res.status(409).json({ message: "Email already in use" });
                  }
            }

            const updatedUser = await prisma.user.update({
                  where: { id: userId },
                  data: {
                        firstName,
                        lastName,
                        email,
                        organisation,
                  },
                  select: {
                        ...userSelect,
                        certificates: true,
                  },
            });

            // Filter history for the updated profile response
            const history = updatedUser.certificates.filter(cert => cert.status !== "PENDING");
            const stats = await getUserStats(updatedUser.id);
            res.json({ message: "Profile updated successfully", user: { ...updatedUser, history, stats } });
      } catch (error) {
            console.error("Profile update error:", error);
            res.status(500).json({ message: "Error updating profile" });
      }
});

// Get All Users
app.get("/users", authenticateToken, async (req, res) => {
      try {
            const users = await prisma.user.findMany({
                  select: userSelect,
            });
            res.json(users);
      } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ message: "Error fetching user list" });
      }
});

// Update User Role
app.patch("/users/:id/role", authenticateToken, async (req, res) => {
      const { id } = req.params;
      const { role } = req.body;

      // Security: Only admins should be allowed to change roles
      if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden: Only admins can change roles" });
      }

      // Validate the requested role against the Prisma enum
      const validRoles = ["ADMIN", "USER", "VERIFIER"];
      if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
      }

      try {
            const updatedUser = await prisma.user.update({
                  where: { id },
                  data: { role },
                  select: {
                        id: true,
                        email: true,
                        role: true,
                  },
            });

            res.json({ message: "Role updated successfully", user: updatedUser });
      } catch (error) {
            console.error("Error updating role:", error);
            res.status(500).json({ message: "Error updating user role" });
      }
});

// --- Certificate Routes ---

// Upload a new certificate
app.post("/certificates/upload", authenticateToken, upload.single("certificate"), async (req, res) => {
      const { courseName, issueDate, expiryDate } = req.body;
      const userId = req.user.userId;

      if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
      }

      if (!courseName || !issueDate) {
            return res.status(400).json({ message: "Course name and issue date are required" });
      }

      try {
            const newCertificate = await prisma.certificate.create({
                  data: {
                        userId,
                        courseName,
                        issueDate: new Date(issueDate),
                        expiryDate: expiryDate ? new Date(expiryDate) : null,
                        certificateUrl: req.file.path, // Store the local file path
                        status: "PENDING", // Default status for new uploads
                  },
            });

            res.status(201).json({
                  message: "Certificate uploaded successfully",
                  certificate: newCertificate,
            });
      } catch (error) {
            console.error("Upload error:", error);
            res.status(500).json({ message: "Error saving certificate metadata" });
      }
});

// --- Health Check ---
app.get("/health", async (req, res) => {
      try {
            await prisma.$queryRaw`SELECT 1`; // Lightweight DB check
            res.status(200).json({ status: "OK", database: "Connected" });
      } catch (error) {
            res.status(503).json({ status: "Error", database: "Disconnected" });
      }
});

app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Prisma disconnected. Server shutting down.");
  process.exit(0);
});