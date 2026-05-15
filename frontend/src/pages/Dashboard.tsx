import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { QuickStats } from '../components/dashboard/QuickStats';
import { HistoryTable } from '../components/dashboard/HistoryTable';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Use data from user object (fetched from /profile)
  // Provide empty defaults if the backend hasn't sent them yet
  const stats = user?.stats || {
    total: 0,
    authentic: 0,
    suspicious: 0,
    highRisk: 0,
  };
  
  const history = user?.history || [];
  const totalVerifications = typeof stats.total === 'number' ? stats.total : parseInt(String(stats.total).replace(/,/g, '')) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Top Header & Greeting */}
        <DashboardHeader user={user} />

        {/* Core Metrics Grid */}
        <QuickStats stats={stats} />

        {/* Main Data Table */}
        <div className="pt-8">
          <HistoryTable historyItems={history} totalCount={totalVerifications} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
