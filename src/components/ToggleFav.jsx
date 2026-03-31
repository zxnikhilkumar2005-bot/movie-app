import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const ToggleFav = ({ isFavorite, onToggle }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.stopPropagation(); // prevent opening modal
        onToggle();
      }}
      className="p-2 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800 transition-colors group"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        size={20} 
        className={`transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-300 group-hover:text-red-400'}`} 
      />
    </motion.button>
  );
};
