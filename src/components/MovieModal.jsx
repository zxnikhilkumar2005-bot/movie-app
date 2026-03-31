import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Calendar, Clock, Award, PlayCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getMovieDetailsApi } from '../utils/api';
import { fetchTrailerVideoId } from '../utils/youtube';

export const MovieModal = ({ movieId, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Trailer State
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [trailerId, setTrailerId] = useState(null);
  const [trailerError, setTrailerError] = useState(null);

  useEffect(() => {
    if (!movieId) return;
    
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await getMovieDetailsApi(movieId);
        setDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
    // Reset states when changing movies
    setShowTrailer(false);
    setTrailerId(null);
    setTrailerError(null);
  }, [movieId]);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handlePlayTrailer = async () => {
    setShowTrailer(true);
    if (trailerId) return; // If already fetched, don't refetch

    setTrailerLoading(true);
    setTrailerError(null);
    try {
      const vidId = await fetchTrailerVideoId(details.Title, details.Year);
      if (vidId) {
        setTrailerId(vidId);
      } else {
        setTrailerError('Trailer not available for this movie.');
      }
    } catch (err) {
      console.error(err);
      setTrailerError('Failed to load trailer due to network issues.');
    } finally {
      setTrailerLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md cursor-pointer"
        />
        
        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700/50 z-10 max-h-[95vh] flex flex-col md:flex-row"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-full backdrop-blur-md transition-colors shadow-lg"
          >
            <X size={20} />
          </button>

          {loading && (
             <div className="w-full h-[60vh] flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
               <Loader2 className="w-10 h-10 animate-spin mb-4 text-red-500" />
               <p className="font-medium animate-pulse">Fetching movie database...</p>
             </div>
          )}

          {error && !loading && (
             <div className="w-full h-64 flex flex-col items-center justify-center text-red-500 bg-red-50 dark:bg-red-500/10 p-8 text-center text-lg font-medium">
               <AlertCircle size={48} className="mb-4 text-red-400" />
               <p>{error}</p>
             </div>
          )}

          {!loading && !error && details && (
            <>
              {/* Left Column: Poster / Trailer */}
              <div className="w-full md:w-5/12 aspect-2/3 md:aspect-auto shrink-0 relative bg-black flex flex-col">
                 
                 {showTrailer ? (
                   <div className="w-full h-full min-h-[300px] bg-black relative flex flex-col items-center justify-center">
                     {trailerLoading && (
                        <div className="flex flex-col items-center text-slate-400">
                          <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-2" />
                          <p className="text-sm font-medium">Extracting Trailer...</p>
                        </div>
                     )}
                     
                     {trailerError && !trailerLoading && (
                        <div className="flex flex-col items-center text-center p-6">
                           <AlertCircle className="w-12 h-12 text-slate-500 mb-2" />
                           <p className="text-slate-400 font-medium">{trailerError}</p>
                           <button onClick={() => setShowTrailer(false)} className="mt-4 px-4 py-2 border border-slate-600 rounded-full text-sm text-slate-300 hover:text-white transition-colors">Return to Poster</button>
                        </div>
                     )}

                     {!trailerLoading && trailerId && (
                        <iframe 
                           className="w-full h-full object-cover absolute inset-0"
                           src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`} 
                           title={`${details.Title} Trailer`}
                           frameBorder="0" 
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                           allowFullScreen
                        />
                     )}
                   </div>
                 ) : (
                   <>
                     <img 
                       src={details.Poster !== 'N/A' ? details.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop'} 
                       alt={details.Title}
                       className="w-full h-full object-cover"
                       onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop'; }}
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                     
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm group cursor-pointer hover:scale-105" onClick={handlePlayTrailer}>
                        <div className="flex flex-col items-center gap-3 transform group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                           <PlayCircle size={64} className="text-white fill-red-600 drop-shadow-2xl" />
                           <span className="font-bold text-white tracking-widest uppercase text-sm drop-shadow-xl">Play Trailer</span>
                        </div>
                     </div>
                   </>
                 )}
              </div>
              
              {/* Right Column: Details */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white dark:bg-slate-900">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                   {details.Rated && details.Rated !== 'N/A' && (
                     <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
                       {details.Rated}
                     </span>
                   )}
                   <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                     <Clock size={16} /> {details.Runtime}
                   </span>
                   <span className="text-sm font-medium text-slate-500 dark:text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                     {details.Language}
                   </span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">
                  {details.Title}
                </h2>
                
                <p className="text-red-500 font-semibold mb-6 flex flex-wrap gap-2 text-sm uppercase tracking-wider">
                  {details.Genre.split(',').map(g => <span key={g} className="px-3 py-1 bg-red-50 dark:bg-red-500/10 rounded-full">{g.trim()}</span>)}
                </p>
                
                <div className="flex items-center gap-6 mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">IMDb Rating</span>
                    <div className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
                      <Star size={24} className="fill-yellow-400 text-yellow-500 drop-shadow-sm" />
                      <span>{details.imdbRating !== 'N/A' ? details.imdbRating : '--'}<span className="text-sm text-slate-400 font-medium">/10</span></span>
                    </div>
                  </div>
                  
                  <div className="w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Release Year</span>
                    <div className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
                      <Calendar size={22} className="text-blue-500" />
                      <span>{details.Year}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Plot Summary</h4>
                    <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">{details.Plot}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 p-5 bg-slate-50 dark:bg-slate-800/30 rounded-2xl text-sm">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block mb-1 font-semibold uppercase text-xs">Director</span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium">{details.Director}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block mb-1 font-semibold uppercase text-xs">Main Cast</span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium">{details.Actors}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block mb-1 font-semibold uppercase text-xs">Box Office</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{details.BoxOffice || 'N/A'}</span>
                    </div>
                    {details.Awards !== 'N/A' && (
                      <div className="sm:col-span-2 flex items-start gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                         <Award size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                         <span className="text-slate-600 dark:text-slate-300 italic font-medium leading-tight">{details.Awards}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
