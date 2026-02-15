import { motion } from 'framer-motion';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  className = '',
  onClick,
  type = 'button',
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg';
  
  const variants = {
    primary: 'bg-gradient-to-br from-electric-blue to-cosmic-purple text-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(79,156,247,0.3)] disabled:hover:translate-y-0',
    secondary: 'bg-bg-secondary border border-white/10 text-star-white hover:border-electric-blue/30 hover:bg-bg-tertiary',
    ghost: 'text-star-white hover:bg-white/5',
    danger: 'bg-danger-red text-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,82,82,0.3)] disabled:hover:translate-y-0',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export { Button };
