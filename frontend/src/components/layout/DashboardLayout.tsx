import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { PlanBadge } from '../badges/PlanBadge';
import { Button } from '../../ui/Button';
import { Plus, Bell } from 'lucide-react';
import { MobileBottomNav } from './MobileBottomNav';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 md:pb-0">
      {/* Sidebar - Desktop Only */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        
        {/* Desktop Topbar */}
        <header className="hidden md:flex h-16 bg-white border-b border-outline-variant px-8 items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-on-surface-variant/60">
              Welcome, Administrator
            </span>
            <PlanBadge plan={user?.plan || 'PRO_MAX'} />
          </div>

          <div className="flex items-center gap-6">
            {/* <button className="text-on-surface-variant hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">
              Pro Plan
            </button> */}
            <div className="h-8 w-[1px] bg-outline-variant" />
            <button className="relative text-on-surface-variant hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full border-2 border-white" />
            </button>
            <Button variant="primary" size="sm" className="h-10 px-4 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 bg-[#006C4E]">
              <Plus className="w-3 h-3" />
              New Verification
            </Button>
          </div>
        </header>

        {/* Mobile Topbar */}
        <header className="md:hidden flex h-16 bg-white border-b border-outline-variant px-6 items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-white font-bold text-xs">CV</div>
            <PlanBadge plan={user?.plan || 'PRO_MAX'} />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-on-surface-variant">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full border-2 border-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant">
              <img src="https://ui-avatars.com/api/?name=Admin&background=0F172A&color=fff" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-12 max-w-[1400px]">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};
