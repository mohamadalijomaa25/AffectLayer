import { ShieldCheck, AlertTriangle, Users, Scale, Brain, Heart } from "lucide-react";

const items = [
  { icon: AlertTriangle, title: "Probabilistic Predictions", desc: "All outputs are probabilistic estimates, not definitive judgments. Results should be interpreted with appropriate uncertainty." },
  { icon: Brain, title: "Textual Limitations", desc: "Hidden emotion cannot be fully inferred from text alone. Tone, body language, and context carry information beyond the written word." },
  { icon: Users, title: "Cultural & Personal Variation", desc: "Humor, sarcasm, politeness norms, and emotional expression vary across cultures, communities, and individuals." },
  { icon: Heart, title: "Not a Diagnostic Tool", desc: "This system is for research and analysis support only. Outputs should not replace professional psychological or clinical care." },
  { icon: ShieldCheck, title: "Human Oversight Required", desc: "Automated emotional inference must always be paired with human review, especially in sensitive applications." },
  { icon: Scale, title: "Fairness & Bias", desc: "Model outputs may reflect biases present in training data. Bias mitigation, fairness auditing, and transparency are ongoing priorities." },
];

const EthicsSection = () => {
  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="section-title">Ethics & <span className="gradient-text">Limitations</span></h2>
          <p className="section-subtitle mx-auto">Responsible AI requires transparency about what a system can and cannot do.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="glass-card p-5 space-y-3 border-amber-500/10">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-amber-400" />
                  <h3 className="font-heading font-semibold text-foreground text-sm">{item.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EthicsSection;
