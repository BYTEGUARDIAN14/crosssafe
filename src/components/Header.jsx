function LogoMark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 20V4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M18 20V4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M8.5 7.5H15.5M8.5 11H15.5M8.5 14.5H15.5M8.5 18H15.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3.75 20.25H20.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-bg-primary/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 group" aria-label="CrossSafe">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral group-hover:scale-110 transition-transform duration-300 border border-white/10 group-hover:border-neutral/30 group-hover:shadow-[0_0_15px_rgba(0,191,255,0.2)]">
            <LogoMark />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-display font-black tracking-wider uppercase bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              CrossSafe
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/20 italic">
              Safety Analysis Protocol
            </span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/60">
              System Live
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}


