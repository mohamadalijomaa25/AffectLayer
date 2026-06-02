import { useState } from "react";
import { Terminal, Play, Server, Code, FileJson } from "lucide-react";

const ApiPlaygroundPage = () => {
  const [text, setText] = useState("Haha it's okay, I'm used to being ignored.");
  const [engine, setEngine] = useState<"classical" | "ml">("ml");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleTest = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, engine }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: "Failed to connect to backend. Is FastAPI running?" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet/10 border border-violet/20 text-violet text-xs font-medium">
            <Server className="w-3 h-3" />
            FastAPI Backend
          </div>
          <h1 className="section-title">
            Interactive <span className="gradient-text">API Dashboard</span>
          </h1>
          <p className="section-subtitle">
            Send live HTTP requests directly to the Python FastAPI backend and inspect the raw JSON response. This bypasses the Gemini LLM to show the deterministic tri-engine fallbacks.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Request Builder */}
          <div className="glass-card flex flex-col overflow-hidden border-border/50">
            <div className="bg-secondary/50 px-4 py-3 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Terminal className="w-4 h-4 text-cyan" />
                Request Builder
              </div>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-orange-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
            </div>

            <div className="p-6 space-y-6 flex-1">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Endpoint</label>
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border border-border/50 font-mono text-sm">
                  <span className="text-violet font-bold">POST</span>
                  <span className="text-foreground/80">/api/analyze</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payload (JSON)</label>
                <div className="space-y-4 p-4 bg-secondary/30 dark:bg-[#0d1117] rounded-lg border border-border/50 font-mono text-sm shadow-inner">
                  <div className="flex flex-col gap-2">
                    <span className="text-cyan">"text"</span>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full bg-transparent border border-border/40 rounded-md p-2 text-foreground dark:text-slate-200 focus:outline-none focus:border-violet/50 resize-none h-20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-pink">"engine"</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEngine("ml")}
                        className={`px-4 py-1.5 rounded-md border text-xs transition-colors ${
                          engine === "ml" ? "bg-pink/20 border-pink/50 text-pink" : "bg-transparent border-border/50 text-muted-foreground hover:border-pink/30"
                        }`}
                      >
                        "ml" (DistilBERT)
                      </button>
                      <button
                        onClick={() => setEngine("classical")}
                        className={`px-4 py-1.5 rounded-md border text-xs transition-colors ${
                          engine === "classical" ? "bg-cyan/20 border-cyan/50 text-cyan" : "bg-transparent border-border/50 text-muted-foreground hover:border-cyan/30"
                        }`}
                      >
                        "classical" (VADER)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-auto">
                <button
                  onClick={handleTest}
                  disabled={loading || !text.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-violet to-cyan text-white font-semibold shadow-lg shadow-violet/20 hover:shadow-cyan/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* JSON Response */}
          <div className="glass-card flex flex-col overflow-hidden border-border/50 h-[600px] lg:h-auto">
            <div className="bg-secondary/50 dark:bg-[#0d1117] px-4 py-3 border-b border-border/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground/80 dark:text-slate-300">
                <FileJson className="w-4 h-4 text-green-400" />
                Response
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${response && !response.error ? "bg-green-500/20 text-green-400" : response?.error ? "bg-red-500/20 text-red-400" : "bg-secondary text-muted-foreground"}`}>
                  {response && !response.error ? "200 OK" : response?.error ? "500 Error" : "Waiting..."}
                </span>
              </div>
            </div>
            
            <div className="p-4 flex-1 overflow-auto bg-secondary/30 dark:bg-[#0d1117] font-mono text-sm custom-scrollbar">
              {response ? (
                <pre className="text-foreground/90 dark:text-slate-200 whitespace-pre-wrap break-words">
                  {JSON.stringify(response, null, 2).split('\n').map((line, i) => {
                    // Simple syntax highlighting for JSON keys
                    if (line.includes('":')) {
                      const parts = line.split(':');
                      return (
                        <div key={i} className="leading-relaxed">
                          <span className="text-cyan-700 dark:text-cyan/90">{parts[0]}</span>:
                          <span className={parts[1].includes('"') ? "text-green-700 dark:text-green-300/90" : "text-pink-600 dark:text-pink/90"}>{parts.slice(1).join(':')}</span>
                        </div>
                      );
                    }
                    return <div key={i} className="text-foreground/60 dark:text-slate-400 leading-relaxed">{line}</div>;
                  })}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground dark:text-slate-500 gap-3 opacity-50">
                  <Code className="w-12 h-12" />
                  <p>Hit "Send Request" to view raw JSON</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiPlaygroundPage;
