const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
dotenv.config(); 
const cors = require("cors");

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET; 

if (!JWT_SECRET) {
      console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
      process.exit(1); 
}

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
      res.send("FinForge Backend is running!");
});

// --- Authentication Routes ---

// User Registration
app.post("/register", async (req, res) => {
      const { email, password, firstName, lastName, role } = req.body;

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
                  },
                  select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                  },
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

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) return res.status(401).json({ message: "Access token required" });

      jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: "Invalid or expired token" });
            req.user = user;
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
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        createdAt: true,
                  },
            });
            res.json(user);
      } catch (error) {
            res.status(500).json({ message: "Error fetching profile" });
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
