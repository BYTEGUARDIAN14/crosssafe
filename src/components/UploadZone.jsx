import { useCallback, useMemo, useRef, useState } from 'react';

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export default function UploadZone({
  onImageSelect,
  resultState,
  imagePreview,
  fileMeta,
  isDisabled,
  isAnalyzing,
  onReset,
  modelLoaded,
}) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Determine dynamic classes based on state
  const stateClasses = useMemo(() => {
    if (isDragOver) return 'border-neutral bg-neutral/10 shadow-[0_0_20px_rgba(0,191,255,0.2)]';
    if (resultState === 'safe') return 'border-safe/50 bg-safe/5';
    if (resultState === 'risk') return 'border-risk/50 bg-risk/5';
    return 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20';
  }, [isDragOver, resultState]);

  const openPicker = useCallback(() => {
    if (isDisabled) return;
    inputRef.current?.click();
  }, [isDisabled]);

  const handleFiles = useCallback(
    async (files) => {
      const file = files?.[0];
      if (!file) return;
      if (!file.type?.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const previewURL = String(reader.result || '');
        await onImageSelect(file, previewURL);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const onDrop = useCallback(
    async (e) => {
      e.preventDefault();
      setIsDragOver(false);
      if (isDisabled) return;
      await handleFiles(e.dataTransfer.files);
    },
    [handleFiles, isDisabled]
  );

  const onDragOver = useCallback(
    (e) => {
      e.preventDefault();
      if (isDisabled) return;
      setIsDragOver(true);
    },
    [isDisabled]
  );

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPicker();
      }
    },
    [openPicker]
  );

  return (
    <div className="w-full animate-fade-in-up [animation-delay:80ms]">
      <div
        className={`relative group cursor-pointer transition-all duration-300 ease-out rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center min-h-[400px] overflow-hidden backdrop-blur-sm ${stateClasses} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${isAnalyzing ? 'pointer-events-none' : ''}`}
        tabIndex={isDisabled ? -1 : 0}
        role="button"
        aria-label="Upload image"
        aria-disabled={isDisabled ? 'true' : 'false'}
        onClick={openPicker}
        onKeyDown={onKeyDown}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {!imagePreview ? (
          <div className="flex flex-col items-center p-8 text-center">
            <div className="w-20 h-20 mb-6 rounded-3xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
              <span className="opacity-60 group-hover:opacity-100 transition-opacity">↑</span>
            </div>
            <h3 className="text-2xl font-display font-black tracking-wide mb-2">
              Secure Image Upload
            </h3>
            <p className="text-white/40 font-medium mb-8 max-w-xs">
              Drag and drop an image here or <span className="text-neutral underline decoration-neutral/30 underline-offset-4 decoration-2">browse files</span>
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold tracking-widest uppercase text-white/40">
                {modelLoaded ? 'AI Ready' : 'Loading Engine...'}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold tracking-widest uppercase text-white/40">
                JPG / PNG / WEBP
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
            <div className="relative flex-grow flex items-center justify-center bg-black/20 p-4">
              <img 
                className="max-h-[340px] w-auto rounded-xl shadow-2xl z-0 object-contain" 
                src={imagePreview} 
                alt="Uploaded zebra crossing preview" 
              />
              
              {isAnalyzing && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-neutral/10 backdrop-blur-[2px]" />
                  <div className="relative w-full h-full overflow-hidden">
                    <div className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-neutral to-transparent animate-scan-line shadow-[0_0_15px_rgba(0,191,255,0.8)] z-20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                      <div className="px-6 py-2 bg-neutral text-bg-primary font-display font-black text-xs tracking-[0.2em] rounded-full uppercase shadow-2xl italic">
                        Scanning...
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-white/[0.03] backdrop-blur-md flex items-center justify-between border-t border-white/5">
              <div className="overflow-hidden mr-4">
                <div className="text-xs font-bold text-white/80 truncate mb-1">{fileMeta?.name}</div>
                <div className="text-[10px] font-bold text-white/30 tracking-widest uppercase italic">{formatBytes(fileMeta?.size)}</div>
              </div>
              <button
                className="shrink-0 px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black tracking-widest uppercase transition-all duration-200"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onReset?.();
                }}
              >
                Reset Analysis
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30 text-xs shrink-0 italic">!</div>
        <p className="text-[11px] leading-relaxed text-white/30 font-medium">
          Note: This AI model is trained on specific zebra crossing data. 
          Ensure the image is clear and focused on the crossing area for optimal results. 
          Model binaries are served from <code className="text-neutral/60">/public/model/</code>.
        </p>
      </div>
    </div>
  );
}


