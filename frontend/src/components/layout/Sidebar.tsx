import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileCheck,
  History,
  BarChart3,
  Settings,
  LifeBuoy,
  LogOut,
  CreditCard,
} from "lucide-react";
import { clsx } from "clsx";
import { Logo } from "./Logo";
import { Button } from "../../ui/Button";

import { useAuth } from "../../hooks/useAuth";

const navLinks = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "New Verification", icon: FileCheck, path: "/verify" },
  { label: "History", icon: History, path: "/history" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Plans & Upgrade", icon: CreditCard, path: "/plans" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const NavItem = ({ item }: { item: (typeof navLinks)[0] }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <Link
        to={item.path}
        className={clsx(
          "flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group",
          isActive
            ? "bg-[#F1F5F9] text-primary font-bold border-r-4 border-primary"
            : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary",
        )}
      >
        <Icon
          className={clsx(
            "w-5 h-5 transition-transform group-hover:scale-110",
            isActive
              ? "text-primary"
              : "text-on-surface-variant group-hover:text-primary",
          )}
        />
        <span className="text-sm tracking-tight">{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 hidden w-64 border-r border-outline-variant bg-[#F8FAFC] md:flex md:flex-col">
      {/* Brand Header */}
      <div className="py-10 px-8 flex flex-col gap-1">
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <Logo size="md" />
        </Link>
        <p className="text-[10px] font-bold text-on-surface-variant/40 tracking-[0.2em] uppercase">
          Enterprise Security
        </p>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 space-y-1">
        {navLinks.map((link) => (
          <NavItem key={link.path} item={link} />
        ))}

        {/* User Profile Summary (Dynamic) */}
        <div className="mt-12 mx-2 p-4 rounded-sm border border-outline-variant/30 bg-white shadow-sm">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Current Plan</span>
              <span className="text-[9px] font-black text-secondary uppercase bg-secondary/10 px-2 py-0.5 rounded-full">{user?.plan || 'PRO'}</span>
            </div>
            <div className="pt-2 border-t border-outline-variant/20">
              <p className="text-xs font-bold text-primary truncate">{user?.fullName || 'Anonymous'}</p>
              <p className="text-[10px] text-on-surface-variant truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer Nav */}
      <div className="p-4 space-y-1 border-t border-outline-variant/40">
        <Link
          to="/support"
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary transition-colors"
        >
          <LifeBuoy className="w-4 h-4" />
          <span className="text-sm font-medium">Support Center</span>
        </Link>
        <button 
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-on-surface-variant hover:text-error transition-colors group"
        >
          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
};
