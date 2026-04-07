import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, BookOpen, Lightbulb, AlertTriangle, Target, Layers, MessageSquare, Cpu, Brain, Sparkles, ChevronRight } from "lucide-react";
import { analyzeText, loadingMessages, exampleSamples, type AnalysisResult } from "@/lib/analyzer";
import { classicalAnalyzeText } from "@/lib/classicalAnalyzer";
import { mlAnalyzeText, type MLProgress } from "@/lib/mlAnalyzer";

type Engine = "classical" | "ml" | "gemini";

interface Props {
  exampleText?: string;
  onExampleConsumed?: () => void;
  onResultChange?: (result: AnalysisResult | null) => void;
}

const engineConfig = {
  classical: {
    label: "Classical",
    sublabel: "Rule-Based Lexicon",
    icon: Cpu,
    color: "text-cyan",
    gradient: "from-cyan to-blue",
    border: "border-cyan/40",
    bg: "bg-cyan/10",
    description: "VADER-inspired lexicon classifier with hand-crafted affinity scores for emotion masking patterns.",
    badge: "Classical NLP",
    badgeColor: "bg-cyan/10 text-cyan border-cyan/20",
  },
  ml: {
    label: "ML Model",
    sublabel: "DistilBERT (SST-2)",
    icon: Brain,
    color: "text-pink",
    gradient: "from-pink to-violet",
    border: "border-pink/40",
    bg: "bg-pink/10",
    description: "DistilBERT transformer fine-tuned on SST-2, running entirely in-browser via Transformers.js.",
    badge: "Contemporary ML",
    badgeColor: "bg-pink/10 text-pink border-pink/20",
  },
  gemini: {
    label: "Gemini AI",
    sublabel: "LLM API (Comparison)",
    icon: Sparkles,
    color: "text-violet",
    gradient: "from-violet to-primary",
    border: "border-violet/40",
    bg: "bg-violet/10",
    description: "Google Gemini 2.5 Flash — large language model performing zero-shot inference for comparison.",
    badge: "LLM API",
    badgeColor: "bg-violet/10 text-violet border-violet/20",
  },
};

