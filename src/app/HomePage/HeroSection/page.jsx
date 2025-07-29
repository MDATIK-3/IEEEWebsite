import RadialBackground from './RadialBackground';
import HeroText from './HeroText';
import HeroCard from './HeroCard';
import BackgroundBlobs from './BackgroundBlobs';
import FloatingDecorations from "./FloatingDecorations";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen overflow-hidden flex items-center justify-center
        pt-16 pb-8 px-4
        sm:pt-20 sm:pb-10 sm:px-6
        lg:pt-[56px] lg:pb-10 lg:px-8
        bg-white dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
        transition-colors duration-500"
    >
      <BackgroundBlobs />
      <RadialBackground />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div
          className="grid grid-cols-1 gap-8 mx-auto max-w-lg
            sm:gap-10 sm:max-w-2xl
            lg:max-w-full lg:grid-cols-2 lg:items-center lg:gap-x-16 lg:gap-y-12"
        >
          <div className="order-1 lg:order-1">
            <HeroText />
          </div>

          <div className="relative order-2 lg:order-2">
            <HeroCard />
            <FloatingDecorations />

            <div
              className="absolute inset-0 rounded-3xl blur-xl transition-all duration-700 
                bg-gradient-to-br from-green-500/20 to-blue-500/20
                dark:from-green-400/10 dark:to-blue-400/10
                -z-10 scale-105 sm:scale-110 lg:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
