import { motion } from 'framer-motion';
import { ToggleFav } from './ToggleFav';
import { Bookmark, BookmarkCheck } from 'lucide-react';

export const MovieCard = ({ movie, isFavorite, isWatchlist, onToggleFav, onToggleWatchlist, onClick }) => {
  const posterUrl = movie.Poster !== 'N/A' 
    ? movie.Poster 
    : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:shadow-red-500/20 dark:hover:shadow-red-500/20 transition-all duration-300 border border-slate-200 dark:border-slate-700/50 flex flex-col h-full"
    >
      <div className="aspect-[2/3] w-full overflow-hidden relative">
        <img 
          src={posterUrl} 
          alt={movie.Title}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0">
          <ToggleFav isFavorite={isFavorite} onToggle={() => onToggleFav(movie)} />
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(movie);
            }}
            className="p-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-600 hover:bg-slate-700 transition-colors shadow-lg"
            title={isWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {isWatchlist ? (
              <BookmarkCheck size={20} className="text-emerald-400" />
            ) : (
              <Bookmark size={20} className="text-slate-300 hover:text-white" />
            )}
          </motion.button>
        </div>

        {/* Info displayed prominently on active/hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end h-full pointer-events-none">
           <div className="flex items-center gap-2 mb-2">
             <span className="px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded shadow-sm">
                {movie.Year}
             </span>
             <span className="px-2 py-0.5 text-xs font-semibold bg-slate-800/80 text-slate-200 rounded backdrop-blur-md capitalize">
                {movie.Type}
             </span>
           </div>
           <p className="text-slate-300 text-xs line-clamp-2">Click to view details & trailer</p>
        </div>
      </div>
      
      {/* Persistent Title Bar */}
      <div className="p-4 bg-white dark:bg-slate-800 flex-1 flex items-center border-t border-slate-100 dark:border-slate-700/50">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
          {movie.Title}
        </h3>
      </div>
    </motion.div>
  );
};
