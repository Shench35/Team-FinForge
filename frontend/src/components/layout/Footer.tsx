import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
      ],
    },
    {
      title: 'Product',
      links: [
        { label: 'Features', path: '/#features' },
        { label: 'Security', path: '/security' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
      ],
    },
  ];

  return (
    <footer className="bg-surface border-t border-outline-variant pt-16 pb-8">
      <div className="max-w-container-max mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <Logo size="md" />
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-[240px]">
              Securing the global credential landscape with AI and Institutional clarity.
            </p>
          </div>

          {/* Links Sections */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-[10px] font-bold text-on-surface-variant/60 tracking-widest uppercase">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.path} 
                      className="text-sm font-medium text-on-surface hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant/60 font-medium">
          <p>© {currentYear} CertVerify. Security through Clarity.</p>
          <div className="flex items-center gap-6">
            <span>Server Status: <span className="text-secondary">Operational</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
