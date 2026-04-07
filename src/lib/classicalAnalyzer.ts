/**
 * Engine 1: Classical NLP Analyzer
 * Approach: Rule-based lexicon with affinity scoring (VADER-inspired)
 * No external libraries, no API calls, runs instantly in-browser.
 *
 * Pipeline:
 * 1. Tokenize and normalize input text
 * 2. Score surface emotion via positive/negative lexicon
 * 3. Detect masking cues (sarcasm markers, minimizers, humor deflection)
 * 4. Estimate hidden emotion from mismatch between surface and masking patterns
 * 5. Return structured AnalysisResult
 */

import type { AnalysisResult } from "./analyzer";

// --- Lexicon Definitions ---

const POSITIVE_WORDS = new Set([
  "happy", "great", "fine", "okay", "good", "love", "sure", "thanks", "appreciate",
  "wonderful", "amazing", "nice", "lovely", "fantastic", "brilliant", "glad",
  "haha", "lol", "funny", "laugh", "smile", "joy", "content", "well", "cool",
  "perfect", "excellent", "superb", "awesome", "grateful", "pleased"
]);

const NEGATIVE_WORDS = new Set([
  "sad", "hurt", "pain", "tired", "exhausted", "wrong", "bad", "lost", "empty",
  "broken", "alone", "ignored", "left", "used", "forgotten", "fail", "weak",
  "miserable", "hopeless", "trapped", "scared", "afraid", "anxious", "worried",
  "overwhelmed", "distress", "suffer", "struggle", "disappoint", "regret", "angry",
  "frustrated", "furious", "annoyed", "irritated", "bored", "useless"
]);

const SARCASM_MARKERS = [
  "sure", "totally", "clearly", "obviously", "wow", "great", "thanks so much",
  "love that", "love how", "love when", "glad to know", "so helpful", "very helpful",
  "appreciate that", "wonderful", "fantastic", "brilliant", "oh great", "of course",
  "naturally", "as always", "real nice", "way to go", "good job"
];

const MINIMIZERS = [
  "it's fine", "i'm fine", "its fine", "no worries", "don't worry",
  "i'm okay", "im okay", "i'll be okay", "not a big deal", "it doesn't matter",
  "never mind", "forget it", "doesn't matter", "i don't mind", "all good",
  "no problem", "whatever", "i guess", "i suppose"
];

const HUMOR_DEFLECTORS = [
  "haha", "lol", "lmao", "hehe", "jk", "just kidding", "kidding", ":)", "😂", "😅",
  "don't worry about me", "i'll survive", "i'll manage", "could be worse"
];

const PASSIVE_AGGRESSION_PATTERNS = [
  "must be nice", "thanks for", "appreciate it", "sure thing", "of course",
  "no problem at all", "happy to help", "glad you", "love doing", "love being",
  "everyone else", "once again", "as usual", "like always", "last minute",
  "at the last", "last possible"
];

const EMOTIONAL_SUPPRESSION_PATTERNS = [
  "i'll survive", "i'm used to", "used to it", "always like this",
  "nothing new", "what else is new", "story of my life", "as expected",
  "i knew it", "no surprise", "figured", "doesn't matter anyway"
];

const SADNESS_CONTEXT_WORDS = [
  "ignored", "invisible", "forgotten", "alone", "nobody", "left out", "excluded",
  "not chosen", "first choice", "anyone's", "anyone else", "everyone else"
];

const ANGER_CONTEXT_WORDS = [
  "again", "always", "every time", "once again", "as usual", "still",
  "never", "constantly", "keep", "have to", "forced", "made to"
];

// --- Tokenizer ---
function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s']/gi, " ").split(/\s+/).filter(Boolean);
}

function containsAny(text: string, patterns: string[]): string[] {
  const lower = text.toLowerCase();
  return patterns.filter(p => lower.includes(p.toLowerCase()));
}

