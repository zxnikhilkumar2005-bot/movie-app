import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export const SearchBar = ({ value, onChange, onSearchSubmit, recentSearches, onSelectRecent }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full max-w-3xl mx-auto my-6 group">
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit(value);
        }}
        className="relative"
      >
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-slate-400 dark:text-slate-500 group-focus-within:text-red-600 dark:group-focus-within:text-red-500 transition-colors" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full pl-14 pr-4 py-4.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-300 dark:border-slate-700/50 text-slate-900 dark:text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-xl font-medium placeholder-slate-400 dark:placeholder-slate-500"
          placeholder="Search movies, series, episodes..."
        />
        <button 
          type="submit"
          className="absolute right-2 top-2 bottom-2 px-6 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-colors shadow-md hidden sm:block"
        >
          Search
        </button>
      </form>

      {/* Recent Searches Dropdown */}
      {isFocused && recentSearches && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-40 origin-top animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Recent Searches
          </div>
          <ul>
            {recentSearches.map((term, index) => (
              <li key={index}>
                <button
                  onClick={() => onSelectRecent(term)}
                  className="w-full text-left px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-3"
                >
                  <Search size={16} className="text-slate-400" />
                  {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
