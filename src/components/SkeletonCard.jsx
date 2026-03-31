export const SkeletonCard = () => {
  return (
    <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-md animate-pulse h-full flex flex-col">
      <div className="aspect-2/3 w-full bg-slate-200 dark:bg-slate-700 relative">
        <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600" />
      </div>
      <div className="p-4 flex-1 border-t border-slate-100 dark:border-slate-700/50 flex items-center">
         <div className="h-4 w-3/4 bg-slate-300 dark:bg-slate-600 rounded-md" />
      </div>
    </div>
  );
};
