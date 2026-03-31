import { useState, useEffect } from 'react';
import { Play, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeroMovies } from '../../hooks/useHeroMovies';

export const Hero = ({ onPlay }) => {
  const { heroMovies, loading, error } = useHeroMovies();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!heroMovies || heroMovies.length === 0) return;

    // Change movie every 8 seconds
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroMovies.length);
    }, 8000);

    return () => clearInterval(intervalId);
  }, [heroMovies]);

  if (loading) {
    return (
      <section className="relative w-full min-h-[85vh] sm:min-h-screen text-white flex flex-col justify-center items-center bg-slate-900 animate-pulse">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  if (error || !heroMovies || heroMovies.length === 0) {
    return (
      <section className="relative w-full min-h-[60vh] text-white flex flex-col justify-center items-center bg-slate-900">
        <p className="text-xl text-slate-400">Unable to load featured movies.</p>
      </section>
    );
  }

  const currentMovie = heroMovies[currentIndex];
  // Ensure we have a high quality background image. If OMDB poster is low quality, we could use an unsplash fallback,
  // but OMDB posters are usually okay. Let's try to blur the background and show the clear poster, or just use it.
  const bgImage = currentMovie.Poster !== 'N/A' 
    ? currentMovie.Poster 
    : 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=2000&auto=format&fit=crop';

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-screen text-white flex flex-col justify-center overflow-hidden bg-slate-950">
      
      <AnimatePresence mode="wait">
        <motion.div
           key={currentIndex}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 1.5, ease: 'easeInOut' }}
           className="absolute inset-0 z-0"
        >
          {/* Background Image Layer */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ backgroundImage: `url(${bgImage})`, filter: 'blur(3px) brightness(0.6)' }}
          />

          {/* Sharp Poster Right aligned for desktop */}
          <div className="absolute right-[5%] top-1/2 -translate-y-1/2 hidden lg:block w-[350px] aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 rotate-2">
            <img src={bgImage} alt={currentMovie.Title} className="w-full h-full object-cover" />
          </div>

          {/* Netflix-style Gradients */}
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 lg:via-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative z-10 flex-col flex-1 flex justify-center max-w-[1400px] w-full mx-auto px-4 sm:px-8 mt-20 md:mt-0 pt-20">
        <AnimatePresence mode="wait">
          <motion.div 
            key={`text-${currentIndex}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl md:max-w-2xl lg:max-w-3xl"
          >
            {/* Netflix series branding */}
            <div className="flex items-center gap-2 mb-4">
               <span className="text-red-600 font-bold uppercase tracking-widest text-sm flex items-center">
                 <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2 shadow-[0_0_10px_red]"></span> N E T F L I X
               </span>
               <span className="text-sm font-semibold tracking-widest uppercase text-slate-300">Film</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-3 drop-shadow-2xl text-white">
              {currentMovie.Title}
            </h1>
            
            {/* Metadata (Year, Runtime, Rating, Genre) */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base font-medium text-slate-300 mb-5">
               <span className="text-green-500 font-bold">{currentMovie.imdbRating} Rating</span>
               <span className="px-2 py-0.5 border border-slate-500 rounded text-xs">{currentMovie.Rated || 'U/A 16+'}</span>
               <span>{currentMovie.Year}</span>
               <span>{currentMovie.Runtime}</span>
               <span className="hidden sm:inline-block px-2 text-slate-500">•</span>
               <span className="hidden sm:inline-block text-slate-400">{currentMovie.Genre}</span>
            </div>

            {/* Short Description */}
            <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed mb-8 max-w-lg lg:max-w-xl drop-shadow-md line-clamp-3 sm:line-clamp-4">
              {currentMovie.Plot !== 'N/A' ? currentMovie.Plot : 'No description available for this title.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={onPlay}
                className="flex items-center justify-center gap-2 bg-white text-black px-6 sm:px-8 py-2.5 sm:py-3.5 rounded font-bold text-base sm:text-xl hover:bg-slate-200 transition-all hover:scale-105 shadow-xl min-w-[140px]"
              >
                <Play className="fill-black" size={24} /> Play
              </button>
              <button 
                className="flex items-center justify-center gap-2 bg-slate-500/50 text-white backdrop-blur-md px-6 sm:px-8 py-2.5 sm:py-3.5 rounded font-bold text-base sm:text-xl hover:bg-slate-500/70 transition-all hover:scale-105 border border-white/10 shadow-xl min-w-[170px]"
              >
                <Info size={24} /> More Info
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </section>
  );
};
