import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      {/* Logo & Brand */}
      <Link to="/" className="mb-8 hover:opacity-90 transition-opacity">
        <Logo size="lg" />
      </Link>

      {/* Auth Card */}
      <div className="w-full max-w-[440px] bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-[0px_4px_12px_rgba(15,45,94,0.04)]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-primary mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-on-surface-variant text-sm">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-xs text-on-surface-variant/60 font-medium tracking-wide uppercase">
          © 2026 CertVerify. Security through Clarity.
        </p>
      </footer>
    </div>
  );
};
