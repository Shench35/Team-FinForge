import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "../api/auth";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = (location.state as { registered?: boolean } | null)?.registered;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ email, password });
      await login(response.token, response.user);
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const bottomLink = (
    <p className="text-center text-sm text-on-surface-variant font-medium">
      Don't have an account?{" "}
      <Link to="/register" className="font-bold text-[#0F172A] hover:underline">
        Sign up
      </Link>
    </p>
  );

  return (
    <AuthLayout
      title="Login"
      subtitle="AUTHORIZED ACCESS ONLY"
      bottomLink={bottomLink}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {justRegistered && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/20">
            <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
            <p className="text-[11px] font-bold text-secondary uppercase tracking-wider">
              Account created successfully. Please log in.
            </p>
          </div>
        )}

        <Input
          label="EMAIL ADDRESS"
          type="email"
          placeholder="institutional@organization.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-[#F8FAFC] border-[#E2E8F0]"
        />

        <div className="space-y-1">
          <Input
            label="PASSWORD"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-[#F8FAFC] border-[#E2E8F0]"
          />
          <div className="flex justify-start">
            <Link
              to="/forgot-password"
              title="Forgot Password"
              className="text-xs font-bold text-secondary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {error && (
          <p className="text-[11px] text-error font-bold bg-error/5 p-3 border border-error/10 uppercase tracking-wider">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full h-12 text-sm font-bold tracking-widest uppercase bg-[#006C4E] hover:bg-[#005a41]"
          loading={loading}
        >
          LOG IN
        </Button>

        <div className="pt-6 border-t border-[#F1F5F9] flex justify-center items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-on-surface-variant/40" />
          <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.1em]">
            256-BIT AES ENCRYPTION ACTIVE
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
