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

// Lazy-loaded pipeline — only imported when actually needed
let pipelineInstance: any = null;
let isLoading = false;

export type MLProgress = {
  status: "loading" | "ready" | "error";
  progress?: number;
  message?: string;
};

export async function loadMLModel(
  onProgress?: (p: MLProgress) => void
): Promise<void> {
  if (pipelineInstance) return;
  if (isLoading) return;
  isLoading = true;

  try {
    onProgress?.({ status: "loading", progress: 0, message: "Initializing Transformers.js..." });

    // Dynamic import so it doesn't bloat initial page load
    const { pipeline, env } = await import("@xenova/transformers");

    // Use CDN-hosted WASM (no local server needed)
    env.allowLocalModels = false;
    env.allowRemoteModels = true;

    onProgress?.({ status: "loading", progress: 10, message: "Fetching quantized model (~22MB)..." });

    pipelineInstance = await pipeline(
      "sentiment-analysis",
      "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
      {
        quantized: true,
        progress_callback: (info: any) => {
          if (info.status === "initiate") {
            onProgress?.({ status: "loading", progress: 15, message: `Loading: ${info.file ?? "model files"}...` });
          } else if (info.status === "downloading") {
            const loaded = info.loaded ?? 0;
            const total = info.total ?? 1;
            const filePct = Math.round((loaded / total) * 70);
            onProgress?.({
              status: "loading",
              progress: 15 + filePct,
              message: `Downloading model (${(loaded / 1024 / 1024).toFixed(1)} / ${(total / 1024 / 1024).toFixed(1)} MB)...`,
            });
          } else if (info.status === "done") {
            onProgress?.({ status: "loading", progress: 90, message: "Preparing model for inference..." });
          }
        },
      }
    );

    onProgress?.({ status: "ready", progress: 100, message: "Model ready. Running inference..." });
  } catch (err) {
    isLoading = false;
    pipelineInstance = null;
    onProgress?.({ status: "error", message: "Failed to load ML model. Check your internet connection and try again." });
    throw err;
  }
}

// Utility: clamp a number between min and max
function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

// Detect sarcasm/masking heuristics from the raw text
function detectSurfaceMasking(text: string): {
  label: string;
  confidence: number;
  definition: string;
} {
  const lower = text.toLowerCase();

  const passiveAggression = ["thanks for", "appreciate it", "last minute", "everyone else", "once again", "as usual", "love doing", "love being", "glad you"];
  const humor = ["haha", "lol", "lmao", "i'll survive", "don't worry about me", "could be worse"];
  const minimizers = ["it's fine", "i'm fine", "no worries", "i'm okay", "not a big deal", "it doesn't matter", "never mind"];
  const suppression = ["i'm used to", "used to it", "always like this", "story of my life", "as expected", "figured"];

  for (const p of passiveAggression) {
    if (lower.includes(p)) return { label: "Passive Aggression", confidence: clamp(68 + passiveAggression.filter(x => lower.includes(x)).length * 6), definition: "Polite language used to express frustration indirectly." };
  }
  for (const h of humor) {
    if (lower.includes(h)) return { label: "Humor Masking", confidence: clamp(65 + humor.filter(x => lower.includes(x)).length * 6), definition: "Using levity to deflect from emotional distress." };
  }
  for (const m of minimizers) {
    if (lower.includes(m)) return { label: "Minimization", confidence: clamp(62 + minimizers.filter(x => lower.includes(x)).length * 7), definition: "Downplaying feelings to avoid vulnerability." };
  }
  for (const s of suppression) {
    if (lower.includes(s)) return { label: "Emotional Suppression", confidence: clamp(63 + suppression.filter(x => lower.includes(x)).length * 8), definition: "Forced acceptance and detachment from emotional experience." };
  }
  return { label: "None Detected", confidence: 25, definition: "No masking pattern detected by ML heuristics." };
}

