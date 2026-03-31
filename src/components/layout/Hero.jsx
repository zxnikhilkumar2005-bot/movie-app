import { Play, Info, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero = ({ onPlay }) => {
  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-screen text-white flex flex-col justify-between overflow-hidden">
      
      {/* Absolute Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=2000&auto=format&fit=crop" 
          alt="War Machine Hero Background" 
          className="w-full h-full object-cover"
        />
        {/* Netflix-style Gradients:
            1. Left gradient for text readability.
            2. Bottom gradient perfectly merges with the background color of the grid section below.
            3. Right gradient for small badges/balance. 
        */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-slate-900 to-transparent" />
      </div>

      {/* Hero Content (Left side text, Buttons) */}
      <div className="relative z-10 flex-col flex-1 flex justify-center max-w-[1400px] w-full mx-auto px-4 sm:px-8 mt-20 md:mt-0">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl md:max-w-2xl"
        >
          {/* Netflix series branding (optional) */}
          <div className="flex items-center gap-2 mb-4">
             <span className="text-red-600 font-bold uppercase tracking-widest text-sm flex items-center">
               <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span> N E T F L I X
             </span>
             <span className="text-sm font-semibold tracking-widest uppercase text-slate-300">Original</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-2 drop-shadow-2xl">
            WAR MACHINE
          </h1>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl font-light text-slate-300 mb-5 leading-snug drop-shadow-lg">
            All Grit. No Quit. Watch Now.
          </p>

          {/* Short Description */}
          <p className="text-sm md:text-base text-slate-100/90 leading-relaxed mb-8 max-w-lg drop-shadow-md">
            When a four-star general is ordered to win an impossible war, he must navigate treacherous political landscapes, brutal battlefield conditions, and his own unraveling sanity to achieve victory against all odds.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={onPlay}
              className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-2.5 md:py-3.5 rounded font-bold text-lg md:text-xl hover:bg-slate-200 transition-all hover:scale-105 shadow-xl"
            >
              <Play className="fill-black" size={24} /> Play
            </button>
            <button className="flex items-center gap-2 bg-slate-500/50 text-white backdrop-blur-md px-6 md:px-8 py-2.5 md:py-3.5 rounded font-bold text-lg md:text-xl hover:bg-slate-500/70 transition-all hover:scale-105 border border-white/10 shadow-xl">
              <Info size={24} /> More Info
            </button>
          </div>
        </motion.div>
      </div>

      {/* Age Rating Badge (Right side edge) */}
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black/60 backdrop-blur-sm border-l-4 border-slate-300 text-white pl-4 pr-6 py-2 z-10 text-lg font-bold shadow-2xl hidden md:block">
        U/A 16+
      </div>

      {/* Bottom Overlay Section: Notice & CTA */}
      <div className="relative z-10 w-full mt-auto mb-8 sm:mb-10 lg:mb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
             
             {/* Notice (Left) */}
             <div className="flex items-start gap-4">
               <AlertTriangle className="text-yellow-500 shrink-0 mt-1" size={24} />
               <div>
                 <h4 className="font-bold text-slate-200 text-base md:text-lg">Content Warning</h4>
                 <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                   This film contains sequences of intense violence, strong language throughout, and some disturbing images. Viewer discretion is advised. Audio description available.
                 </p>
               </div>
             </div>

             {/* Telegram CTA (Right) */}
             <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0 flex">
               <a 
                 href="#" 
                 className="w-full text-center bg-[#2AABEE] hover:bg-[#228ac0] text-white px-6 py-3 rounded-xl font-bold transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(42,171,238,0.3)] flex items-center justify-center gap-2"
               >
                 Join our Telegram
               </a>
             </div>

          </div>
        </div>
      </div>

    </section>
  );
};
