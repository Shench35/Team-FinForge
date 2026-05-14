import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { QuickStats } from '../components/dashboard/QuickStats';
import { HistoryTable } from '../components/dashboard/HistoryTable';
import { SecurityAuditBanner } from '../components/dashboard/SecurityAuditBanner';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Use the user's name from context, or 'Alexander' as a fallback to match the design
  const userName = user?.fullName?.split(' ')[0] || 'Alexander';

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Top Header & Greeting */}
        <DashboardHeader user={user} />

        {/* Core Metrics Grid */}
        <QuickStats />

        {/* Main Data Table */}
        <div className="pt-8">
          <HistoryTable />
        </div>

        {/* Security / Upsell Banner */}
        <SecurityAuditBanner />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
