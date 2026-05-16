import { Link } from 'react-router-dom';
import { Plus, Bell, ChevronDown } from 'lucide-react';
import { Button } from '../../ui/Button';
import { PlanBadge } from '../badges/PlanBadge';
import { Logo } from './Logo';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const { user } = useAuth();

  // If no user is found, we can show a placeholder or handle it via ProtectedRoute
  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : '??';

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-outline-variant h-16">
      <div className="px-6 h-full flex items-center justify-between">
        {/* Mobile Brand (Hidden on Desktop) */}
        <Link to="/dashboard" className="flex md:hidden items-center hover:opacity-90 transition-opacity">
          <Logo size="sm" />
        </Link>

        {/* Search or Spacer */}
        <div className="hidden md:block flex-1 max-w-md">
          {/* Add search bar here later if needed */}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link to="/verify" className="hidden sm:block">
            <Button variant="outlined" size="sm" className="h-9 gap-2">
              <Plus className="w-4 h-4" />
              New Verification
            </Button>
          </Link>

          <div className="h-6 w-px bg-outline-variant hidden sm:block mx-1" />

          <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-white" />
          </button>

          <div className="flex items-center gap-3 pl-2 border-l border-outline-variant ml-2 group cursor-pointer">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-primary leading-tight">{user?.fullName || 'User'}</span>
              {user?.plan && <PlanBadge plan={user.plan} size="sm" className="mt-0.5" />}
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-xs uppercase">
              {initials}
            </div>
            <ChevronDown className="w-4 h-4 text-on-surface-variant" />
          </div>
        </div>
      </div>
    </header>
  );
};
