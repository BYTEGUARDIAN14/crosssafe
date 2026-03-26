import { useCallback, useMemo, useState } from 'react';
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
  if (l === 'risk') return true;
  if (l.includes('no risk') || l.includes('norisk') || l.includes('safe')) return false;
  return l.includes('risk') || l.includes('unsafe') || l.includes('danger');
}

export default function App() {
  const { model, isLoading: modelLoading, error: modelError } = useModel();

  const [image, setImage] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [resultState, setResultState] = useState('idle');

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
    <div className="relative min-h-screen bg-bg-primary font-body text-text-primary overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none bg-hero-glow opacity-60" aria-hidden="true" />
      <div className="fixed inset-0 pointer-events-none bg-grid-pattern bg-[size:24px_24px] opacity-10 bg-grid-mask" aria-hidden="true" />

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <section className="mb-16 animate-fade-in-up">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-display font-black tracking-tight mb-4 bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
              CrossSafe
            </h1>
            <p className="text-lg lg:text-xl text-white/60 font-medium leading-relaxed">
              Real-time AI detection for zebra crossing safety. 
              Upload an image to identify potential risks and ensure a safe crossing.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 xl:col-span-8">
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

          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <ResultCard
              predictions={predictions}
              isAnalyzing={isAnalyzing}
              topConfidenceText={topConfidenceText}
              resultState={resultState}
            />
          </div>
        </section>

        {modelLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" role="status">
            <div className="bg-zinc-900/80 border border-white/10 p-10 rounded-3xl shadow-2xl max-w-sm w-full text-center flex flex-col items-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                <div className="absolute inset-0 border-4 border-neutral border-t-transparent rounded-full animate-spin-slow" />
                <div className="absolute inset-4 bg-neutral/20 rounded-full animate-pulse" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Initializing AI</h2>
              <p className="text-white/40 text-sm italic">Contacting neural network... /public/model/</p>
            </div>
          </div>
        )}

        {effectiveError && (
          <div className="fixed bottom-8 right-8 z-50 animate-fade-in-up" role="alert">
            <div className="bg-zinc-900 border border-risk/30 p-5 rounded-2xl shadow-2xl flex items-start gap-4 max-w-md backdrop-blur-xl">
              <div className="w-10 h-10 rounded-full bg-risk/10 flex items-center justify-center text-risk shrink-0 font-bold">!</div>
              <div>
                <h3 className="text-risk font-bold mb-1 font-display">System Error</h3>
                <p className="text-white/70 text-sm mb-4">{effectiveError}</p>
                <button 
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                  onClick={handleReset}
                >
                  Clear Error
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}


