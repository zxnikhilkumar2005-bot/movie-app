import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Film, X } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = ({ theme, setTheme, activeTab, setActiveTab, onSearchSubmit }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When search opens, focus the input
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
       setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleSearchClick = () => {
    if (isSearchOpen && searchQuery.trim()) {
      onSearchSubmit(searchQuery);
    } else {
      setIsSearchOpen(true);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearchSubmit('');
    setIsSearchOpen(false);
  };

  const navStyles = isScrolled || isSearchOpen
    ? 'bg-slate-900 shadow-xl border-b border-slate-800'
    : 'bg-transparent bg-linear-to-b from-black/90 to-transparent';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-500 ease-in-out ${navStyles}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        
        {/* Left Side: Logo & Primary Navigation */}
        <div className="flex items-center gap-8">
          {/* Brand Logo */}
          <div onClick={() => { setActiveTab('home'); onSearchSubmit(''); setIsSearchOpen(false); setSearchQuery(''); }} className="flex items-center gap-2 cursor-pointer group z-10">
            <Film className="text-red-600 transition-transform duration-300 group-hover:scale-110" size={32} />
            <span className="text-2xl font-black tracking-tight text-white uppercase hidden sm:block">
              Movie<span className="text-red-600">Vault</span>
            </span>
          </div>
          
          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-200">
            <li onClick={() => { setActiveTab('home'); onSearchSubmit(''); setIsSearchOpen(false); setSearchQuery(''); }} className={`cursor-pointer transition-colors ${activeTab === 'home' && !searchQuery ? 'font-bold text-white' : 'hover:text-white'}`}>Home</li>
            <li onClick={() => { setActiveTab('favorites'); onSearchSubmit(''); }} className={`cursor-pointer transition-colors ${activeTab === 'favorites' ? 'font-bold text-white' : 'hover:text-white'}`}>Favorites</li>
            <li onClick={() => { setActiveTab('watchlist'); onSearchSubmit(''); }} className={`cursor-pointer transition-colors ${activeTab === 'watchlist' ? 'font-bold text-white' : 'hover:text-white'}`}>My Watchlist</li>
          </ul>
        </div>

        {/* Right Side: Secondary Navigation & Search */}
        <div className="flex items-center gap-4 sm:gap-6 text-white h-[40px]">
          
          {/* Expandable Search Input */}
          <div className="flex items-center justify-end h-full">
            <form onSubmit={handleSearchSubmit} className="flex flex-row items-center justify-end h-full relative">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden absolute right-0 flex items-center h-full bg-black/60 border border-slate-700 backdrop-blur-md rounded-full px-2"
                  >
                    <Search className="text-slate-400 ml-2 shrink-0" size={18} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      className="bg-transparent border-none outline-none text-white text-sm w-full h-full px-3 py-1.5 focus:ring-0"
                      placeholder="Titles, people, genres"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <X 
                        size={16} 
                        className="text-slate-400 hover:text-white cursor-pointer mr-2 shrink-0" 
                        onClick={handleClearSearch}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!isSearchOpen && (
                <button 
                  type="button" 
                  onClick={handleSearchClick}
                  className="hover:text-red-400 transition-colors z-10"
                >
                  <Search size={22} />
                </button>
              )}
            </form>
          </div>
          
          <button className="hover:text-red-400 transition-colors hidden sm:block shrink-0">
            <Bell size={22} />
          </button>

          <ThemeToggle theme={theme} setTheme={setTheme} />
          
          {/* User Avatar Dropdown Area */}
          <div className="relative cursor-pointer flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded shrink-0 bg-red-600 overflow-hidden border border-slate-700/50">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden sm:block text-xs">&#9662;</span>
          </div>
        </div>

      </div>
    </nav>
  );
};
