import { useEffect, useState } from "react";
import { Cloud } from "lucide-react";
import type { AnalysisResult } from "@/lib/analyzer";

interface WordItem {
  word: string;
  weight: number; // 1-5
  color: string;
}

interface Props {
  result: AnalysisResult;
}

// Extract and weight words from the analysis result
function buildWordList(result: AnalysisResult): WordItem[] {
  const words: WordItem[] = [];

  // Cues are highest weight (directly flagged by model)
  result.cues.forEach((cue) => {
    words.push({ word: cue, weight: 5, color: "text-cyan" });
  });

  // Hidden emotion label — high weight
  words.push({ word: result.hiddenEmotion.label, weight: 5, color: "text-pink" });

  // Surface emotion label — medium weight
  words.push({ word: result.surfaceEmotion.label, weight: 3, color: "text-cyan/70" });

  // Masking style — medium weight
  const maskWord = result.maskingStyle.label.split(" ")[0];
  words.push({ word: maskWord, weight: 4, color: "text-violet" });

  // Extract meaningful words from the explanation (nouns/adjectives)
  const stopwords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "this", "that", "these", "those",
    "i", "you", "he", "she", "it", "we", "they", "what", "which", "who",
    "to", "of", "in", "for", "on", "with", "at", "by", "from", "up", "about",
    "into", "through", "during", "before", "after", "above", "below", "between",
    "and", "but", "or", "nor", "not", "so", "yet", "both", "either", "neither",
    "text", "emotion", "hidden", "surface", "masking", "style", "shows", "suggest",
    "indicates", "while", "although", "however", "sentence", "word", "language",
  ]);

  const explanationWords = result.explanation
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 4 && !stopwords.has(w));

  // Count frequency
  const freq: Record<string, number> = {};
  explanationWords.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });

  const sortedWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const explanationColors = ["text-violet/80", "text-blue/80", "text-pink/60", "text-cyan/60"];
  sortedWords.forEach(([word], idx) => {
    // Avoid duplicates
    if (!words.find((w) => w.word.toLowerCase() === word)) {
      words.push({
        word,
        weight: Math.max(1, 3 - idx),
        color: explanationColors[idx % explanationColors.length],
      });
    }
  });

  // Shuffle for natural cloud feel
  return words.sort(() => Math.random() - 0.5);
}

const sizeMap: Record<number, string> = {
  5: "text-3xl font-bold",
  4: "text-2xl font-semibold",
  3: "text-xl font-medium",
  2: "text-base font-medium",
  1: "text-sm font-normal",
};

const EmotionWordCloud = ({ result }: Props) => {
  const [visible, setVisible] = useState(false);
  const words = buildWordList(result);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [result]);

  return (
    <div className="glass-card-hover p-5 space-y-4">
      <div className="flex items-center gap-2 text-violet">
        <Cloud className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">Emotion Word Cloud</span>
        <span className="ml-auto text-xs text-muted-foreground italic">Words sized by emotional weight</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 py-4 px-2 min-h-[120px]">
        {words.map((item, i) => (
          <span
            key={i}
            className={`${sizeMap[item.weight]} ${item.color} transition-all duration-500 cursor-default select-none hover:scale-110 hover:brightness-125`}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
              transitionDelay: `${i * 40}ms`,
            }}
            title={`Weight: ${item.weight}/5`}
          >
            {item.word}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 pt-1 border-t border-border/50">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-cyan inline-block" /> Linguistic cues
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-pink inline-block" /> Hidden emotion
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-violet inline-block" /> Masking pattern
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-blue inline-block" /> Context words
        </span>
      </div>
    </div>
  );
};

export default EmotionWordCloud;
