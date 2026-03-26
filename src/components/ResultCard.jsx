import { useMemo } from 'react';
import './ResultCard.css';
import ConfidenceBar from './ConfidenceBar.jsx';

function pickVerdict(predictions, resultState) {
  if (!predictions?.length) return null;
  if (resultState === 'risk') return { icon: '⚠️', title: 'RISK DETECTED' };
  if (resultState === 'safe') return { icon: '✅', title: 'SAFE TO CROSS' };
  return null;
}

function colorForLabel(label) {
  const l = String(label ?? '').toLowerCase();
  if (l === 'risk' || (l.includes('risk') && !l.includes('no risk') && !l.includes('norisk'))) return 'var(--accent-risk)';
  if (l.includes('safe') || l.includes('no risk') || l.includes('norisk')) return 'var(--accent-safe)';
  return 'var(--accent-neutral)';
}

export default function ResultCard({ predictions, isAnalyzing, topConfidenceText, resultState }) {
  const verdict = useMemo(() => pickVerdict(predictions, resultState), [predictions, resultState]);

  if (!predictions?.length) {
    return (
      <div className="resultWrap" style={{ animationDelay: '140ms' }}>
        <div className={`resultCard ${isAnalyzing ? 'resultCard--analyzing' : ''}`} role="status">
          <div className="resultHeader">
            <div className="resultIcon resultIcon--neutral" aria-hidden="true">
              ⌁
            </div>
            <div>
              <div className="resultTitle">Awaiting image</div>
              <div className="resultSub">
                {isAnalyzing ? 'Analyzing…' : 'Upload a zebra crossing image to get SAFE/RISK predictions.'}
              </div>
            </div>
          </div>
          <div className="resultBody">
            <div className="hintRow">
              <span className="hintDot" />
              <span>Confidence bars will appear here.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resultWrap" style={{ animationDelay: '140ms' }}>
      <div className={`resultCard resultCard--${resultState}`} role="status" aria-live="polite">
        <div className="resultHeader">
          <div
            className={`resultIcon resultIcon--${resultState}`}
            aria-hidden="true"
            title={verdict?.title}
          >
            {verdict?.icon}
          </div>
          <div>
            <div className="resultTitle">{verdict?.title}</div>
            <div className="resultSub">Confidence: {topConfidenceText ?? '—'}</div>
          </div>
        </div>

        <div className="resultBody">
          <div className="bars">
            {predictions.map((p) => (
              <ConfidenceBar
                key={p.className}
                label={p.className}
                probability={p.probability}
                color={colorForLabel(p.className)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

