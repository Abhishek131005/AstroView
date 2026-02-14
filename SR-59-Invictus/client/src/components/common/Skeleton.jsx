function Skeleton({ 
  className = '', 
  variant = 'default',
  count = 1,
  ...props 
}) {
  const baseStyles = 'bg-bg-tertiary animate-pulse rounded';
  
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    circle: 'h-12 w-12 rounded-full',
    rectangle: 'h-32 w-full',
    card: 'h-64 w-full rounded-2xl',
  };

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export { Skeleton };
