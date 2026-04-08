/**
 * Engine 2: Machine Learning Analyzer (Contemporary Approach)
 * Technology: DistilBERT via Transformers.js (@xenova/transformers)
 * Model: Xenova/distilbert-base-uncased-finetuned-sst-2-english
 *
 * Runs entirely in the browser — no server, no Python backend.
 * Model weights (~80MB) are downloaded from Hugging Face on first use,
 * then cached indefinitely in the browser's IndexedDB.
 *
 * Pipeline:
 * 1. Load DistilBERT sentiment classification pipeline
 * 2. Run primary sentiment inference (POSITIVE/NEGATIVE + score)
 * 3. Derive hidden emotion from sentiment polarity and score intensity
 * 4. Detect masking via surface-vs-hidden mismatch heuristics
 * 5. Return structured AnalysisResult
 */

import type { AnalysisResult } from "./analyzer";

export type MLProgress = {
  status: "loading" | "ready" | "error";
  progress?: number;
  message?: string;
};

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export async function mlAnalyzeText(
  text: string,
  onProgress?: (p: MLProgress) => void
): Promise<AnalysisResult> {
  // Let UI know we are fetching
  onProgress?.({ status: "loading", progress: 50, message: "Sending to Python backend..." });

  const response = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
      engine: "ml"
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    onProgress?.({ status: "error", message: "Failed to load ML model from backend." });
    throw new Error(err.detail || "Analysis failed");
  }

  const data = await response.json();
  onProgress?.({ status: "ready", progress: 100, message: "Analysis complete." });
  
  return data as AnalysisResult;
}
