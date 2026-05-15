import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../ui/Card';
import { Button} from '../ui/Button';
import { HelpCircle, Mail, MessageSquare, ExternalLink, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-outline-variant last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-left group"
      >
        <span className="font-bold text-primary group-hover:text-secondary transition-colors">{question}</span>
        <ChevronDown className={`w-5 h-5 text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

const Support = () => {
  const faqs = [
    {
      question: "How accurate is the AI certificate analysis?",
      answer: "Our AI analysis system has a 99.9% accuracy rate. It cross-references visual patterns, metadata, and structural integrity against thousands of known institutional templates and blockchain records."
    },
    {
      question: "What file formats are supported for upload?",
      answer: "Currently, we support PDF, PNG, and JPEG formats. For best results, ensure the document is clear, well-lit, and the text is legible."
    },
    {
      question: "How long does the verification process take?",
      answer: "The AI analysis is near-instant, typically taking between 2 minutes depending on document complexity and server load."
    },
    {
      question: "What should I do if my document is flagged as 'Suspicious'?",
      answer: "A 'Suspicious' verdict often occurs due to blurry scans, missing metadata, or minor template variations. We recommend re-uploading a high-quality scan. If the issue persists, a manual forensic audit can be requested."
    },
    {
      question: "How are the credits/verifications deducted from my plan?",
      answer: "One credit is deducted per successful analysis. If an analysis fails due to server errors, no credit is deducted. Credits reset at the beginning of each billing cycle."
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em]">
            Help & Resources
          </p>
          <h1 className="text-4xl font-display font-bold text-primary tracking-tight">
            Support Center
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-primary">Email Support</h3>
              <p className="text-xs text-on-surface-variant mt-1">Direct response within 24h</p>
            </div>
            <a href="mailto:support@finforge.ai" className="text-secondary font-bold text-sm hover:underline flex items-center gap-1">
              support@finforge.ai
            </a>
          </Card>

          <Card className="p-6 bg-white flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-primary">Live Chat</h3>
              <p className="text-xs text-on-surface-variant mt-1">Available 9am - 6pm EST</p>
            </div>
            <button className="text-primary font-bold text-sm hover:underline">
              Start a Conversation
            </button>
          </Card>

          <Card className="p-6 bg-white flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <ExternalLink className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-primary">Documentation</h3>
              <p className="text-xs text-on-surface-variant mt-1">Detailed API & Usage guides</p>
            </div>
            <button className="text-secondary font-bold text-sm hover:underline">
              View Docs
            </button>
          </Card>
        </div>

        <Card className="p-8">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-6 mb-2">
            <HelpCircle className="w-6 h-6 text-secondary" />
            <h2 className="text-2xl font-display font-bold text-primary">Frequently Asked Questions</h2>
          </div>
          
          <div className="divide-y divide-outline-variant">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </Card>

        <div className="p-8 bg-primary rounded-sm text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold">Still need help?</h3>
            <p className="text-white/70 text-sm">Our enterprise support team is available 24/7 for critical issues.</p>
          </div>
          <Button variant="primary" className="bg-white text-primary hover:bg-white/90 font-bold uppercase tracking-widest text-[10px] h-12 px-8">
            Contact Enterprise Support
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Support;
