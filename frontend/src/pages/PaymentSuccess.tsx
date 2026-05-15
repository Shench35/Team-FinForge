import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  // Optionally we could add some confetti or auto-redirect after X seconds, 
  // but a static page with a button is cleaner for now.
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl shadow-primary/5 border border-outline-variant/30 p-10 text-center relative z-10 space-y-8 transform transition-all animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-secondary animate-[bounce_2s_ease-in-out_infinite]" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-display font-bold text-primary">Payment Successful</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Your transaction has been securely processed and your account has been updated. You can now access your new features.
          </p>
        </div>

        <div className="pt-6">
          <Button 
            variant="primary" 
            className="w-full h-14 text-sm font-bold tracking-widest uppercase shadow-lg shadow-secondary/20 hover:shadow-secondary/30 transition-shadow"
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </div>
        
        <div className="pt-4 border-t border-outline-variant/30">
          <p className="text-[10px] text-on-surface-variant/60 font-medium uppercase tracking-widest">
            A receipt has been sent to your email
          </p>
        </div>
      </div>
    </div>
  );
}
