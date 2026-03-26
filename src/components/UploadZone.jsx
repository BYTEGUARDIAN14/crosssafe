import { useCallback, useMemo, useRef, useState } from 'react';
import './UploadZone.css';

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

  const zoneState = useMemo(() => {
    if (isDragOver) return 'drag';
    if (resultState === 'safe') return 'safe';
    if (resultState === 'risk') return 'risk';
    return 'idle';
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
    <div className="uploadWrap" style={{ animationDelay: '80ms' }}>
      <div
        className={`uploadZone uploadZone--${zoneState} ${isAnalyzing ? 'uploadZone--analyzing' : ''}`}
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
          className="hiddenInput"
          type="file"
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {!imagePreview ? (
          <div className="uploadEmpty">
            <div className="uploadIcon" aria-hidden="true">
              ⬆
            </div>
            <div className="uploadTitle">Drop an image here</div>
            <div className="uploadHint">
              or <span className="linkLike">click to upload</span>
            </div>

            <div className="uploadMeta">
              {!modelLoaded ? (
                <span className="pill pill--neutral">Loading model…</span>
              ) : (
                <span className="pill pill--neutral">Ready</span>
              )}
              <span className="pill pill--neutral">JPG/PNG/WebP</span>
            </div>
          </div>
        ) : (
          <div className="uploadPreview">
            <div className="previewFrame">
              <img className="previewImg" src={imagePreview} alt="Uploaded zebra crossing preview" />
              {isAnalyzing && (
                <div className="scanOverlay" aria-label="Analyzing image">
                  <div className="scanLine" />
                  <div className="scanText">Analyzing…</div>
                </div>
              )}
            </div>

            <div className="fileRow">
              <div className="fileMeta">
                <div className="fileName">{fileMeta?.name}</div>
                <div className="fileSize">{formatBytes(fileMeta?.size)}</div>
              </div>
              <div className="actions">
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReset?.();
                  }}
                  aria-label="Re-upload image"
                >
                  Re-upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="helperText">
        Model files must exist at <code>/public/model/</code> as <code>model.json</code>,{' '}
        <code>weights.bin</code>, <code>metadata.json</code>.
      </div>
    </div>
  );
}

