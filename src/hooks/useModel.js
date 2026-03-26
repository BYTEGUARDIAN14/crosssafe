import * as tmImage from '@teachablemachine/image';
import { useEffect, useState } from 'react';

async function loadFromBase(basePath) {
  const base = String(basePath || '').replace(/\/+$/, '');
  const modelURL = `${base}/model.json`;
  const metadataURL = `${base}/metadata.json`;
  const model = await tmImage.load(modelURL, metadataURL);
  return { model, modelURL, metadataURL };
}

// Loads Teachable Machine model from local /public/model/ folder
// Returns: { model, isLoading, error }
// Uses: tmImage.load(modelURL, metadataURL)
// modelURL = "/model/model.json"
// metadataURL = "/model/metadata.json"
export function useModel() {
  const [state, setState] = useState({
    model: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const publicUrl = process.env.PUBLIC_URL || '';

        // Primary: CRA static folder convention (/public/model)
        // Fallback: your HTML snippet convention (./my_model/)
        const candidates = [`${publicUrl}/model`, `${publicUrl}/my_model`];

        let loaded = null;
        let lastErr = null;
        for (const base of candidates) {
          try {
            loaded = await loadFromBase(base);
            break;
          } catch (e) {
            lastErr = e;
          }
        }

        if (!loaded) {
          throw lastErr ?? new Error('Model load failed.');
        }

        if (cancelled) return;
        setState({ model: loaded.model, isLoading: false, error: null });
      } catch (e) {
        if (cancelled) return;
        setState({
          model: null,
          isLoading: false,
          error:
            'Failed to load the model. Place model.json, weights.bin, metadata.json in either /public/model/ (preferred) or /public/my_model/.',
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

