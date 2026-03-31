import { useState, useEffect } from 'react';
import { Search, Bell, User, Film } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle'; // Assumes moving it or referencing existing

export const Navbar = ({ theme, setTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Transition when scrolled down more than 50px
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-500 ease-in-out ${isScrolled ? 'bg-slate-900 shadow-xl' : 'bg-transparent bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        
        {/* Left Side: Logo & Primary Navigation */}
        <div className="flex items-center gap-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <Film className="text-red-600 transition-transform duration-300 group-hover:scale-110" size={32} />
            <span className="text-2xl font-black tracking-tight text-white uppercase">
              Movie<span className="text-red-600">Vault</span>
            </span>
          </div>
          
          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-200">
            <li className="cursor-pointer font-bold text-white transition-colors">Home</li>
            <li className="cursor-pointer hover:text-white transition-colors">TV Shows</li>
            <li className="cursor-pointer hover:text-white transition-colors">Movies</li>
            <li className="cursor-pointer hover:text-white transition-colors">New & Popular</li>
            <li className="cursor-pointer hover:text-white transition-colors">My List</li>
          </ul>
        </div>

        {/* Right Side: Secondary Navigation */}
        <div className="flex items-center gap-4 sm:gap-6 text-white">
          <button className="hover:text-red-400 transition-colors hidden sm:block">
            <Search size={20} />
          </button>
          
          <button className="hover:text-red-400 transition-colors hidden sm:block">
            <Bell size={20} />
          </button>

          <ThemeToggle theme={theme} setTheme={setTheme} />
          
          {/* User Avatar Dropdown Area */}
          <div className="relative cursor-pointer flex items-center gap-2">
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
