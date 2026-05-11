import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileCheck, 
  History, 
  BarChart3, 
  Settings, 
  LifeBuoy, 
  FileText, 
  LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import { Logo } from './Logo';

const navLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'New Verification', icon: FileCheck, path: '/verify' },
  { label: 'History', icon: History, path: '/history' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
];

const secondaryLinks = [
  { label: 'Settings', icon: Settings, path: '/settings' },
  { label: 'Support', icon: LifeBuoy, path: '/support' },
  { label: 'Documentation', icon: FileText, path: '/docs' },
];

export const Sidebar = () => {
  const location = useLocation();

  const NavItem = ({ item }: { item: typeof navLinks[0] }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <Link
        to={item.path}
        className={clsx(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
          isActive 
            ? 'bg-primary text-white shadow-md' 
            : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
        )}
      >
        <Icon className={clsx(
          'w-5 h-5 transition-transform group-hover:scale-110',
          isActive ? 'text-secondary' : 'text-on-surface-variant group-hover:text-primary'
        )} />
        <span className="font-medium text-sm">{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-surface-container-low border-r border-outline-variant flex flex-col hidden md:flex">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center border-b border-outline-variant">
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <Logo size="md" />
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="text-[10px] font-bold text-on-surface-variant/60 tracking-widest uppercase px-4 mb-4">
          Main Menu
        </div>
        {navLinks.map((link) => (
          <NavItem key={link.path} item={link} />
        ))}

        <div className="pt-8 pb-4">
          <div className="text-[10px] font-bold text-on-surface-variant/60 tracking-widest uppercase px-4 mb-4">
            System
          </div>
          {secondaryLinks.map((link) => (
            <NavItem key={link.path} item={link} />
          ))}
        </div>
      </nav>

      {/* Footer Nav */}
      <div className="p-4 border-t border-outline-variant">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-error hover:bg-error/5 rounded-lg transition-colors group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};
