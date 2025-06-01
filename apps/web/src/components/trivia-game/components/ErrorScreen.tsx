import { motion } from "framer-motion";

interface ErrorScreenProps {
  error: string;
  onRetry: () => void;
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  return (
    <div className="text-center p-6 sm:p-8">
      <div className="text-red-400 mb-4">
        <span className="text-xl sm:text-2xl">⚠️</span>
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-2">
        Connection Error
      </h3>
      <p className="text-green-400/70 mb-6 text-sm sm:text-base px-4 max-w-md mx-auto break-words">
        {error}
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="border border-red-400 text-red-400 px-4 sm:px-6 py-2 rounded font-bold text-sm sm:text-base hover:bg-red-400/10 transition-all duration-200"
      >
        &gt; BACK TO MENU
      </motion.button>
    </div>
  );
}
