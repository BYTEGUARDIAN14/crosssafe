import { useCallback, useMemo, useState } from 'react';
import './App.css';

import Header from './components/Header.jsx';
import UploadZone from './components/UploadZone.jsx';
import ResultCard from './components/ResultCard.jsx';
import Footer from './components/Footer.jsx';
import { useModel } from './hooks/useModel.js';

function sortPredictionsDesc(predictions) {
  return [...predictions].sort((a, b) => (b?.probability ?? 0) - (a?.probability ?? 0));
}

function getTopPrediction(predictions) {
  if (!predictions?.length) return null;
  return predictions.reduce((a, b) => (a.probability > b.probability ? a : b));
}

function normalizeLabel(label) {
  return String(label ?? '').trim().toLowerCase();
}

function hasExactLabels(predictions, labelsLower) {
  if (!predictions?.length) return false;
  const set = new Set(predictions.map((p) => normalizeLabel(p.className)));
  return labelsLower.every((l) => set.has(l));
}

function isRiskLabel(label) {
  const l = normalizeLabel(label);
  if (!l) return false;
  // Common Teachable Machine labels: "Risk" vs "No Risk"
  if (l === 'risk') return true;
  if (l.includes('no risk') || l.includes('norisk') || l.includes('safe')) return false;
  return l.includes('risk') || l.includes('unsafe') || l.includes('danger');
}

export default function App() {
  const { model, isLoading: modelLoading, error: modelError } = useModel();

  const [image, setImage] = useState(null); // data URL
  const [fileMeta, setFileMeta] = useState(null); // { name, size }
  const [predictions, setPredictions] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [resultState, setResultState] = useState('idle'); // idle | safe | risk

  const modelLoaded = !!model && !modelLoading && !modelError;

  const topPrediction = useMemo(() => getTopPrediction(predictions ?? []), [predictions]);
  const topConfidenceText = useMemo(() => {
    if (!topPrediction) return null;
    return `${(topPrediction.probability * 100).toFixed(1)}%`;
  }, [topPrediction]);

  const handleReset = useCallback(() => {
    setImage(null);
    setFileMeta(null);
    setPredictions(null);
    setIsAnalyzing(false);
    setError(null);
    setResultState('idle');
  }, []);

  const runPrediction = useCallback(
    async (file) => {
      if (!model) {
        setError('Model not loaded yet. Please wait a moment and try again.');
        return;
      }

      setError(null);
      setIsAnalyzing(true);
      setPredictions(null);

      const url = URL.createObjectURL(file);
      try {
        const img = new Image();
        img.src = url;
        img.onload = async () => {
          try {
            const raw = await model.predict(img);
            const sorted = sortPredictionsDesc(raw);
            setPredictions(sorted);

            const top = getTopPrediction(sorted);
            // Prefer exact Teachable Machine label pairs when present.
            // If your classes are exactly "Risk" and "No Risk", we use strict matching.
            const useStrictPair = hasExactLabels(sorted, ['risk', 'no risk']);
            const topIsRisk = useStrictPair
              ? normalizeLabel(top?.className) === 'risk'
              : isRiskLabel(top?.className);
            const isRisk = !!top && topIsRisk && top.probability > 0.5;
            setResultState(isRisk ? 'risk' : 'safe');
          } catch (e) {
            setError('Prediction failed. Please try a different image.');
            setResultState('idle');
          } finally {
            setIsAnalyzing(false);
            URL.revokeObjectURL(url);
          }
        };
        img.onerror = () => {
          setError('Could not read the image. Please upload a valid image file.');
          setIsAnalyzing(false);
          setResultState('idle');
          URL.revokeObjectURL(url);
        };
      } catch (e) {
        setError('Unexpected error while preparing the image.');
        setIsAnalyzing(false);
        setResultState('idle');
        URL.revokeObjectURL(url);
      }
    },
    [model]
  );

  const handleImageSelect = useCallback(
    async (file, previewURL) => {
      setImage(previewURL);
      setFileMeta({ name: file.name, size: file.size });
      await runPrediction(file);
    },
    [runPrediction]
  );

  const effectiveError = error ?? modelError;

  return (
    <div className="appRoot">
      <div className="bgGrid" aria-hidden="true" />
      <Header />

      <main className="main">
        <section className="hero">
          <div className="heroText">
            <h1 className="title">CrossSafe</h1>
            <p className="subtitle">AI-Powered Zebra Crossing Safety Detector</p>
          </div>
        </section>

        <section className="content">
          <div className="left">
            <UploadZone
              onImageSelect={handleImageSelect}
              resultState={resultState}
              imagePreview={image}
              fileMeta={fileMeta}
              isDisabled={!modelLoaded}
              isAnalyzing={isAnalyzing}
              onReset={handleReset}
              modelLoaded={modelLoaded}
            />
          </div>

          <div className="right">
            <ResultCard
              predictions={predictions}
              isAnalyzing={isAnalyzing}
              topConfidenceText={topConfidenceText}
              resultState={resultState}
            />
          </div>
        </section>

        {modelLoading && (
          <div className="overlay" role="status" aria-live="polite" aria-label="Loading AI model">
            <div className="overlayCard">
              <div className="spinner">
                <div className="spinnerRing" />
                <div className="spinnerScan" />
              </div>
              <div className="overlayTitle">Loading AI Model...</div>
              <div className="overlayHint">Serving from <code>/public/model/</code></div>
            </div>
          </div>
        )}

        {effectiveError && (
          <div className="toast" role="alert">
            <div className="toastTitle">Error</div>
            <div className="toastBody">{effectiveError}</div>
            <button className="btn" onClick={handleReset} type="button">
              Reset
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

