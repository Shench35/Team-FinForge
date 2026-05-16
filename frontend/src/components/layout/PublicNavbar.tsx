import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Logo } from './Logo';

export const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { label: 'Features', path: '/#features' },
    { label: 'Pricing', path: '/#pricing' },
  ];

  // Helper to check if a link is active
  const isActive = (path: string) => {
    if (path.startsWith('/#')) {
      return location.hash === path.substring(1);
    }
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-outline-variant h-20 md:h-24">
      <div className="max-w-container-max mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="hover:opacity-90 transition-opacity" onClick={() => setIsOpen(false)}>
          <Logo size="lg" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.path} 
              className={`text-sm font-bold transition-all duration-300 relative py-2
                ${isActive(link.path) 
                  ? 'text-primary' 
                  : 'text-on-surface-variant hover:text-primary'
                }
              `}
            >
              {link.label}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary animate-in fade-in zoom-in duration-300" />
              )}
            </a>
          ))}
          <div className="flex items-center gap-4 pl-4 border-l border-outline-variant">
            <Link to="/login">
              <Button variant="outlined" size="sm" className="font-bold">Log In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" className="font-bold">Get Started</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleMenu}
          className="md:hidden p-2 text-primary hover:bg-surface rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-outline-variant animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-6 py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.path} 
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold text-primary"
              >
                {link.label}
              </a>
            ))}
            <hr className="border-outline-variant" />
            <div className="flex flex-col gap-4">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outlined" size="lg" className="w-full font-bold">Log In</Button>
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <Button variant="primary" size="lg" className="w-full font-bold">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
