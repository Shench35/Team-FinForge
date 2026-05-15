import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useState } from 'react';
import { User, Mail, Building, Shield, Lock, Key, Copy, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { purchaseApiCredits } from '../api/verification';

const Settings = () => {
  const { user } = useAuth();
  
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [credits, setCredits] = useState(0);

  const handleGenerateKey = async () => {
    if (!user?.email) return;
    setIsGeneratingKey(true);
    try {
      const response = await purchaseApiCredits(user.email);
      setApiKey(response.api_key);
      setCredits(10); // Give 10 credits on first generation for demo
    } catch (err) {
      console.error("Failed to generate API Key", err);
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleCopyKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

          {/* Developer / B2B API Settings */}
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
              <Key className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-bold text-on-surface">Developer Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-on-surface">API Access Key</h3>
                  <p className="text-sm text-on-surface-variant">
                    Use this key to authenticate your requests to the FinForge Verification API.
                  </p>
                </div>
                {!apiKey && (
                  <Button 
                    variant="primary" 
                    className="h-10 font-bold uppercase tracking-widest text-[10px]"
                    onClick={handleGenerateKey}
                    disabled={isGeneratingKey}
                  >
                    {isGeneratingKey ? "Generating..." : "Generate Key"}
                  </Button>
                )}
              </div>

              {apiKey && (
                <div className="p-4 bg-surface-container-low border border-outline-variant rounded-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Your Secret Key</label>
                    <button 
                      onClick={() => setShowKey(!showKey)}
                      className="text-xs text-secondary font-bold hover:underline flex items-center gap-1"
                    >
                      {showKey ? <><EyeOff className="w-3 h-3" /> Hide</> : <><Eye className="w-3 h-3" /> Show</>}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 p-3 bg-white border border-outline-variant rounded font-mono text-sm text-on-surface overflow-x-auto">
                      {showKey ? apiKey : "cvfy_••••••••••••••••••••••••••••••••"}
                    </div>
                    <Button 
                      variant="outlined" 
                      className="h-11 px-4 border-outline-variant"
                      onClick={handleCopyKey}
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-secondary" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-outline-variant rounded-sm mt-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-on-surface">API Credit Balance</h3>
                  <p className="text-xs text-on-surface-variant">1 credit = 1 successful verification</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-2xl font-display font-bold text-primary">{credits}</span>
                  </div>
                  {credits === 0 ? (
                    <Button variant="primary" className="h-9 px-4 font-bold uppercase tracking-widest text-[10px]">
                      Top Up
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
