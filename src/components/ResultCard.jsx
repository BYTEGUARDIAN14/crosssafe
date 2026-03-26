import { useMemo } from 'react';
import ConfidenceBar from './ConfidenceBar.jsx';

function pickVerdict(predictions, resultState) {
  if (!predictions?.length) return null;
  if (resultState === 'risk') return { icon: '⚠️', title: 'RISK DETECTED', theme: 'risk' };
  if (resultState === 'safe') return { icon: '✅', title: 'SAFE TO CROSS', theme: 'safe' };
  return null;
}

function colorForLabel(label) {
  const l = String(label ?? '').toLowerCase();
  if (l === 'risk' || (l.includes('risk') && !l.includes('no risk') && !l.includes('norisk'))) return 'bg-risk';
  if (l.includes('safe') || l.includes('no risk') || l.includes('norisk')) return 'bg-safe';
  return 'bg-neutral';
}

export default function ResultCard({ predictions, isAnalyzing, topConfidenceText, resultState }) {
  const verdict = useMemo(() => pickVerdict(predictions, resultState), [predictions, resultState]);

  const stateClasses = useMemo(() => {
    if (isAnalyzing) return 'border-white/10 bg-white/[0.02] opacity-60';
    if (resultState === 'safe') return 'border-safe/30 bg-safe/5 shadow-[0_0_30px_rgba(0,255,136,0.1)]';
    if (resultState === 'risk') return 'border-risk/30 bg-risk/5 shadow-[0_0_30px_rgba(255,59,59,0.1)]';
    return 'border-white/10 bg-white/[0.02]';
  }, [isAnalyzing, resultState]);

  if (!predictions?.length) {
    return (
      <div className="w-full animate-fade-in-up [animation-delay:140ms]">
        <div className={`relative overflow-hidden rounded-[2rem] border transition-all duration-500 p-8 ${stateClasses}`} role="status">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0 opacity-40">
              {isAnalyzing ? '...' : '?'}
            </div>
            <div>
              <h3 className="text-xl font-display font-black tracking-wide mb-2 uppercase opacity-40">
                Awaiting Data
              </h3>
              <p className="text-sm text-white/30 font-medium leading-relaxed max-w-[240px]">
                {isAnalyzing ? 'Processing neural layers...' : 'Upload a crossing image to begin safety verification analysis.'}
              </p>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-white/5">
            <div className="flex items-center gap-3 opacity-30">
              <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase italic">Sensors Offline</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in-up [animation-delay:140ms]">
      <div className={`relative overflow-hidden rounded-[2rem] border-2 transition-all duration-500 p-8 backdrop-blur-md ${stateClasses}`} role="status" aria-live="polite">
        {/* Dynamic Background Glow */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[80px] rounded-full opacity-20 ${resultState === 'safe' ? 'bg-safe' : 'bg-risk'}`} />
        
        <div className="relative z-10">
          <div className="flex items-start gap-6 mb-10">
            <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl shrink-0 shadow-2xl transition-all duration-500 ${resultState === 'safe' ? 'bg-safe text-bg-primary border-safe' : 'bg-risk text-white border-risk'}`}>
              {verdict?.icon}
            </div>
            <div>
              <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-2 ${resultState === 'safe' ? 'bg-safe/20 text-safe' : 'bg-risk/20 text-risk'}`}>
                Cross Evaluation
              </div>
              <h3 className="text-2xl font-display font-black tracking-tight uppercase">
                {verdict?.title}
              </h3>
              <div className="text-sm text-white/50 font-bold italic mt-1">
                Identity Certainty: <span className="text-white">{topConfidenceText ?? '—'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/20 mb-4 border-b border-white/5 pb-2">
              Neural Network Confidence Breakdown
            </div>
            <div className="space-y-5">
              {predictions.map((p) => (
                <ConfidenceBar
                  key={p.className}
                  label={p.className}
                  probability={p.probability}
                  colorClass={colorForLabel(p.className)}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${resultState === 'safe' ? 'bg-safe' : 'bg-risk'}`} />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40 italic">System Validated</span>
            </div>
            <div className="text-[9px] font-mono text-white/20">
              CROSS_ID_{Math.random().toString(36).substr(2, 6).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


