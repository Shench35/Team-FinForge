import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { PageLayout } from './components/layout/PageLayout';

// Initial Pages (We will refine these once UI designs are uploaded)
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import PlanSelect from './pages/PlanSelect';
import Dashboard from './pages/Dashboard';

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
                <PageLayout>
                  <div className="text-2xl font-bold">Verification Flow (Awaiting UI)</div>
                </PageLayout>
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
