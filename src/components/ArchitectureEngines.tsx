import { Cpu, Brain, Sparkles } from "lucide-react";

const engines = [
  {
    icon: Cpu,
    title: "The Classical Engine",
    subtitle: "VADER Lexicon + Heuristics",
    color: "text-cyan",
    bg: "bg-cyan/10",
    border: "border-cyan",
    howItWorks: 'This engine does not "think" or use neural networks. It relies entirely on a Rule-Based Lexicon combined with hard-coded logic. When a user inputs text, the engine splits it into individual words and looks them up in a massive dictionary to calculate a mathematical "Sentiment Score".',
    training: "It uses VADER (Valence Aware Dictionary and sEntiment Reasoner). VADER was never trained by a computer. Instead, human researchers manually rated thousands of words, emojis, and slang terms on a scale from highly negative to highly positive.",
    mechanics: [
      "Surface Scoring: The Python script feeds the text to VADER.",
      "Heuristic Masking Detection: Scans the text against custom hard-coded arrays of words (e.g., 'thanks for', 'as usual').",
      "Logic Resolution: If VADER says Positive, but detects a Passive cue, it overrides the literal meaning and labels the Hidden Emotion as Frustration."
    ]
  },
  {
    icon: Brain,
    title: "The Machine Learning Engine",
    subtitle: "DistilBERT Transformer",
    color: "text-pink",
    bg: "bg-pink/10",
    border: "border-pink",
    howItWorks: 'This engine uses a Transformer Neural Network. Unlike the Classical engine which looks at words individually, Transformers read the entire sentence simultaneously (using a mechanism called "Self-Attention") to understand the context and relationship between words.',
    training: "The model used is distilbert-base-uncased-finetuned-sst-2-english. It was pre-trained by Hugging Face on massive amounts of raw internet text, and then fine-tuned on SST-2 (The Stanford Sentiment Treebank), a dataset of 70,000 human-labeled movie reviews.",
    mechanics: [
      "API Call: When text is submitted, the FastAPI backend makes a request to the Hugging Face Serverless API.",
      "Inference: Hugging Face runs the text through the neural network and returns a mathematical probability.",
      "Contextual Fallback: Because it gets tricked by sarcasm, the Python script applies a safety net checking for minimizing language."
    ]
  },
  {
    icon: Sparkles,
    title: "The Generative AI Engine",
    subtitle: "Gemini 2.5 Flash",
    color: "text-violet",
    bg: "bg-violet/10",
    border: "border-violet",
    howItWorks: "This engine uses a massive Large Language Model (LLM). It doesn't just classify text into categories; it actively reasons through the psychology of the statement and generates a dynamic explanation.",
    training: "Google's Gemini 2.5 Flash is a multimodal AI trained on a significant portion of the entire internet. It utilizes Zero-Shot Learning, meaning you don't need to fine-tune it with a specific dataset of 'masked emotions.' It inherently understands human psychology.",
    mechanics: [
      "Direct Client Connection: Bypassing the Python backend, the React frontend connects directly to Google's API.",
      "Prompt Engineering: The frontend wraps the text in a massive 'System Prompt' instructing the AI to act as a psychologist.",
      "Inference & Parsing: Gemini acts as the psychologist, breaks down the reasoning, translates it, and sends back JSON."
    ]
  }
];

const ArchitectureEngines = () => {
  return (
    <section id="architecture-engines" className="section-padding bg-secondary/30 border-y border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="section-title">Architecture & <span className="gradient-text">Engines</span></h2>
          <p className="section-subtitle mx-auto">A deep dive into the mechanics, training data, and inner workings of all three engines powering the platform.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {engines.map((engine, idx) => {
            const Icon = engine.icon;
            return (
              <div key={idx} className={`glass-card-hover p-6 md:p-8 flex flex-col space-y-6 border-t-2 transition-all duration-300 ${engine.border}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3.5 rounded-xl ${engine.bg}`}>
                    <Icon className={`w-6 h-6 ${engine.color}`} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-foreground leading-tight">{engine.title}</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">{engine.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full bg-current ${engine.color}`}></span>
                      How it works
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-3.5 border-l-2 border-border/50">{engine.howItWorks}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full bg-current ${engine.color}`}></span>
                      Training & Dataset
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-3.5 border-l-2 border-border/50">{engine.training}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full bg-current ${engine.color}`}></span>
                      Mechanics
                    </h4>
                    <ul className="space-y-2.5 pl-3.5 border-l-2 border-border/50">
                      {engine.mechanics.map((mech, i) => {
                        const [title, ...descArr] = mech.split(': ');
                        const desc = descArr.join(': ');
                        return (
                          <li key={i} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                            <span className={`text-xs mt-0.5 font-mono font-bold ${engine.color}`}>{i+1}.</span>
                            <span>
                              <strong className="text-foreground/80 font-semibold">{title}: </strong> 
                              {desc}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ArchitectureEngines;