const Analyzer = ({ exampleText, onExampleConsumed, onResultChange }: Props) => {
  const [input, setInput] = useState("");
  const [engine, setEngine] = useState<Engine>("classical");
  const [state, setState] = useState<"idle" | "loading" | "results">("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [mlProgress, setMlProgress] = useState<MLProgress | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cfg = engineConfig[engine];

  useEffect(() => {
    if (exampleText) {
      setInput(exampleText);
      setState("idle");
      setResult(null);
      onExampleConsumed?.();
    }
  }, [exampleText, onExampleConsumed]);

  useEffect(() => {
    if (state === "loading" || state === "results") {
      const timer = setTimeout(() => {
        const element = document.getElementById("analysis-output");
        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: elementPosition - navbarHeight, behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Gemini loading steps animation
  useEffect(() => {
    if (state !== "loading" || engine !== "gemini") return;
    if (loadingStep >= loadingMessages.length) return;
    const timer = setTimeout(() => setLoadingStep(s => s + 1), 500);
    return () => clearTimeout(timer);
  }, [state, loadingStep, engine]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoadingStep(0);
    setResult(null);
    setErrorMsg("");
    setMlProgress(null);
    setState("loading");

    try {
      let res: AnalysisResult;

      if (engine === "classical") {
        res = await classicalAnalyzeText(input);
      } else if (engine === "ml") {
        res = await mlAnalyzeText(input, (p) => setMlProgress(p));
      } else {
        // Gemini
        res = await analyzeText(input);
      }

      setResult(res);
      setState("results");
      onResultChange?.(res);
    } catch (err: any) {
      setState("idle");
      if (err.message === "MISSING_API_KEY") {
        setErrorMsg("API Key required. Please click the Settings icon in the top right to set your free Gemini API key.");
      } else if (engine === "ml") {
        setErrorMsg("ML model failed to load. Please check your internet connection and try again.");
      } else {
        setErrorMsg("Analysis failed. Please check your API key or try again.");
      }
    }
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
    setState("idle");
    setErrorMsg("");
    setMlProgress(null);
    onResultChange?.(null);
  };

  const loadExample = () => {
    const sample = exampleSamples[Math.floor(Math.random() * exampleSamples.length)];
    setInput(sample.text);
    setResult(null);
    setState("idle");
    setErrorMsg("");
    setMlProgress(null);
  };

  return (
    <section id="analyzer" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="section-title">Analyze a <span className="gradient-text">Text Sample</span></h2>
          <p className="section-subtitle mx-auto">
            Select an NLP engine, enter text, and compare how each approach detects hidden emotional masking.
          </p>
        </div>

        {/* Engine Selector Tabs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(Object.keys(engineConfig) as Engine[]).map((eng) => {
            const c = engineConfig[eng];
            const Icon = c.icon;
            const active = engine === eng;
            return (
              <button
                key={eng}
                onClick={() => { setEngine(eng); setState("idle"); setResult(null); setErrorMsg(""); }}
                className={`glass-card p-4 text-left transition-all duration-300 group border-2 ${
                  active ? `${c.border} ${c.bg}` : "border-transparent hover:border-border"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className={`w-4 h-4 ${active ? c.color : "text-muted-foreground group-hover:text-foreground"}`} />
                  <span className={`text-sm font-semibold ${active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {c.label}
                  </span>
                  {active && (
                    <span className={`ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full border ${c.badgeColor}`}>
                      Active
                    </span>
                  )}
                </div>
                <p className={`text-xs ${active ? "text-muted-foreground" : "text-muted-foreground/50"}`}>{c.sublabel}</p>
              </button>
            );
          })}
        </div>

        {/* Active Engine Info Bar */}
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${cfg.border} ${cfg.bg} mb-6 animate-fade-in`}>
          <cfg.icon className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.color}`} />
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-foreground">{cfg.label} — {cfg.sublabel}</p>
            <p className="text-xs text-muted-foreground">{cfg.description}</p>
          </div>
          <span className={`ml-auto shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${cfg.badgeColor}`}>
            {cfg.badge}
          </span>
        </div>

        {/* Input and Action Buttons */}
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
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r ${cfg.gradient} text-primary-foreground font-medium text-sm transition-all duration-300 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <Play className="w-4 h-4" /> Analyze with {cfg.label}
            </button>
            <button onClick={loadExample} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm transition-colors hover:bg-secondary">
              <BookOpen className="w-4 h-4" /> Load Example
            </button>
            <button onClick={handleClear} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-muted-foreground font-medium text-sm transition-colors hover:bg-secondary hover:text-foreground">
              <RotateCcw className="w-4 h-4" /> Clear
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <p className="text-sm text-red-500/90 leading-relaxed">{errorMsg}</p>
            </div>
          )}
        </div>

        <div id="analysis-output" ref={scrollRef} className="scroll-mt-24" />

        {/* ML Progress Bar */}
        {state === "loading" && engine === "ml" && mlProgress && (
          <div className="mt-8 glass-card p-8 space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-pink animate-pulse" />
              <p className="text-sm font-medium text-foreground">Loading DistilBERT Model</p>
            </div>
            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink to-violet transition-all duration-500"
                style={{ width: `${mlProgress.progress ?? 0}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{mlProgress.message}</p>
            {(mlProgress.progress ?? 0) < 25 && (
              <p className="text-xs text-muted-foreground/60 italic">First-time use: downloading ~80MB model. This is cached for future use.</p>
            )}
          </div>
        )}

        {/* Gemini Loading Steps */}
        {state === "loading" && engine === "gemini" && (
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

        {/* Classical / ML Loading Spinner */}
        {state === "loading" && (engine === "classical" || (engine === "ml" && !mlProgress)) && (
          <div className="mt-8 glass-card p-8 flex flex-col items-center gap-4 animate-fade-in">
            <div className={`w-10 h-10 rounded-full border-2 ${engine === "classical" ? "border-cyan/30 border-t-cyan" : "border-pink/30 border-t-pink"} animate-spin`} />
            <p className="text-sm text-muted-foreground">
              {engine === "classical" ? "Running lexicon analysis..." : "Preparing ML inference..."}
            </p>
          </div>
        )}

        {/* Results */}
        {state === "results" && result && (
          <div className="mt-8 space-y-4 animate-fade-up">
            {/* Engine Badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${cfg.border} ${cfg.bg} w-fit`}>
              <cfg.icon className={`w-3.5 h-3.5 ${cfg.color}`} />
              <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.badge} Results</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{cfg.sublabel}</span>
            </div>

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
            {result.cues.length > 0 && (
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
            )}

            {/* Confidence Summary */}
            <div className="glass-card-hover p-5 space-y-4">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Confidence & Risk Summary</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Overall Confidence", value: result.overallConfidence },
                  { label: "Masking Likelihood", value: result.maskingLikelihood },
                  { label: "Ambiguity Score", value: result.ambiguityScore },
                  { label: "Mismatch Score", value: result.mismatchScore },
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

            {/* Method note */}
            <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <span className="text-amber-400 text-xs mt-0.5">ℹ</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="text-amber-400 font-medium">{cfg.badge}:</span>{" "}
                {engine === "classical" && "Results are produced by a deterministic rule-based lexicon. No model inference or API call was made."}
                {engine === "ml" && "Results are produced by DistilBERT running locally in your browser via Transformers.js. No data was sent to any server."}
                {engine === "gemini" && "Results are produced by live Gemini AI inference using your API key. Results are AI-generated and should not be used as clinical facts."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Analyzer;
