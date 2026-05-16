import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/auth';
import { PlanCard } from '../components/dashboard/PlanCard';
import { Info } from 'lucide-react';


const PlanSelect = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = async (planId: string) => {
    setLoading(planId);
    try {
      const updatedUser = await authApi.updatePlan(planId);
      updateUser(updatedUser);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update plan:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavbar />
      
      <main className="flex-1 py-20 px-6">
        <div className="max-w-container-max mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary tracking-tight">
              Choose your verification plan
            </h1>
            <p className="text-on-surface-variant text-lg">
              Select the professional tier that best fits your document verification volume 
              and organizational requirements.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
            <PlanCard 
              plan="PRO" 
              loading={loading === 'PRO'}
              onSelect={handleSelectPlan} 
            />
            <PlanCard 
              plan="PRO_MAX" 
              showPopularRibbon
              loading={loading === 'PRO_MAX'}
              onSelect={handleSelectPlan} 
            />
            <PlanCard 
              plan="ENTERPRISE" 
              loading={loading === 'ENTERPRISE'}
              onSelect={handleSelectPlan} 
            />
          </div>

          {/* Info Box */}
          <div className="max-w-xl mx-auto bg-surface p-4 rounded-sm border border-outline-variant flex items-center justify-center gap-3 text-xs font-medium text-on-surface-variant mb-20">
            <Info className="w-4 h-4 text-primary/40" />
            <p>You can change your plan anytime from your dashboard</p>
          </div>

          {/* Social Proof Section */}
          <div className="bg-[#F8FAFC] rounded-lg border border-outline-variant p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-white/80" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-2xl font-display font-bold text-primary">Trusted by 50+ Institutions</h2>
              <p className="text-on-surface-variant max-w-xl mx-auto leading-relaxed">
                Our enterprise-grade security ensures that your document verifications are handled 
                with the highest level of cryptographic precision.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlanSelect;
