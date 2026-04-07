export interface AnalysisResult {
  surfaceEmotion: { label: string; confidence: number; explanation: string };
  hiddenEmotion: { label: string; confidence: number; icon: string };
  maskingStyle: { label: string; confidence: number; definition: string };
  explanation: string;
  cues: string[];
  overallConfidence: number;
  maskingLikelihood: number;
  ambiguityScore: number;
  mismatchScore: number;
}

import { GoogleGenerativeAI } from "@google/generative-ai";

const defaultResult: AnalysisResult = {
  surfaceEmotion: { label: "Neutral", confidence: 72, explanation: "No strong positive or negative surface indicators detected." },
  hiddenEmotion: { label: "Anxiety", confidence: 65, icon: "😰" },
  maskingStyle: { label: "Emotional Suppression", confidence: 68, definition: "Containing emotional responses through forced acceptance and detachment." },
  explanation: "The text presents a controlled, measured tone that may conceal underlying emotional tension. Subtle linguistic patterns suggest suppressed affect beneath an outwardly composed surface.",
  cues: [],
  overallConfidence: 67,
  maskingLikelihood: 70,
  ambiguityScore: 52,
  mismatchScore: 58,
};

export async function analyzeText(text: string): Promise<AnalysisResult> {
  const apiKey = localStorage.getItem("gemini_api_key");
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // or gemini-2.0-flash

    const prompt = `You are an expert NLP sentiment analyzer specializing in hidden emotion detection and psychological masking.
Analyze the following text and return ONLY a raw JSON object (no markdown formatting, no backticks) matching this exact structure containing valid numbers:

{
  "surfaceEmotion": { "label": "String (e.g. Polite)", "confidence": Number 0-100, "explanation": "String explaining why" },
  "hiddenEmotion": { "label": "String (e.g. Frustration)", "confidence": Number 0-100, "icon": "Emoji string" },
  "maskingStyle": { "label": "String (e.g. Passive Aggression)", "confidence": Number 0-100, "definition": "String explaining this mechanism" },
  "explanation": "String giving detailed rationale of the emotional mismatch",
  "cues": ["String exactly from text"],
  "overallConfidence": Number 0-100,
  "maskingLikelihood": Number 0-100,
  "ambiguityScore": Number 0-100,
  "mismatchScore": Number 0-100
}

Text to analyze: "${text}"`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Clean up any potential markdown formatting wrapping the JSON
    const cleanJson = responseText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
    
    const parsedData = JSON.parse(cleanJson) as AnalysisResult;
    
    return {
      ...defaultResult, // Fallbacks just in case
      ...parsedData,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export const exampleSamples = [
  {
    text: "Haha don't worry about me, I'll survive.",
    hiddenEmotion: "Sadness",
    maskingStyle: "Humor Masking",
  },
  {
    text: "It's okay, I know I'm not anyone's first choice.",
    hiddenEmotion: "Hurt",
    maskingStyle: "Minimization",
  },
  {
    text: "Thanks for the last-minute update, really appreciate it.",
    hiddenEmotion: "Frustration",
    maskingStyle: "Passive Aggression",
  },
  {
    text: "I'm good, just exhausted in every possible way.",
    hiddenEmotion: "Distress",
    maskingStyle: "Emotional Suppression",
  },
  {
    text: "Sure, I'd love to do everyone else's work again.",
    hiddenEmotion: "Anger",
    maskingStyle: "Sarcasm Masking",
  },
  {
    text: "No worries, I'm used to being forgotten.",
    hiddenEmotion: "Loneliness",
    maskingStyle: "Minimization",
  },
  {
    text: "Wow, great — another meeting that could've been an email.",
    hiddenEmotion: "Frustration",
    maskingStyle: "Sarcasm Masking",
  },
  {
    text: "It's fine, I didn't really want to go anyway.",
    hiddenEmotion: "Hurt",
    maskingStyle: "Minimization",
  },
  {
    text: "I'm totally fine with being the last to know, as always.",
    hiddenEmotion: "Resentment",
    maskingStyle: "Passive Aggression",
  },
  {
    text: "Haha yeah, story of my life — nobody listens.",
    hiddenEmotion: "Sadness",
    maskingStyle: "Humor Masking",
  },
  {
    text: "Don't mind me, I'll just figure it out alone like I always do.",
    hiddenEmotion: "Overwhelm",
    maskingStyle: "Emotional Suppression",
  },
  {
    text: "Oh, no it's completely fine that you cancelled last minute.",
    hiddenEmotion: "Anger",
    maskingStyle: "Passive Aggression",
  },
  {
    text: "Lol yeah I'm great, just haven't slept in three days.",
    hiddenEmotion: "Anxiety",
    maskingStyle: "Humor Masking",
  },
  {
    text: "I guess I just need to accept that things are this way.",
    hiddenEmotion: "Hopelessness",
    maskingStyle: "Emotional Suppression",
  },
  {
    text: "It's not a big deal, I can handle everything on my own.",
    hiddenEmotion: "Distress",
    maskingStyle: "Minimization",
  },
];

export const loadingMessages = [
  "Analyzing tone layers...",
  "Detecting emotional masking...",
  "Estimating latent affect...",
  "Extracting linguistic cues...",
  "Computing mismatch score...",
  "Generating explanation...",
];
