function Badge({ 
  children, 
  variant = 'info', 
  icon: Icon,
  className = '',
  ...props 
}) {
  const baseStyles = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide';
  
  const variants = {
    success: 'bg-aurora-green/10 text-aurora-green',
    warning: 'bg-solar-amber/10 text-solar-amber',
    danger: 'bg-danger-red/10 text-danger-red',
    info: 'bg-electric-blue/10 text-electric-blue',
    purple: 'bg-cosmic-purple/10 text-cosmic-purple',
    default: 'bg-electric-blue/10 text-electric-blue',
    active: 'bg-aurora-green/10 text-aurora-green',
    completed: 'bg-cosmic-purple/10 text-cosmic-purple',
    planned: 'bg-solar-amber/10 text-solar-amber',
    live: 'bg-danger-red/10 text-danger-red animate-pulse',
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.default} ${className}`} {...props}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </span>
  );
}

export { Badge };
