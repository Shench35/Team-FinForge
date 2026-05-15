import {
  BrowserRouter as Router,
  Routes,
  Route,

} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

// Initial Pages (We will refine these once UI designs are uploaded)
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import PlanSelect from "./pages/PlanSelect";
import Dashboard from "./pages/Dashboard";
import Verify from "./pages/Verify";
import VerifyConfirm from "./pages/VerifyConfirm";
import Result from "./pages/Result";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import Developer from "./pages/Developer";
import Support from "./pages/Support";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing isPublicOnly={true} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plan-select" element={<PlanSelect />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/plans"
            element={
              <ProtectedRoute>
                <Pricing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/verify"
            element={
              <ProtectedRoute>
                <Verify />
              </ProtectedRoute>
            }
          />

          <Route
            path="/verify/confirm"
            element={
              <ProtectedRoute>
                <VerifyConfirm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/result/:id"
            element={
              <ProtectedRoute>
                <Result />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/developer"
            element={
              <ProtectedRoute>
                <Developer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment-success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
