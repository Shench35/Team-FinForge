import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How long does verification take?",
    answer: "Our AI-powered engine typically completes a full institutional verification in under 2 minutes. You will receive real-time status updates throughout the process."
  },
  {
    question: "What file formats are accepted?",
    answer: "We currently support high-resolution PDF, PNG, and JPG files. To ensure the highest accuracy, please provide clear, original digital exports when possible."
  },
  {
    question: "Is my data secure?",
    answer: "Yes. CertVerify uses institutional-grade encryption for all document processing. We do not store original files after analysis is complete, and we are fully GDPR and SOC2 compliant."
  }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-display font-bold text-primary text-center mb-12">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-outline-variant rounded-sm bg-white overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-surface transition-colors"
            >
              <span className="font-bold text-primary">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-on-surface-variant" />
              ) : (
                <ChevronDown className="w-5 h-5 text-on-surface-variant" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-5 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant pt-4">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
