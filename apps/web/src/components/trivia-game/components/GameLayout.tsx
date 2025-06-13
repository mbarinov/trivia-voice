import { motion } from "framer-motion";

interface GameLayoutProps {
  children: React.ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-black border border-green-400/30 rounded-xl w-full max-w-6xl h-[92vh] sm:h-[90vh] lg:h-[85vh] overflow-hidden p-1 sm:p-0">
        {children}
      </div>
    </motion.div>
  );
}
