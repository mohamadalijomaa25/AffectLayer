import { useState } from "react";
import { Database, Cpu, Settings, BarChart3 } from "lucide-react";

const tabs = [
  {
    id: "architecture",
    icon: Database,
    label: "System Architecture",
    content: {
      title: "Full-Stack Serverless Architecture",
      items: [
        "React + Vite Single-Page Application (SPA) frontend hosted on Render",
        "Python FastAPI backend handling computationally intensive deterministic sub-routines",
        "Stateless API integration utilizing HTTP endpoints for model inference",
        "Asynchronous client-side processing to eliminate UI thread blocking",
        "Zero-database implementation ensuring absolute user privacy and data volatility",
      ],
    },
  },
  {
    id: "classical",
    icon: Settings,
    label: "Classical NLP",
    content: {
      title: "Rule-Based Lexicon (VADER)",
      items: [
        "Deterministic valence-aware dictionary evaluation (VADER)",
        "Hard-coded psychological heuristics matching conversational patterns",
        "High-performance regex evaluation for lexical masking cues",
        "Executes securely in the Python FastAPI backend",
        "Provides a foundational baseline metric without contextual hallucination",
      ],
    },
  },
  {
    id: "ml",
    icon: Cpu,
    label: "Machine Learning",
    content: {
      title: "DistilBERT (SST-2)",
      items: [
        "Transformer-based Neural Network (DistilBERT) fine-tuned on the SST-2 dataset",
        "Offloaded via Serverless Inference API to bypass PaaS memory constraints",
        "Generates surface-level contextual embeddings with floating-point confidence",
        "Latent mismatch evaluated against psychological rule engines",
        "Executes via the HuggingFace infrastructure bridging the FastAPI relay",
      ],
    },
  },
  {
    id: "llm",
    icon: BarChart3,
    label: "Generative AI",
    content: {
      title: "Gemini 2.5 LLM",
      items: [
        "Low-temperature (0.2) generative inference configured for deterministic consistency",
        "Zero-shot prompting tailored for latent emotion analysis and masking detection",
        "Executes securely alongside the client-browser using local API hydration",
        "Dynamic multi-lingual output parsing (JSON schema enforcement)",
        "Captures profound psychological nuance unseen in statistical models",
      ],
    },
  },
];

const DatasetModel = () => {
  const [active, setActive] = useState("architecture");
  const current = tabs.find(t => t.id === active)!;

  return (
    <section id="dataset-model" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="section-title">Architecture & <span className="gradient-text">Engines</span></h2>
          <p className="section-subtitle mx-auto">Technical details of the system architecture and the three core engines driving the NLP pipeline.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active === tab.id
                    ? "bg-violet/15 text-violet border border-violet/30"
                    : "text-muted-foreground border border-border hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="glass-card p-6 md:p-8 animate-fade-in" key={active}>
          <h3 className="font-heading font-semibold text-foreground text-lg mb-4">{current.content.title}</h3>
          <ul className="space-y-3">
            {current.content.items.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                <span className="text-violet mt-0.5">›</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DatasetModel;
