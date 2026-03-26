import { useEffect, useMemo, useState } from 'react';

export default function ConfidenceBar({ label, probability, colorClass }) {
  const pct = useMemo(() => Math.max(0, Math.min(100, (probability ?? 0) * 100)), [probability]);
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setAnimatedPct(pct), 40);
    return () => window.clearTimeout(t);
  }, [pct]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2 px-1">
        <div className="text-[11px] font-black tracking-widest text-white/40 uppercase truncate mr-2">
          {label}
        </div>
        <div className="text-xs font-mono font-bold text-white/80 tabular-nums">
          {pct.toFixed(1)}%
        </div>
      </div>
      
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative" aria-label={`${label} confidence`}>
        {/* Track Glow Background */}
        <div className="absolute inset-0 opacity-10" />
        
        {/* Animated Fill */}
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out relative z-10 ${colorClass}`} 
          style={{ width: `${animatedPct}%` }}
        >
          {/* Progress Head Glow */}
          {animatedPct > 0 && (
            <div className={`absolute right-0 top-0 bottom-0 w-4 blur-sm opacity-50 ${colorClass}`} />
          )}
        </div>
        
        {/* Secondary Glow Layer */}
        <div 
          className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out opacity-20 blur-md ${colorClass}`} 
          style={{ width: `${animatedPct}%` }}
        />
      </div>
    </div>
  );
}


