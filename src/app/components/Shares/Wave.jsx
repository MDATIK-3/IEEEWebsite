const Wave = ({ bottomColorLight = '#ECFDF5', bottomColorDark = '#022c22' }) => {
  return (
    <div className="relative -mt-1 overflow-hidden">
      <svg
        viewBox="0 0 2 1"
        preserveAspectRatio="none"
        className="w-full h-[50px] sm:h-[70px] md:h-[90px] lg:h-[110px] transition-all duration-400"
      >
        <defs>
          <path
            id="w"
            d="
              m0 1v-.5 
              q.5.5 1 0
              t1 0 1 0 1 0
              v.5z"
          />
          <style>{`
            .wave-use {
              animation: move-forever 15s linear infinite;
            }
            .wave-use:nth-child(1) { animation-duration: 6s; }
            .wave-use:nth-child(2) { animation-duration: 3s; animation-delay: -1.5s; }
            @keyframes move-forever {
              0% { transform: translate(-2px, 0) }
              100% { transform: translate(0px, 0) }
            }
          `}</style>
        </defs>

        {/* Light mode waves */}
        <g className="wave block dark:hidden">
          <use href="#w" y=".0" fill="#A7F3D0" className="wave-use" />
          <use href="#w" y=".1" fill="#6EE7B7" className="wave-use" />
          <use href="#w" y=".2" fill={bottomColorLight} className="wave-use" />
        </g>

        {/* Dark mode waves */}
        <g className="wave hidden dark:block">
          <use href="#w" y=".0" fill="#A7F3D0" className="wave-use" />
          <use href="#w" y=".1" fill="#6EE7B7" className="wave-use" />
          <use href="#w" y=".2" fill={bottomColorDark} className="wave-use" />
        </g>
      </svg>
    </div>
  );
};

export default Wave;
