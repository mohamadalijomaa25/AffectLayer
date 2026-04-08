import type { AnalysisResult } from "./analyzer";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export async function classicalAnalyzeText(text: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
      engine: "classical"
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Analysis failed");
  }

  const data = await response.json();
  return data as AnalysisResult;
}
