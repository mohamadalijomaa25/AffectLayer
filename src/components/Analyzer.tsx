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
    sublabel: "Rule-Based Lexicon (Python Backend)",
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
    sublabel: "DistilBERT (Python Backend)",
    icon: Brain,
    color: "text-pink",
    gradient: "from-pink to-violet",
    border: "border-pink/40",
    bg: "bg-pink/10",
    description: "DistilBERT transformer fine-tuned on SST-2, running via Python FastAPI backend.",
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
  
  // Track loading state per engine
  const [loadingStates, setLoadingStates] = useState<Record<Engine, boolean>>({
    classical: false,
    ml: false,
    gemini: false,
  });

  // Track results per engine
  const [results, setResults] = useState<Record<Engine, AnalysisResult | null>>({
    classical: null,
    ml: null,
    gemini: null,
  });

  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsgs, setErrorMsgs] = useState<Record<Engine, string>>({
    classical: "",
    ml: "",
    gemini: "",
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const cfg = engineConfig[engine];

  const currentResult = results[engine];
  const currentLoading = loadingStates[engine];
  const currentError = errorMsgs[engine];

  useEffect(() => {
    if (exampleText) {
      handleTextChange(exampleText);
      onExampleConsumed?.();
    }
  }, [exampleText, onExampleConsumed]);

  useEffect(() => {
    if (Object.values(loadingStates).some(Boolean) || currentResult) {
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
  }, [loadingStates, currentResult]);

  // Gemini loading steps animation
  useEffect(() => {
    if (!loadingStates.gemini || engine !== "gemini") return;
    if (loadingStep >= loadingMessages.length) return;
    const timer = setTimeout(() => setLoadingStep(s => s + 1), 500);
    return () => clearTimeout(timer);
  }, [loadingStates.gemini, loadingStep, engine]);

  const handleTextChange = (newText: string) => {
    setInput(newText);
    setResults({ classical: null, ml: null, gemini: null });
    setErrorMsgs({ classical: "", ml: "", gemini: "" });
  };

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoadingStep(0);
    
    // Clear current engine error and result
    setResults(prev => ({ ...prev, [engine]: null }));
    setErrorMsgs(prev => ({ ...prev, [engine]: "" }));
    setLoadingStates(prev => ({ ...prev, [engine]: true }));

    try {
      let res: AnalysisResult;

      if (engine === "classical") {
        res = await classicalAnalyzeText(input);
      } else if (engine === "ml") {
        res = await mlAnalyzeText(input);
      } else {
        // Gemini
        res = await analyzeText(input);
      }

      setResults(prev => ({ ...prev, [engine]: res }));
      setLoadingStates(prev => ({ ...prev, [engine]: false }));
      
      // We pass the active result up if needed
      onResultChange?.(res);
      
    } catch (err: any) {
      setLoadingStates(prev => ({ ...prev, [engine]: false }));
      
      let errMsg = "Analysis failed. Please check your API key or try again.";
      if (err.message === "MISSING_API_KEY") {
        errMsg = "API Key required. Please click the Settings icon in the top right to set your free Gemini API key.";
      } else if (engine === "ml") {
        errMsg = "ML model failed to respond from Python backend.";
      }
      
      setErrorMsgs(prev => ({ ...prev, [engine]: errMsg }));
    }
  };

  const handleClear = () => {
    setInput("");
    setResults({ classical: null, ml: null, gemini: null });
    setErrorMsgs({ classical: "", ml: "", gemini: "" });
    setLoadingStates({ classical: false, ml: false, gemini: false });
    onResultChange?.(null);
  };

  const loadExample = () => {
    const sample = exampleSamples[Math.floor(Math.random() * exampleSamples.length)];
    handleTextChange(sample.text);
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
                onClick={() => setEngine(eng)}
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
            onChange={e => handleTextChange(e.target.value)}
            placeholder={`Try: "Haha it's okay, I'm used to being left out." or "Thanks so much for sending this at the last possible minute."`}
            className="w-full h-32 bg-secondary/50 border border-border rounded-lg p-4 text-foreground text-sm placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-violet/40 transition-all"
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!input.trim() || currentLoading}
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

          {currentError && (
            <div className="flex items-start gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <p className="text-sm text-red-500/90 leading-relaxed">{currentError}</p>
            </div>
          )}
        </div>

        <div id="analysis-output" ref={scrollRef} className="scroll-mt-24" />

        {/* Gemini Loading Steps */}
        {currentLoading && engine === "gemini" && (
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
        {currentLoading && engine !== "gemini" && (
          <div className="mt-8 glass-card p-8 flex flex-col items-center gap-4 animate-fade-in">
            <div className={`w-10 h-10 rounded-full border-2 ${engine === "classical" ? "border-cyan/30 border-t-cyan" : "border-pink/30 border-t-pink"} animate-spin`} />
            <p className="text-sm text-muted-foreground">
              {engine === "classical" ? "Running lexicon analysis..." : "Preparing ML inference..."}
            </p>
          </div>
        )}

        {/* Results */}
        {!currentLoading && currentResult && (
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
                <div className="text-2xl font-heading font-bold text-foreground">{currentResult.surfaceEmotion.label}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan to-cyan/60 transition-all duration-700" style={{ width: `${currentResult.surfaceEmotion.confidence}%` }} />
                  </div>
                  <span className="text-xs text-cyan font-medium">{currentResult.surfaceEmotion.confidence}%</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{currentResult.surfaceEmotion.explanation}</p>
              </div>

              {/* Hidden Emotion */}
              <div className="glass-card-hover p-5 space-y-3">
                <div className="flex items-center gap-2 text-pink">
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Hidden Emotion</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentResult.hiddenEmotion.icon}</span>
                  <span className="text-2xl font-heading font-bold text-foreground">{currentResult.hiddenEmotion.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-pink to-pink/60 transition-all duration-700" style={{ width: `${currentResult.hiddenEmotion.confidence}%` }} />
                  </div>
                  <span className="text-xs text-pink font-medium">{currentResult.hiddenEmotion.confidence}%</span>
                </div>
              </div>

              {/* Masking Style */}
              <div className="glass-card-hover p-5 space-y-3">
                <div className="flex items-center gap-2 text-violet">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Masking Style</span>
                </div>
                <div className="text-2xl font-heading font-bold text-foreground">{currentResult.maskingStyle.label}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet to-violet/60 transition-all duration-700" style={{ width: `${currentResult.maskingStyle.confidence}%` }} />
                  </div>
                  <span className="text-xs text-violet font-medium">{currentResult.maskingStyle.confidence}%</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{currentResult.maskingStyle.definition}</p>
              </div>
            </div>

            {/* Explanation */}
            <div className="glass-card-hover p-5 space-y-3">
              <div className="flex items-center gap-2 text-blue">
                <Lightbulb className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Explainable Rationale</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{currentResult.explanation}</p>
            </div>

            {/* Cues */}
            {currentResult.cues.length > 0 && (
              <div className="glass-card-hover p-5 space-y-3">
                <div className="flex items-center gap-2 text-cyan">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Linguistic Cues</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentResult.cues.map((cue: string, i: number) => (
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
                  { label: "Overall Confidence", value: currentResult.overallConfidence },
                  { label: "Masking Likelihood", value: currentResult.maskingLikelihood },
                  { label: "Ambiguity Score", value: currentResult.ambiguityScore },
                  { label: "Mismatch Score", value: currentResult.mismatchScore },
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
