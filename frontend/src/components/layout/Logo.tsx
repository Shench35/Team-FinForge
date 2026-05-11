import logo from '../../assets/certverify_logo.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
  };

  return (
    <img 
      src={logo} 
      alt="CertVerify Logo" 
      className={`${sizes[size]} w-auto object-contain ${className || ''}`} 
    />
  );
};
