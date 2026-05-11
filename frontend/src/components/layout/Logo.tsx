import logo from '../../assets/certverify_logo.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizes = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-24',
  };

  return (
    <img 
      src={logo} 
      alt="CertVerify Logo" 
      className={`${sizes[size]} w-auto object-contain ${className || ''}`} 
    />
  );
};
