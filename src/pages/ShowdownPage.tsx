import { useState } from "react";
import { Swords, Loader2, CheckCircle2, XCircle, Brain, Bot, Cpu, Shuffle } from "lucide-react";
import { analyzeText, AnalysisResult, exampleSamples } from "@/lib/analyzer";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const ShowdownPage = () => {
  const [text, setText] = useState("Haha don't worry about me, I'll survive.");
  const [results, setResults] = useState<{
    classical: AnalysisResult | null;
    ml: AnalysisResult | null;
    gemini: AnalysisResult | null;
  }>({ classical: null, ml: null, gemini: null });
  
  const [loading, setLoading] = useState<{
    classical: boolean;
    ml: boolean;
    gemini: boolean;
  }>({ classical: false, ml: false, gemini: false });

  const runShowdown = async () => {
    if (!text.trim()) return;

    setLoading({ classical: true, ml: true, gemini: true });
    setResults({ classical: null, ml: null, gemini: null });

    // 1. Classical Engine
    fetch(`${API_URL}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, engine: "classical" })
    }).then(r => r.json()).then(data => {
      setResults(prev => ({ ...prev, classical: data }));
      setLoading(prev => ({ ...prev, classical: false }));
    }).catch(() => setLoading(prev => ({ ...prev, classical: false })));

    // 2. ML Engine
    fetch(`${API_URL}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, engine: "ml" })
    }).then(r => r.json()).then(data => {
      setResults(prev => ({ ...prev, ml: data }));
      setLoading(prev => ({ ...prev, ml: false }));
    }).catch(() => setLoading(prev => ({ ...prev, ml: false })));

    // 3. Gemini Engine
    analyzeText(text).then(data => {
      setResults(prev => ({ ...prev, gemini: data }));
      setLoading(prev => ({ ...prev, gemini: false }));
    }).catch(() => setLoading(prev => ({ ...prev, gemini: false })));
  };

  const loadRandomExample = () => {
    const random = exampleSamples[Math.floor(Math.random() * exampleSamples.length)];
    setText(random.text);
  };

  const ResultCard = ({ title, icon: Icon, data, isLoading, colorClass, borderClass, isWinner }: { title: string, icon: any, data: AnalysisResult | null, isLoading: boolean, colorClass: string, borderClass: string, isWinner?: boolean }) => (
    <div className={`glass-card p-6 flex flex-col h-full relative overflow-hidden transition-all duration-500 ${data ? borderClass : 'border-border/40'}`}>
      {isWinner && (
        <div className="absolute top-0 right-0 bg-green-500/20 text-green-400 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Winner
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{isLoading ? "Processing..." : data ? "Analysis Complete" : "Waiting"}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm animate-pulse">Running inference...</p>
        </div>
      ) : data && !data.error ? (
        <div className="flex-1 space-y-5 animate-fade-in">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Surface Detection</span>
            <div className="flex items-center justify-between bg-secondary/30 p-2.5 rounded-lg border border-border/50">
              <span className="font-medium">{data.surfaceEmotion.label}</span>
              <span className="text-xs px-2 py-1 bg-background rounded text-muted-foreground">{data.surfaceEmotion.confidence}% Conf</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hidden Emotion</span>
            <div className={`flex items-center gap-2 p-2.5 rounded-lg border ${isWinner ? 'bg-pink/10 border-pink/30 text-pink-100' : 'bg-secondary/30 border-border/50'}`}>
              <span className="text-xl">{data.hiddenEmotion.icon}</span>
              <span className="font-medium">{data.hiddenEmotion.label}</span>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm text-foreground/80 leading-relaxed italic border-l-2 border-primary/50 pl-3">
              "{data.explanation.split('.')[0]}."
            </p>
          </div>
        </div>
      ) : data?.error ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-destructive py-8">
          <XCircle className="w-8 h-8" />
          <p className="text-sm text-center">Failed to connect to engine</p>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground/50 py-8 text-sm">
          Awaiting input...
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium">
            <Swords className="w-3 h-3" />
            Live Comparison
          </div>
          <h1 className="section-title">
            The Engine <span className="gradient-text">Showdown</span>
          </h1>
          <p className="section-subtitle mx-auto">
            See exactly why standard NLP models fail at detecting hidden emotions by pitting all three engines against each other in real-time.
          </p>
        </div>

        {/* Input Section */}
        <div className="glass-card p-2 p-1.5 md:p-2 mb-12 flex flex-col md:flex-row gap-2 max-w-5xl mx-auto">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter a masked sentence (e.g. 'I'm fine, really.')"
            className="flex-1 bg-transparent border-none px-4 py-3 text-foreground focus:ring-0 focus:outline-none placeholder:text-muted-foreground/50 min-w-0"
            onKeyDown={(e) => e.key === "Enter" && runShowdown()}
          />
          <button
            onClick={loadRandomExample}
            disabled={Object.values(loading).some(l => l)}
            className="md:w-auto w-full px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Shuffle className="w-4 h-4" />
            Random Example
          </button>
          <button
            onClick={runShowdown}
            disabled={Object.values(loading).some(l => l) || !text.trim()}
            className="md:w-auto w-full px-8 py-3 rounded-lg bg-foreground text-background font-medium hover:bg-foreground/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {Object.values(loading).some(l => l) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Swords className="w-4 h-4" />}
            Run Showdown
          </button>
        </div>

        {/* Results Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <ResultCard
            title="Classical (VADER)"
            icon={Cpu}
            data={results.classical}
            isLoading={loading.classical}
            colorClass="bg-cyan/20 text-cyan"
            borderClass="border-cyan/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
          />
          <ResultCard
            title="DistilBERT (ML)"
            icon={Bot}
            data={results.ml}
            isLoading={loading.ml}
            colorClass="bg-violet/20 text-violet"
            borderClass="border-violet/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
          />
          <ResultCard
            title="Gemini 2.5 (LLM)"
            icon={Brain}
            data={results.gemini}
            isLoading={loading.gemini}
            colorClass="bg-pink/20 text-pink"
            borderClass="border-pink/40 shadow-[0_0_20px_rgba(236,72,153,0.2)]"
            isWinner={results.gemini !== null}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowdownPage;
