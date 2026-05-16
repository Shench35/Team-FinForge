import { Link } from 'react-router-dom';
import { Logo } from '../components/layout/Logo';
import { Button } from '../ui/Button';
import { FileSearch } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-12">
        <Logo />
      </div>
      
      <div className="bg-white border border-outline-variant rounded-sm p-12 max-w-md shadow-sm space-y-8">
        <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto text-primary/20">
          <FileSearch className="w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold text-primary">404</h1>
          <h2 className="text-xl font-bold text-primary">Page not found</h2>
          <p className="text-on-surface-variant text-sm">
            The page you are looking for doesn't exist or has been moved to a new institutional node.
          </p>
        </div>

        <div className="pt-4">
          <Link to="/dashboard">
            <Button variant="primary" className="w-full h-12 font-bold uppercase tracking-widest text-[10px]">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
      
      <p className="mt-12 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
        Security through Clarity • CertVerify
      </p>
    </div>
  );
}
