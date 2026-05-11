import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Logo } from './Logo';

export const PublicNavbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-outline-variant h-16">
      <div className="max-w-container-max mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <Logo size="md" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/pricing" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
            Pricing
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outlined" size="sm">Log In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-primary hover:bg-surface rounded-md transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};
