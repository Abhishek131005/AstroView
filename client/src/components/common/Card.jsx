import { motion } from 'framer-motion';

function Card({ 
  children, 
  className = '', 
  variant = 'default',
  hoverable = true,
  onClick,
  ...props 
}) {
  const baseStyles = 'bg-bg-secondary border border-white/10 rounded-xl p-4';
  
  const variants = {
    default: hoverable 
      ? 'hover:border-electric-blue/30 hover:shadow-[0_0_20px_rgba(79,156,247,0.1)] transition-all duration-200'
      : '',
    compact: 'p-3 rounded-lg',
    glass: 'bg-white/5 backdrop-blur-md',
  };

  const interactive = onClick ? 'cursor-pointer' : '';

  return (
    <motion.div
      className={`${baseStyles} ${variants[variant]} ${interactive} ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { Card };
