export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="text-[11px] font-black tracking-[0.3em] uppercase text-white/40 mb-2">
            AI Engine Protocol
          </div>
          <div className="text-sm font-medium text-white/20">
            Powered by <span className="text-white/40 italic">TensorFlow.js + Teachable Machine</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <div className="text-sm font-mono text-white/10 tracking-widest">
            V1.0.4_BETA
          </div>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/20 mt-1 italic">
            Visual Safety Verification System
          </p>
        </div>
      </div>
    </footer>
  );
}


