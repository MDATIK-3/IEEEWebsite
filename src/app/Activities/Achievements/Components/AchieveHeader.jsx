import BgColor from "@/app/components/BgColor";
import Wave from "@/app/components/Shares/Wave";


const AchieveHeader = () => (
  <div className="relative bg-gradient-to-br from-emerald-800 via-teal-700 to-cyan-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 overflow-hidden">

    <div className="absolute inset-0 bg-black/20 dark:bg-slate-900/50" />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white dark:text-slate-100 leading-tight mb-6 drop-shadow-lg select-none relative inline-block group">
        Achievements
        <span
          className="block absolute left-1/2 -bottom-1 h-1 w-full bg-gradient-to-r from-cyan-400 to-green-400 dark:from-cyan-500 dark:to-emerald-500
          scale-x-0 group-hover:scale-x-100 origin-center -translate-x-1/2 transition-transform duration-300 ease-in-out rounded"
        />
      </h1>
    </div>
    <BgColor />
    <Wave />
  </div>
);

export default AchieveHeader;
