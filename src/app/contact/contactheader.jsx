'use client';

function ContactHeader() {
  return (
    <header className="relative overflow-hidden py-14 px-6 sm:py-20
      bg-gradient-to-br
      from-emerald-400/10 via-emerald-500/10 to-emerald-600/10
      dark:from-slate-900 dark:via-slate-800 dark:to-slate-700
      transition-colors duration-500
    ">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-white/10 to-transparent opacity-20 pointer-events-none dark:opacity-10" />
      <div className="max-w-5xl mx-auto relative z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
          Let’s Connect
        </h1>
        <p className="text-lg sm:text-xl dark:text-gray-300 font-light leading-relaxed">
          Want to collaborate, chat about an idea, or just say hello? Fill out the form or find me on socials — I’d love to hear from you.
        </p>
      </div>
    </header>
  );
}

export default ContactHeader;
