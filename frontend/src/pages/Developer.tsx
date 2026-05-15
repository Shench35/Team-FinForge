import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Terminal, Key, Copy, CheckCircle2, Eye, EyeOff, Code, ShieldCheck } from 'lucide-react';
import { initiateVerificationPayment, purchaseApiCredits } from '../api/verification';
import { PaymentGate } from '../components/verification/PaymentGate';

export default function Developer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [credits, setCredits] = useState(0);
  
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem('demo_developer_paid') === 'true' && user?.email && !apiKey) {
      handlePaymentConfirmed();
    }
  }, [user?.email, apiKey]);

  const handleStartPurchase = async () => {
    if (!user?.email) return;
    setIsGeneratingKey(true);
    try {
      const response = await initiateVerificationPayment(user.email, 50000);
      setPaymentUrl(response.checkout_url);
    } catch (err) {
      console.error("Failed to initialize payment", err);
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handlePaymentConfirmed = async () => {
    if (!user?.email) return;
    setIsGeneratingKey(true);
    try {
      const response = await purchaseApiCredits(user.email);
      setApiKey(response.api_key);
      setCredits(100);
      setPaymentUrl(null);
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

  if (paymentUrl) {
    return (
      <DashboardLayout>
        <PaymentGate
          titleOverride="API Starter Pack (100 Credits)"
          priceOverride="₦50,000"
          documentCount={100}
          paymentUrl={paymentUrl}
          onPaymentInitiated={() => {
            localStorage.setItem('demo_developer_paid', 'true');
            navigate('/payment-success');
          }}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl pb-20">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em]">
            B2B Integration
          </p>
          <h1 className="text-4xl font-display font-bold text-primary tracking-tight">
            Developer API
          </h1>
        </div>

        {/* API Key Management Section */}
        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
            <Key className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-bold text-on-surface">API Credentials</h2>
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
                  onClick={handleStartPurchase}
                  disabled={isGeneratingKey}
                >
                  {isGeneratingKey ? "Initializing..." : "Unlock Access - ₦50,000"}
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
                {credits === 0 && apiKey ? (
                  <Button variant="primary" onClick={handleStartPurchase} className="h-9 px-4 font-bold uppercase tracking-widest text-[10px]">
                    Top Up
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </Card>

        {/* Documentation Section */}
        <div className="space-y-6 pt-8">
          <div className="flex items-center gap-3">
            <Terminal className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-on-surface">Documentation</h2>
          </div>

          <Card className="p-8 space-y-8 bg-white">
            
            {/* Auth */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                1. Authentication
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                All requests to the Verification API must include your API key in the <code className="bg-surface-container px-1.5 py-0.5 rounded text-primary text-xs">x-api-key</code> header.
              </p>
              <div className="bg-[#0F172A] p-4 rounded-md overflow-x-auto">
                <pre className="text-[13px] text-gray-300 font-mono">
                  <span className="text-purple-400">x-api-key</span>: cvfy_your_unique_api_key_here
                </pre>
              </div>
            </div>

            <div className="h-px bg-outline-variant/40" />

            {/* Endpoints */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Code className="w-5 h-5" />
                2. Verify Certificate Endpoint
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                The core verification engine. Analyzes a document and returns authenticity scores and extracted data.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <span className="bg-secondary/10 text-secondary font-bold px-2 py-1 rounded text-xs">POST</span>
                  <code className="font-mono text-on-surface bg-surface-container px-2 py-1 rounded">/third_party/api/v1/verify</code>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Headers</h4>
                  <ul className="text-sm text-on-surface space-y-2">
                    <li><code className="text-xs bg-surface-container px-1.5 py-0.5 rounded">Content-Type: multipart/form-data</code></li>
                    <li><code className="text-xs bg-surface-container px-1.5 py-0.5 rounded">x-api-key: &lt;YOUR_KEY&gt;</code></li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Form Data</h4>
                  <ul className="text-sm text-on-surface space-y-2">
                    <li><code className="text-xs font-bold">file</code>: Image (JPG/PNG) or PDF</li>
                    <li><code className="text-xs font-bold">cert_type</code>: <span className="italic">WAEC</span> or <span className="italic">NECO</span></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="h-px bg-outline-variant/40" />

            {/* Code Examples */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary">3. Code Examples</h3>
              
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Node.js (Axios)</h4>
                <div className="bg-[#0F172A] p-4 rounded-md overflow-x-auto">
                  <pre className="text-[13px] text-gray-300 font-mono leading-relaxed">
<span className="text-pink-400">const</span> axios = require(<span className="text-green-300">'axios'</span>);
<span className="text-pink-400">const</span> FormData = require(<span className="text-green-300">'form-data'</span>);
<span className="text-pink-400">const</span> fs = require(<span className="text-green-300">'fs'</span>);

<span className="text-pink-400">const</span> form = <span className="text-pink-400">new</span> FormData();
form.append(<span className="text-green-300">'file'</span>, fs.createReadStream(<span className="text-green-300">'certificate.pdf'</span>));
form.append(<span className="text-green-300">'cert_type'</span>, <span className="text-green-300">'WAEC'</span>);

axios.post(<span className="text-green-300">'http://api.finforge.com/third_party/api/v1/verify'</span>, form, {'{'}
  headers: {'{'}
    ...form.getHeaders(),
    <span className="text-green-300">'x-api-key'</span>: <span className="text-green-300">'cvfy_your_key'</span>
  {'}'}
{'}'}).then(res {`=>`} console.log(res.data));
                  </pre>
                </div>
              </div>
            </div>

          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
