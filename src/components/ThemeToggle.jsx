import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ theme, setTheme }) => {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-yellow-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all shadow-md group"
      aria-label="Toggle Theme"
      title="Toggle Light/Dark Mode"
    >
      {isDark ? (
         <Sun size={20} className="group-hover:rotate-90 transition-transform duration-500" />
      ) : (
         <Moon size={20} className="group-hover:-rotate-12 transition-transform duration-500 text-indigo-600" />
      )}
    </button>
  );
};
