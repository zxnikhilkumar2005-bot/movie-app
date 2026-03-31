import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { SkeletonCard } from './SkeletonCard';
import { useCategoryMovies } from '../hooks/useCategoryMovies';

export const HomeRow = ({ title, query, favorites, watchlist, onToggleFav, onToggleWatchlist, onSelectMovie }) => {
  const rowRef = useRef(null);
  const { movies, loading, error } = useCategoryMovies(query);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!loading && !error && movies.length === 0) return null;

  return (
    <div className="mb-8 relative group w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 px-4 sm:px-8">
        {title}
      </h2>

      {/* Scroll Left Button */}
      <button 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-md hidden sm:block backdrop-blur-sm"
        onClick={() => handleScroll('left')}
      >
        <ChevronLeft size={32} />
      </button>

      {/* Scrollable Container */}
      <div 
        ref={rowRef} 
        className="flex overflow-x-auto gap-4 sm:gap-6 px-4 sm:px-8 pb-6 pt-2 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading && (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={`skel-${i}`} className="min-w-[160px] sm:min-w-[200px] snap-center shrink-0">
               <SkeletonCard />
            </div>
          ))
        )}

        {error && !loading && (
           <div className="text-red-500 py-10 px-4 w-full text-center bg-red-500/10 rounded-xl">
             Failed to load {title}: {error}
           </div>
        )}

        {!loading && !error && movies.map((movie) => (
          <div key={`${title}-${movie.imdbID}`} className="min-w-[140px] sm:min-w-[200px] w-[140px] sm:w-[200px] snap-center shrink-0">
            <MovieCard 
              movie={movie}
              isFavorite={favorites.some(f => f.imdbID === movie.imdbID)}
              isWatchlist={watchlist.some(w => w.imdbID === movie.imdbID)}
              onToggleFav={onToggleFav}
              onToggleWatchlist={onToggleWatchlist}
              onClick={() => onSelectMovie(movie.imdbID)}
            />
          </div>
        ))}
      </div>

      {/* Scroll Right Button */}
      <button 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-md hidden sm:block backdrop-blur-sm"
        onClick={() => handleScroll('right')}
      >
        <ChevronRight size={32} />
      </button>

      {/* For hiding scrollbars gracefully globally, we can use a small style block or tailwind plugin.
          Since we use style={{ scrollbarWidth: 'none' }}, webkit needs a pseudo element in CSS. */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
