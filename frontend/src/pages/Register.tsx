import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "../api/auth";
import { Lock, ShieldCheck } from "lucide-react";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.register({
        fullName,
        email,
        password,
        organisation,
      });
      await login(response.token, response.user);
      navigate("/plan-select");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const bottomLink = (
    <p className="text-center text-sm text-on-surface-variant font-medium">
      Already have an account?{" "}
      <Link to="/login" className="font-bold text-[#0F172A] hover:underline">
        Log in
      </Link>
    </p>
  );

  return (
    <AuthLayout
      title="Create your account"
      subtitle="JOIN THE SECURE NETWORK FOR CREDENTIAL VERIFICATION."
      bottomLink={bottomLink}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="FULL NAME"
          type="text"
          placeholder="Alex Johnson"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="bg-[#F8FAFC] border-[#E2E8F0]"
        />

        <Input
          label="EMAIL ADDRESS"
          type="email"
          placeholder="alex.j@institution.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-[#F8FAFC] border-[#E2E8F0]"
        />

        <Input
          label="PASSWORD"
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-[#F8FAFC] border-[#E2E8F0]"
        />

        <div className="relative">
          <label className="flex justify-between text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-2">
            ORGANISATION{" "}
            <span className="text-[9px] font-medium lowercase opacity-60 italic">
              optional
            </span>
          </label>
          <Input
            type="text"
            placeholder="University or Company Name"
            value={organisation}
            onChange={(e) => setOrganisation(e.target.value)}
            className="bg-[#F8FAFC] border-[#E2E8F0]"
          />
        </div>

        <p className="text-[10px] text-on-surface-variant/70 leading-relaxed text-center px-4">
          By clicking "Create Account", you agree to our{" "}
          <Link to="/terms" className="font-bold hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="font-bold hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        {error && (
          <p className="text-[11px] text-error font-bold bg-error/5 p-3 border border-error/10 uppercase tracking-wider text-center">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full h-12 text-sm font-bold tracking-widest uppercase bg-[#006C4E] hover:bg-[#005a41]"
          loading={loading}
        >
          Create Account
        </Button>

        <div className="pt-6 border-t border-[#F1F5F9] flex justify-center items-center gap-8">
          <div className="flex items-center gap-1.5 opacity-40">
            <Lock className="w-3.5 h-3.5" />
            <p className="text-[9px] font-bold uppercase tracking-[0.1em]">
              AES-256 ENCRYPTION
            </p>
          </div>
          <div className="flex items-center gap-1.5 opacity-40">
            <ShieldCheck className="w-3.5 h-3.5" />
            <p className="text-[9px] font-bold uppercase tracking-[0.1em]">
              ISO 27001 CERTIFIED
            </p>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
