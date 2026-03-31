import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { MovieCard } from './components/MovieCard';
import { SkeletonCard } from './components/SkeletonCard';
import { MovieModal } from './components/MovieModal';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/layout/Hero';
import { HomeRow } from './components/HomeRow';
import { useMovies } from './hooks/useMovies';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AlertCircle, Heart, Bookmark, Filter, Home, Loader2 } from 'lucide-react';

function App() {
  const [theme, setTheme] = useLocalStorage('movieAppTheme', 'dark');
  const [favorites, setFavorites] = useLocalStorage('movieFavorites', []);
  const [watchlist, setWatchlist] = useLocalStorage('movieWatchlist', []);
  
  const [isSearching, setIsSearching] = useState(false);
  const [activeQuery, setActiveQuery] = useState('');
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('home'); // home | favorites | watchlist
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  
  const [filters, setFilters] = useState({ type: '', year: '', sortByYear: false });
  const [showFilters, setShowFilters] = useState(false);

  const { movies, loading, loadingMore, error, totalResults, searchMovies, setMovies } = useMovies();
  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initial Fetch & Search Updates (Only trigger if isSearching is true)
  useEffect(() => {
    if (activeTab === 'home' && isSearching && activeQuery) {
      setPage(1);
      searchMovies(activeQuery, 1, filters);
    }
  }, [activeQuery, filters, activeTab, isSearching, searchMovies]);

  // Infinite Scroll Trigger (Only when searching)
  useEffect(() => {
    if (inView && activeTab === 'home' && isSearching && !loading && !loadingMore && movies.length < totalResults) {
      const next = page + 1;
      setPage(next);
      searchMovies(activeQuery, next, filters);
    }
  }, [inView, activeTab, isSearching, loading, loadingMore, movies.length, totalResults, page, activeQuery, filters, searchMovies]);

  const handleSearchSubmit = (searchVal) => {
    if (!searchVal.trim()) {
       setIsSearching(false);
       setActiveQuery('');
       return;
    }
    setIsSearching(true);
    setActiveQuery(searchVal);
    setActiveTab('home');
  };

  const toggleFavorite = (movie) => {
    setFavorites(prev => {
      const isFav = prev.find(m => m.imdbID === movie.imdbID);
      return isFav ? prev.filter(m => m.imdbID !== movie.imdbID) : [...prev, movie];
    });
  };

  const toggleWatchlist = (movie) => {
    setWatchlist(prev => {
      const isWatched = prev.find(m => m.imdbID === movie.imdbID);
      return isWatched ? prev.filter(m => m.imdbID !== movie.imdbID) : [...prev, movie];
    });
  };

  const handleSortByYear = () => {
    setFilters(f => ({ ...f, sortByYear: !f.sortByYear }));
    if (!filters.sortByYear) {
      setMovies(prev => [...prev].sort((a, b) => parseInt(b.Year || '0') - parseInt(a.Year || '0')));
    } else {
      searchMovies(activeQuery, 1, { ...filters, sortByYear: false });
      setPage(1);
    }
  };

  const getDisplayedData = () => {
    if (activeTab === 'favorites') return favorites;
    if (activeTab === 'watchlist') return watchlist;
    return movies;
  };

  const displayedMovies = getDisplayedData();

  const handleScrollToContent = () => {
     window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen transition-colors duration-500 pb-20 font-sans dark:bg-slate-950 bg-slate-50">
      
      {/* Search integrated exclusively in Navbar */}
      <Navbar 
        theme={theme} 
        setTheme={setTheme} 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 'home') setIsSearching(false);
        }} 
        onSearchSubmit={handleSearchSubmit}
      />
      
      {/* Netflix-style Homepage Layout */}
      {!isSearching && activeTab === 'home' && (
        <div className="pb-10">
          <Hero onPlay={handleScrollToContent} />
          
          <div className="max-w-[1400px] mx-auto mt-[-80px] sm:mt-[-120px] relative z-20 space-y-10 sm:space-y-16">
            <HomeRow 
               title="Trending Now" 
               query="Marvel" 
               favorites={favorites} 
               watchlist={watchlist} 
               onToggleFav={toggleFavorite} 
               onToggleWatchlist={toggleWatchlist} 
               onSelectMovie={setSelectedMovieId}
            />
            <HomeRow 
               title="Top Rated Features" 
               query="Batman" 
               favorites={favorites} 
               watchlist={watchlist} 
               onToggleFav={toggleFavorite} 
               onToggleWatchlist={toggleWatchlist} 
               onSelectMovie={setSelectedMovieId}
            />
            <HomeRow 
               title="Sci-Fi & Fantasy" 
               query="Star" 
               favorites={favorites} 
               watchlist={watchlist} 
               onToggleFav={toggleFavorite} 
               onToggleWatchlist={toggleWatchlist} 
               onSelectMovie={setSelectedMovieId}
            />
            <HomeRow 
               title="Crime & Action" 
               query="Fast" 
               favorites={favorites} 
               watchlist={watchlist} 
               onToggleFav={toggleFavorite} 
               onToggleWatchlist={toggleWatchlist} 
               onSelectMovie={setSelectedMovieId}
            />
            <HomeRow 
               title="Award Winners" 
               query="Lord of the rings" 
               favorites={favorites} 
               watchlist={watchlist} 
               onToggleFav={toggleFavorite} 
               onToggleWatchlist={toggleWatchlist} 
               onSelectMovie={setSelectedMovieId}
            />
          </div>
        </div>
      )}

      {/* Main Content Area: Search Grid / Favorites / Watchlist */}
      <main className={`max-w-[1400px] mx-auto px-4 sm:px-8 ${(!isSearching && activeTab === 'home') ? 'pt-0' : 'pt-28'}`}>
        
        {/* Search Results Controls */}
        {activeTab === 'home' && isSearching && (
          <div className="mb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              
              <div>
                <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Results for <span className="text-red-500">"{activeQuery}"</span>
                </h2>
                {!loading && !error && totalResults > 0 && (
                  <p className="text-slate-500 dark:text-slate-400 mt-1">{totalResults} titles found</p>
                )}
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${showFilters ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
                >
                  <Filter size={16} /> Filters
                </button>
              </div>
            </div>
            
            {showFilters && (
              <div className="flex flex-wrap gap-3 mt-4 animate-in zoom-in-95 duration-200">
                <select 
                  value={filters.type} 
                  onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  <option value="">All Types</option>
                  <option value="movie">Movies</option>
                  <option value="series">Series</option>
                  <option value="episode">Episodes</option>
                </select>

                <input 
                  type="number" 
                  placeholder="Year (e.g. 2024)" 
                  value={filters.year}
                  onChange={(e) => setFilters(f => ({ ...f, year: e.target.value }))}
                  className="w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
                
                <button 
                  onClick={handleSortByYear}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filters.sortByYear ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
                >
                  Sort by Year {filters.sortByYear && '(Client)'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab Headers for Mobile & Desktop when not home */}
        {activeTab !== 'home' && (
           <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-500">
             <h2 className="text-3xl font-black text-slate-900 dark:text-white capitalize flex items-center justify-center gap-3">
               {activeTab === 'favorites' ? <Heart size={32} className="text-red-500" /> : <Bookmark size={32} className="text-emerald-500" />}
               My {activeTab}
             </h2>
             <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{displayedMovies.length} items saved</p>
           </div>
        )}

        {/* Empty States */}
        {activeTab === 'favorites' && displayedMovies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-500 animate-in fade-in">
             <Heart size={80} className="mb-6 opacity-20" />
             <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">No favorites yet</h2>
             <p className="mt-2 text-center max-w-sm">Tap the heart icon on any movie you love to build your personal collection.</p>
          </div>
        )}

        {activeTab === 'watchlist' && displayedMovies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-500 animate-in fade-in">
             <Bookmark size={80} className="mb-6 opacity-20" />
             <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Watchlist is empty</h2>
             <p className="mt-2 text-center max-w-sm">Keep track of movies you want to watch later by tapping the bookmark icon.</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && activeTab === 'home' && isSearching && (
          <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95">
             <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-3xl border border-red-100 dark:border-red-500/20 max-w-md text-center">
               <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
               <p className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Oops!</p>
               <p className="text-slate-700 dark:text-slate-300">{error}</p>
             </div>
          </div>
        )}

        {/* Core Grid Container for Searches, Favorites, Watchlist */}
        {(isSearching || activeTab !== 'home') && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 relative">
            
            {displayedMovies.map((movie) => (
               <MovieCard 
                 key={`${movie.imdbID}-${activeTab}`} 
                 movie={movie}
                 isFavorite={favorites.some(f => f.imdbID === movie.imdbID)}
                 isWatchlist={watchlist.some(w => w.imdbID === movie.imdbID)}
                 onToggleFav={toggleFavorite}
                 onToggleWatchlist={toggleWatchlist}
                 onClick={() => setSelectedMovieId(movie.imdbID)}
               />
            ))}

            {/* Initial Loading Skeletons */}
            {loading && activeTab === 'home' && Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={`skel-initial-${i}`} />)}
            
            {/* Append Skeletons when fetching next page */}
            {loadingMore && activeTab === 'home' && Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={`skel-more-${i}`} />)}
          </div>
        )}

        {/* Infinite Scroll Trigger Node */}
        {activeTab === 'home' && isSearching && !loading && !error && movies.length < totalResults && (
           <div ref={ref} className="w-full flex justify-center py-16 opacity-0">
             <Loader2 size={32} className="animate-spin text-slate-400" />
           </div>
        )}
      </main>

      {/* Footer Navigation (Mobile Only) */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-around p-3 pb-safe z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
         <button onClick={() => { setActiveTab('home'); setIsSearching(false); setActiveQuery(''); }} className={`p-2 flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' && !isSearching ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
           <Home size={24} className={activeTab === 'home' && !isSearching ? 'text-red-600' : ''} /> <span className="text-[10px] font-bold">Home</span>
         </button>
         <button onClick={() => { setActiveTab('favorites'); setIsSearching(false); }} className={`p-2 flex flex-col items-center gap-1 transition-colors ${activeTab === 'favorites' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
           <Heart size={24} className={activeTab === 'favorites' ? 'fill-red-500 text-red-500' : ''}/> <span className="text-[10px] font-bold">Favorites</span>
         </button>
         <button onClick={() => { setActiveTab('watchlist'); setIsSearching(false); }} className={`p-2 flex flex-col items-center gap-1 transition-colors ${activeTab === 'watchlist' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
           <Bookmark size={24} className={activeTab === 'watchlist' ? 'fill-emerald-500 text-emerald-500' : ''}/> <span className="text-[10px] font-bold">Watchlist</span>
         </button>
      </nav>

      {/* Movie Details Modal */}
      {selectedMovieId && (
        <MovieModal movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
      )}
    </div>
  );
}

export default App;
