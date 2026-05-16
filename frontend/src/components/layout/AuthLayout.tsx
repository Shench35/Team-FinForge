import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  bottomLink?: ReactNode;
}

export const AuthLayout = ({ children, title, subtitle, bottomLink }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
      {/* Brand & Tagline */}
      <div className="text-center mb-8 space-y-3">
        <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
          <Logo size="lg" />
        </Link>
        <p className="text-on-surface-variant text-sm font-medium">
          Institutional security for professional credentialing.
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[480px] bg-white border border-[#E2E8F0] rounded-sm p-10 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)]">
        <div className="mb-8">
          <h1 className="text-[28px] font-display font-bold text-[#0F172A] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-[0.1em] mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>

      {/* Bottom Link (outside card) */}
      {bottomLink && (
        <div className="mt-8">
          {bottomLink}
        </div>
      )}

      {/* Page Footer */}
      <footer className="mt-12 text-center space-y-4">
        <div className="flex justify-center gap-6 text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
        <p className="text-[10px] font-medium text-on-surface-variant/40 tracking-[0.2em] uppercase">
          © {new Date().getFullYear()} CertVerify. Security through Clarity.
        </p>
      </footer>
    </div>
  );
};
