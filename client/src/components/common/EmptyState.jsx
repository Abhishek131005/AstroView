import { motion } from 'framer-motion';

function EmptyState({ 
  icon: Icon, 
  title, 
  message, 
  action,
  className = '',
}) {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center text-center p-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icon */}
      {Icon && (
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-electric-blue/10 mb-4">
          <Icon className="w-8 h-8 text-electric-blue" />
        </div>
      )}

      {/* Title */}
      {title && (
        <h3 className="text-xl font-bold font-heading text-star-white mb-2">
          {title}
        </h3>
      )}

      {/* Message */}
      {message && (
        <p className="text-muted-gray max-w-md mb-6">
          {message}
        </p>
      )}

      {/* Action */}
      {action && <div>{action}</div>}
    </motion.div>
  );
}

export default EmptyState;
