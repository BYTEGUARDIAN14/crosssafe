import { useEffect, useMemo, useState } from 'react';
import './ConfidenceBar.css';

export default function ConfidenceBar({ label, probability, color }) {
  const pct = useMemo(() => Math.max(0, Math.min(100, (probability ?? 0) * 100)), [probability]);
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setAnimatedPct(pct), 40);
    return () => window.clearTimeout(t);
  }, [pct]);

  return (
    <div className="barRow">
      <div className="barTop">
        <div className="barLabel">{label}</div>
        <div className="barPct">{pct.toFixed(1)}%</div>
      </div>
      <div className="barTrack" aria-label={`${label} confidence`}>
        <div className="barFill" style={{ width: `${animatedPct}%`, background: color }} />
        <div className="barGlow" style={{ width: `${animatedPct}%`, background: color }} />
      </div>
    </div>
  );
}

