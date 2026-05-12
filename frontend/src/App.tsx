import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Initial Pages (We will refine these once UI designs are uploaded)
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import PlanSelect from './pages/PlanSelect';
import Dashboard from './pages/Dashboard';
import Verify from './pages/Verify';
import Result from './pages/Result';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<div className="p-20 text-center text-4xl font-bold">Pricing Page (Awaiting UI)</div>} />
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
            path="/verify"
            element={
              <ProtectedRoute>
                <Verify />
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

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
