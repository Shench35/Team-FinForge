import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar - Desktop Only */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col md:ml-64 min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-container-max mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Note: Mobile Bottom Nav (FE2) will be added here later */}
    </div>
  );
};
