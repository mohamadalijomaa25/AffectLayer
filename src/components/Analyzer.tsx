import { useState, useEffect } from "react";
import { Play, RotateCcw, BookOpen, Lightbulb, AlertTriangle, Target, Layers, MessageSquare } from "lucide-react";
import { analyzeText, loadingMessages, exampleSamples, type AnalysisResult } from "@/lib/analyzer";

interface Props {
  exampleText?: string;
  onExampleConsumed?: () => void;
  onResultChange?: (result: AnalysisResult | null) => void;
}

const Analyzer = ({ exampleText, onExampleConsumed, onResultChange }: Props) => {
  const [input, setInput] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "results">("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (exampleText) {
      setInput(exampleText);
      setState("idle");
      setResult(null);
      onExampleConsumed?.();
    }
  }, [exampleText, onExampleConsumed]);

  useEffect(() => {
    if (state !== "loading") return;
    if (loadingStep >= loadingMessages.length) {
      (async () => {
        try {
          const res = await analyzeText(input);
          setResult(res);
          setState("results");
          onResultChange?.(res);
        } catch (err: any) {
          setState("idle");
          if (err.message === "MISSING_API_KEY") {
            setErrorMsg("API Key required. Please click the Settings icon in the top right to set your free Gemini API key.");
          } else {
            setErrorMsg("Analysis failed. Please check your API key or try again.");
          }
        }
      })();
      return;
    }
    const timer = setTimeout(() => setLoadingStep(s => s + 1), 500);
    return () => clearTimeout(timer);
  }, [state, loadingStep, input, onResultChange]);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setLoadingStep(0);
    setResult(null);
    setErrorMsg("");
    setState("loading");
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
    setState("idle");
    setErrorMsg("");
    onResultChange?.(null);
  };

  const loadExample = () => {
    const sample = exampleSamples[Math.floor(Math.random() * exampleSamples.length)];
    setInput(sample.text);
    setResult(null);
    setState("idle");
    setErrorMsg("");
  };

  return (
    <section id="analyzer" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="section-title">Analyze a <span className="gradient-text">Text Sample</span></h2>
          <p className="section-subtitle mx-auto">Enter a message that may contain emotionally masked language. The system will detect surface tone, hidden affect, and masking patterns.</p>
        </div>

        <div className="glass-card p-6 md:p-8 space-y-6">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Try: "Haha it's okay, I'm used to being left out." or "Thanks so much for sending this at the last possible minute."`}
            className="w-full h-32 bg-secondary/50 border border-border rounded-lg p-4 text-foreground text-sm placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-violet/40 transition-all"
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!input.trim() || state === "loading"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet to-primary text-primary-foreground font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-violet/25 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" /> Analyze Text
            </button>
            <button onClick={loadExample} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm transition-colors hover:bg-secondary">
              <BookOpen className="w-4 h-4" /> Load Example
            </button>
            <button onClick={handleClear} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-muted-foreground font-medium text-sm transition-colors hover:bg-secondary hover:text-foreground">
              <RotateCcw className="w-4 h-4" /> Clear
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 mt-4 animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <p className="text-sm text-red-500/90 leading-relaxed">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* Loading */}
        {state === "loading" && (
          <div className="mt-8 glass-card p-8 flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-10 h-10 rounded-full border-2 border-violet/30 border-t-violet animate-spin" />
            <div className="space-y-2 text-center">
              {loadingMessages.slice(0, loadingStep + 1).map((msg, i) => (
                <p key={i} className={`text-sm transition-opacity duration-300 ${i === loadingStep ? "text-foreground" : "text-muted-foreground/50"}`}>
                  {i < loadingStep ? "✓" : "›"} {msg}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {state === "results" && result && (
          <div className="mt-8 space-y-4 animate-fade-up">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Surface Emotion */}
              <div className="glass-card-hover p-5 space-y-3">
                <div className="flex items-center gap-2 text-cyan">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Surface Emotion</span>
                </div>
                <div className="text-2xl font-heading font-bold text-foreground">{result.surfaceEmotion.label}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan to-cyan/60 transition-all duration-700" style={{ width: `${result.surfaceEmotion.confidence}%` }} />
                  </div>
                  <span className="text-xs text-cyan font-medium">{result.surfaceEmotion.confidence}%</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{result.surfaceEmotion.explanation}</p>
              </div>

              {/* Hidden Emotion */}
              <div className="glass-card-hover p-5 space-y-3">
                <div className="flex items-center gap-2 text-pink">
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Hidden Emotion</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{result.hiddenEmotion.icon}</span>
                  <span className="text-2xl font-heading font-bold text-foreground">{result.hiddenEmotion.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-pink to-pink/60 transition-all duration-700" style={{ width: `${result.hiddenEmotion.confidence}%` }} />
                  </div>
                  <span className="text-xs text-pink font-medium">{result.hiddenEmotion.confidence}%</span>
                </div>
              </div>

              {/* Masking Style */}
              <div className="glass-card-hover p-5 space-y-3">
                <div className="flex items-center gap-2 text-violet">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Masking Style</span>
                </div>
                <div className="text-2xl font-heading font-bold text-foreground">{result.maskingStyle.label}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet to-violet/60 transition-all duration-700" style={{ width: `${result.maskingStyle.confidence}%` }} />
                  </div>
                  <span className="text-xs text-violet font-medium">{result.maskingStyle.confidence}%</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{result.maskingStyle.definition}</p>
              </div>
            </div>

            {/* Explanation */}
            <div className="glass-card-hover p-5 space-y-3">
              <div className="flex items-center gap-2 text-blue">
                <Lightbulb className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Explainable Rationale</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{result.explanation}</p>
            </div>

            {/* Cues */}
            <div className="glass-card-hover p-5 space-y-3">
              <div className="flex items-center gap-2 text-cyan">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Linguistic Cues</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.cues.map((cue, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-medium">
                    "{cue}"
                  </span>
                ))}
              </div>
            </div>

            {/* Confidence Summary */}
            <div className="glass-card-hover p-5 space-y-4">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Confidence & Risk Summary</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Overall Confidence", value: result.overallConfidence, color: "from-violet to-blue" },
                  { label: "Masking Likelihood", value: result.maskingLikelihood, color: "from-pink to-violet" },
                  { label: "Ambiguity Score", value: result.ambiguityScore, color: "from-cyan to-blue" },
                  { label: "Mismatch Score", value: result.mismatchScore, color: "from-pink to-cyan" },
                ].map((item, i) => (
                  <div key={i} className="text-center space-y-2">
                    <div className="relative w-16 h-16 mx-auto">
                      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--secondary))" strokeWidth="4" />
                        <circle cx="32" cy="32" r="28" fill="none" stroke={`url(#grad-${i})`} strokeWidth="4" strokeLinecap="round"
                          strokeDasharray={`${(item.value / 100) * 175.9} 175.9`}
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id={`grad-${i}`}>
                            <stop offset="0%" stopColor="hsl(var(--violet))" />
                            <stop offset="100%" stopColor="hsl(var(--cyan))" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">{item.value}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo Disclaimer */}
            <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <span className="text-amber-400 text-xs mt-0.5">ℹ</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="text-amber-400 font-medium">Live AI Inference:</span> This system is performing live semantic evaluation using your API Key configured in your browser. Results are mathematically generated but should not be used as clinical diagnostic facts.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Analyzer;