// --- Scoring Functions ---
function scoreTokens(tokens: string[]): { pos: number; neg: number } {
  let pos = 0, neg = 0;
  for (const token of tokens) {
    if (POSITIVE_WORDS.has(token)) pos++;
    if (NEGATIVE_WORDS.has(token)) neg++;
  }
  return { pos, neg };
}

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

// --- Main Classical Analyzer ---
export async function classicalAnalyzeText(text: string): Promise<AnalysisResult> {
  const tokens = tokenize(text);
  const lower = text.toLowerCase();

  const { pos, neg } = scoreTokens(tokens);
  const total = pos + neg || 1;
  const posRatio = pos / total;
  const negRatio = neg / total;

  // Detect masking patterns
  const sarcasmHits    = containsAny(lower, SARCASM_MARKERS);
  const minimizerHits  = containsAny(lower, MINIMIZERS);
  const humorHits      = containsAny(lower, HUMOR_DEFLECTORS);
  const passiveHits    = containsAny(lower, PASSIVE_AGGRESSION_PATTERNS);
  const suppressHits   = containsAny(lower, EMOTIONAL_SUPPRESSION_PATTERNS);
  const sadnessCtx     = containsAny(lower, SADNESS_CONTEXT_WORDS);
  const angerCtx       = containsAny(lower, ANGER_CONTEXT_WORDS);

  const hasMasking = sarcasmHits.length > 0 || minimizerHits.length > 0 ||
                     humorHits.length > 0 || passiveHits.length > 0 || suppressHits.length > 0;

  // --- Surface Emotion ---
  let surfaceLabel = "Neutral";
  let surfaceConf = 55;
  let surfaceExplanation = "No dominant surface emotion cues were detected.";

  if (posRatio > 0.6 || humorHits.length > 0 || sarcasmHits.length > 0) {
    surfaceLabel = humorHits.length > 0 ? "Humorous" : sarcasmHits.length > 0 ? "Polite" : "Positive";
    surfaceConf = clamp(55 + pos * 8 + humorHits.length * 6);
    surfaceExplanation = `Surface tone appears ${surfaceLabel.toLowerCase()} based on ${pos} positive lexicon hit(s)${humorHits.length ? " and humor deflectors" : ""}.`;
  } else if (negRatio > 0.4) {
    surfaceLabel = "Negative";
    surfaceConf = clamp(55 + neg * 8);
    surfaceExplanation = `${neg} negative lexicon term(s) detected driving down the surface tone.`;
  } else if (minimizerHits.length > 0) {
    surfaceLabel = "Calm / Accepting";
    surfaceConf = clamp(58 + minimizerHits.length * 5);
    surfaceExplanation = `Minimizing phrases detected (e.g., "${minimizerHits[0]}") suggesting forced calm on the surface.`;
  }

  // --- Masking Style ---
  let maskingLabel = "None Detected";
  let maskingConf = 30;
  let maskingDefinition = "No clear emotional masking patterns found in this text.";

  if (passiveHits.length > 0) {
    maskingLabel = "Passive Aggression";
    maskingConf = clamp(60 + passiveHits.length * 10);
    maskingDefinition = "Polite language used to express frustration indirectly. Common in workplace contexts.";
  } else if (humorHits.length > 0) {
    maskingLabel = "Humor Masking";
    maskingConf = clamp(62 + humorHits.length * 8);
    maskingDefinition = "Using levity and humor to deflect from genuine emotional distress.";
  } else if (minimizerHits.length > 0) {
    maskingLabel = "Minimization";
    maskingConf = clamp(60 + minimizerHits.length * 8);
    maskingDefinition = "Downplaying one's own feelings or situation to avoid vulnerability.";
  } else if (suppressHits.length > 0) {
    maskingLabel = "Emotional Suppression";
    maskingConf = clamp(60 + suppressHits.length * 8);
    maskingDefinition = "Containing emotional responses through forced acceptance and detachment.";
  } else if (sarcasmHits.length > 0) {
    maskingLabel = "Sarcasm Masking";
    maskingConf = clamp(58 + sarcasmHits.length * 9);
    maskingDefinition = "Using irony or sarcasm to mask true feelings while maintaining plausible deniability.";
  }

  // --- Hidden Emotion ---
  let hiddenLabel = "Neutral";
  let hiddenConf = 40;
  let hiddenIcon = "😶";

  const sadnessScore = sadnessCtx.length + suppressHits.length + minimizerHits.length;
  const angerScore   = angerCtx.length + passiveHits.length;
  const anxietyScore = neg;
  const hurt = sadnessCtx.length + minimizerHits.length;

  if (sadnessScore >= angerScore && sadnessScore >= anxietyScore && sadnessScore > 0) {
    hiddenLabel = "Sadness";
    hiddenConf  = clamp(55 + sadnessScore * 7);
    hiddenIcon  = "😢";
  } else if (angerScore > sadnessScore && angerScore > anxietyScore) {
    hiddenLabel = "Frustration";
    hiddenConf  = clamp(55 + angerScore * 7);
    hiddenIcon  = "😤";
  } else if (hurt > 0) {
    hiddenLabel = "Hurt";
    hiddenConf  = clamp(53 + hurt * 8);
    hiddenIcon  = "💔";
  } else if (anxietyScore > 0) {
    hiddenLabel = "Anxiety";
    hiddenConf  = clamp(50 + anxietyScore * 6);
    hiddenIcon  = "😰";
  } else if (humorHits.length > 0) {
    hiddenLabel = "Sadness";
    hiddenConf  = 62;
    hiddenIcon  = "😢";
  }

  // --- Mismatch & Scores ---
  const mismatchScore = hasMasking
    ? clamp(50 + (sarcasmHits.length + passiveHits.length + humorHits.length + minimizerHits.length + suppressHits.length) * 8)
    : clamp(20 + Math.abs(pos - neg) * 5);

  const maskingLikelihood = hasMasking
    ? clamp(55 + (passiveHits.length + humorHits.length + minimizerHits.length + suppressHits.length) * 9)
    : 20;

  const ambiguityScore = clamp(30 + Math.abs(pos - neg) * 4 + (hasMasking ? 20 : 0));
  const overallConfidence = clamp(Math.round((surfaceConf + maskingConf + hiddenConf) / 3));

  // --- Linguistic Cues ---
  const cues: string[] = [
    ...sarcasmHits.slice(0, 2),
    ...minimizerHits.slice(0, 2),
    ...humorHits.slice(0, 2),
    ...passiveHits.slice(0, 2),
    ...suppressHits.slice(0, 2),
    ...sadnessCtx.slice(0, 2),
    ...angerCtx.slice(0, 1),
  ].slice(0, 6);

  // --- Explanation ---
  const parts: string[] = [];
  if (surfaceLabel !== "Neutral") parts.push(`Surface tone detected as "${surfaceLabel}" via lexicon scoring.`);
  if (maskingLabel !== "None Detected") parts.push(`"${maskingLabel}" pattern identified using rule-based masking detection.`);
  if (hiddenLabel !== "Neutral") parts.push(`Hidden emotion estimated as "${hiddenLabel}" based on contextual cue analysis.`);
  if (mismatchScore > 55) parts.push(`High surface-vs-latent mismatch score (${mismatchScore}%) suggests emotional incongruence.`);
  if (parts.length === 0) parts.push("No strong masking or emotional incongruence detected by the classical lexicon engine.");

  const explanation = parts.join(" ");

  return {
    surfaceEmotion: { label: surfaceLabel, confidence: surfaceConf, explanation: surfaceExplanation },
    hiddenEmotion:  { label: hiddenLabel,  confidence: hiddenConf,  icon: hiddenIcon },
    maskingStyle:   { label: maskingLabel, confidence: maskingConf, definition: maskingDefinition },
    explanation,
    cues,
    overallConfidence,
    maskingLikelihood,
    ambiguityScore,
    mismatchScore,
  };
}