export async function mlAnalyzeText(
  text: string,
  onProgress?: (p: MLProgress) => void
): Promise<AnalysisResult> {
  // Load model if needed
  await loadMLModel(onProgress);

  if (!pipelineInstance) throw new Error("ML model failed to load.");

  // Run primary sentiment inference
  const results = await pipelineInstance(text, { topk: 2 });

  // Results are: [{ label: 'POSITIVE'|'NEGATIVE', score: 0-1 }, ...]
  const positive = results.find((r: any) => r.label === "POSITIVE");
  const negative = results.find((r: any) => r.label === "NEGATIVE");

  const posScore = (positive?.score ?? 0) * 100;
  const negScore = (negative?.score ?? 0) * 100;
  const dominant = posScore >= negScore ? "POSITIVE" : "NEGATIVE";
  const dominantScore = Math.max(posScore, negScore);

  // --- Surface Emotion Mapping ---
  let surfaceLabel: string;
  let surfaceExplanation: string;
  let surfaceConf: number;

  if (dominant === "POSITIVE") {
    surfaceLabel = posScore > 85 ? "Humorous / Cheerful" : "Polite / Positive";
    surfaceConf = clamp(posScore);
    surfaceExplanation = `DistilBERT classified this text as POSITIVE with ${posScore.toFixed(1)}% confidence. The surface tone appears composed and positively framed.`;
  } else {
    surfaceLabel = "Negative / Distressed";
    surfaceConf = clamp(negScore);
    surfaceExplanation = `DistilBERT classified this text as NEGATIVE with ${negScore.toFixed(1)}% confidence, suggesting underlying emotional negativity.`;
  }

  // --- Masking Detection (hybrid: ML score + heuristic rules) ---
  const maskingResult = detectSurfaceMasking(text);

  // High positive score + context of masking keywords = high mismatch
  const hasMaskingCue = maskingResult.label !== "None Detected";
  const mismatch = hasMaskingCue && dominant === "POSITIVE";

  // --- Hidden Emotion Derivation ---
  let hiddenLabel: string;
  let hiddenConf: number;
  let hiddenIcon: string;

  if (mismatch) {
    // Text seems positive on surface, but masking detected → derive hidden emotion
    if (maskingResult.label === "Passive Aggression") {
      hiddenLabel = "Frustration"; hiddenConf = clamp(dominantScore * 0.8 + 10); hiddenIcon = "😤";
    } else if (maskingResult.label === "Humor Masking") {
      hiddenLabel = "Sadness";     hiddenConf = clamp(dominantScore * 0.75 + 10); hiddenIcon = "😢";
    } else if (maskingResult.label === "Minimization") {
      hiddenLabel = "Hurt";        hiddenConf = clamp(dominantScore * 0.7 + 10);  hiddenIcon = "💔";
    } else {
      hiddenLabel = "Anxiety";     hiddenConf = clamp(dominantScore * 0.7);       hiddenIcon = "😰";
    }
  } else if (dominant === "NEGATIVE") {
    hiddenLabel = "Distress / Sadness"; hiddenConf = clamp(negScore * 0.85); hiddenIcon = "😢";
  } else {
    hiddenLabel = "Neutral";            hiddenConf = 40;                           hiddenIcon = "😶";
  }

  // --- Scores ---
  const mismatchScore = mismatch ? clamp(55 + maskingResult.confidence * 0.3) : clamp(Math.abs(posScore - negScore) * 0.4);
  const maskingLikelihood = hasMaskingCue ? maskingResult.confidence : 20;
  const ambiguityScore = clamp(Math.abs(posScore - negScore) > 30 ? 35 : 65);
  const overallConfidence = clamp(Math.round((surfaceConf + maskingResult.confidence + hiddenConf) / 3));

  // --- Linguistic Cues (token-level extraction) ---
  const cueWords = text.toLowerCase().split(/\W+/).filter(w =>
    ["ignored", "survive", "fine", "okay", "again", "always", "sure", "thanks", "used to", "love", "great", "appreciate"].includes(w)
  ).slice(0, 5);

  const explanation = `DistilBERT (SST-2) classified the surface as ${dominant} (${dominantScore.toFixed(0)}% conf). ${
    mismatch
      ? `However, "${maskingResult.label}" masking cues were detected, indicating the text may be suppressing a hidden emotion of "${hiddenLabel}". This surface-latent mismatch is a key signal of emotional masking.`
      : `No significant surface-hidden mismatch detected. The expressed emotion aligns with the latent affect.`
  }`;

  return {
    surfaceEmotion: { label: surfaceLabel, confidence: Math.round(surfaceConf), explanation: surfaceExplanation },
    hiddenEmotion:  { label: hiddenLabel,  confidence: Math.round(hiddenConf),  icon: hiddenIcon },
    maskingStyle:   { label: maskingResult.label, confidence: Math.round(maskingResult.confidence), definition: maskingResult.definition },
    explanation,
    cues: cueWords,
    overallConfidence: Math.round(overallConfidence),
    maskingLikelihood: Math.round(maskingLikelihood),
    ambiguityScore:    Math.round(ambiguityScore),
    mismatchScore:     Math.round(mismatchScore),
  };
}
