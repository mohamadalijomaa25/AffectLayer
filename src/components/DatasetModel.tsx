import { useState } from "react";
import { Database, Cpu, Settings, BarChart3 } from "lucide-react";

const tabs = [
  {
    id: "dataset",
    icon: Database,
    label: "Dataset",
    content: {
      title: "Custom Annotated Dataset",
      items: [
        "Curated corpus of emotionally masked language samples across multiple domains",
        "Multi-label annotations: surface emotion, hidden emotion, masking style",
        "Sourced from social media, chat logs, diary entries, and email-style text",
        "Balanced representation across emotion categories and masking strategies",
        "Inter-annotator agreement metrics and annotation guidelines documented",
      ],
    },
  },
  {
    id: "model",
    icon: Cpu,
    label: "Model Architecture",
    content: {
      title: "Transformer-Based Architecture",
      items: [
        "Baseline: TF-IDF features with SVM and logistic regression classifiers",
        "Advanced: Fine-tuned BERT / RoBERTa with task-specific classification heads",
        "Optional multi-task transformer for joint surface, hidden, and masking prediction",
        "Attention-based cue extraction for explainability support",
        "Modular pipeline allowing independent evaluation of each stage",
      ],
    },
  },
  {
    id: "training",
    icon: Settings,
    label: "Training Strategy",
    content: {
      title: "Supervised Fine-Tuning",
      items: [
        "Supervised fine-tuning on annotated emotionally masked text",
        "Multi-label and multi-task learning formulations explored",
        "Class balancing through oversampling and focal loss weighting",
        "Cross-validation with stratified splits for robust evaluation",
        "Rationale extraction and explainability module training",
      ],
    },
  },
  {
    id: "eval",
    icon: BarChart3,
    label: "Evaluation",
    content: {
      title: "Evaluation Metrics",
      items: [
        "Accuracy, Macro F1, Precision, and Recall across all prediction tasks",
        "Per-class confusion matrices for error analysis",
        "Explainability usefulness scoring through human evaluation",
        "Ablation studies for pipeline component contribution",
        "Comparison against sentiment-only and sarcasm-only baselines",
      ],
    },
  },
];

const DatasetModel = () => {
  const [active, setActive] = useState("dataset");
  const current = tabs.find(t => t.id === active)!;

  return (
    <section id="dataset-model" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="section-title">Dataset & <span className="gradient-text">Model</span></h2>
          <p className="section-subtitle mx-auto">Technical details of the data, architecture, training, and evaluation methodology.</p>
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
