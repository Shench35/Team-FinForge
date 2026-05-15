import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { User, Mail, Building, Shield, Lock } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em]">
            Account Management
          </p>
          <h1 className="text-4xl font-display font-bold text-primary tracking-tight">
            Settings
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Profile Information */}
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
              <User className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-bold text-on-surface">Profile Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Full Name</label>
                <div className="flex items-center gap-3 p-4 bg-surface-container-low border border-outline-variant rounded-sm text-on-surface font-medium">
                  <User className="w-4 h-4 opacity-40" />
                  {user?.fullName || 'N/A'}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
                <div className="flex items-center gap-3 p-4 bg-surface-container-low border border-outline-variant rounded-sm text-on-surface font-medium">
                  <Mail className="w-4 h-4 opacity-40" />
                  {user?.email || 'N/A'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Organisation</label>
                <div className="flex items-center gap-3 p-4 bg-surface-container-low border border-outline-variant rounded-sm text-on-surface font-medium">
                  <Building className="w-4 h-4 opacity-40" />
                  {user?.organisation || 'N/A'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Account ID</label>
                <div className="flex items-center gap-3 p-4 bg-surface-container-low border border-outline-variant rounded-sm text-on-surface-variant text-xs font-mono">
                  {user?.id || 'N/A'}
                </div>
              </div>
            </div>
          </Card>

          {/* Plan Details */}
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
              <Shield className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-bold text-on-surface">Current Plan</h2>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 bg-primary/5 border border-primary/10 rounded-sm">
              <div className="space-y-1">
                <h3 className="text-2xl font-display font-bold text-primary uppercase">{user?.plan || 'FREE'}</h3>
                <p className="text-sm text-on-surface-variant font-medium">Professional Certificate Verification</p>
              </div>
              <Button variant="primary" className="bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest text-[10px] h-10 px-6">
                Upgrade Plan
              </Button>
            </div>
          </Card>

          {/* Security / Password */}
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
              <Lock className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-bold text-on-surface">Security</h2>
            </div>
            
            <div className="space-y-6 max-w-md">
              <div className="space-y-4">
                <Input 
                  label="Current Password" 
                  type="password" 
                  placeholder="••••••••••••"
                  disabled
                />
                <Input 
                  label="New Password" 
                  type="password" 
                  placeholder="••••••••••••"
                  disabled
                />
                <Input 
                  label="Confirm New Password" 
                  type="password" 
                  placeholder="••••••••••••"
                  disabled
                />
              </div>
              <Button variant="outlined" className="w-full opacity-50 cursor-not-allowed font-bold uppercase tracking-widest text-[10px]" disabled>
                Update Password
              </Button>
              <p className="text-[10px] text-on-surface-variant/60 italic text-center">
                Password updates are currently disabled in this demo environment.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
