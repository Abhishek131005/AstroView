import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

function LearnPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <GraduationCap className="w-8 h-8 text-electric-blue" />
        <div>
          <h1 className="text-4xl font-bold font-heading text-star-white">
            Learn & Explore
          </h1>
          <p className="text-muted-gray mt-1">
            Discover space facts and ask questions
          </p>
        </div>
      </div>

      {/* Learning content will be added in later phases */}
      <div className="space-y-6">
        <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 h-40 flex items-center justify-center">
          <p className="text-muted-gray">AI-powered Q&A</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 h-48 flex items-center justify-center">
            <p className="text-muted-gray">Space facts</p>
          </div>
          <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 h-48 flex items-center justify-center">
            <p className="text-muted-gray">Learning modules</p>
          </div>
          <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 h-48 flex items-center justify-center">
            <p className="text-muted-gray">Resources</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export { LearnPage };
