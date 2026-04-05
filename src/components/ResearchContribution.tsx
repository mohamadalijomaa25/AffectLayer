import { Zap, Layers, Brain, Eye, Monitor, BarChart3 } from "lucide-react";

const stats = [
  { icon: Layers, value: "7", label: "Hidden Emotion Categories" },
  { icon: Zap, value: "6", label: "Masking Styles" },
  { icon: Brain, value: "Multi-Stage", label: "NLP Pipeline" },
  { icon: Eye, value: "Explainable", label: "Inference Output" },
  { icon: Monitor, value: "Real-Time", label: "Live Interface" },
  { icon: BarChart3, value: "Context-Aware", label: "Analysis" },
];

const ResearchContribution = () => {
  return (
    <section id="research" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="section-title">Why This <span className="gradient-text">Matters</span></h2>
          <p className="section-subtitle mx-auto">
            Traditional sentiment analysis captures only surface polarity. Emotionally masked language contains a fundamental mismatch between explicit tone and latent affect — this project bridges that gap.
          </p>
        </div>

        <div className="glass-card p-6 md:p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-foreground text-lg">Research Gap</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Existing NLP systems treat text at face value. When someone writes "I'm fine," traditional models classify it as neutral or positive. This project recognizes that such language often conceals genuine distress behind socially acceptable phrasing.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-foreground text-lg">Novel Contribution</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                By combining emotion recognition, sarcasm detection, masking style classification, and explainable inference into a unified pipeline, this project addresses a more psychologically nuanced and human challenge in computational linguistics.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="glass-card-hover p-5 text-center space-y-2">
                <Icon className="w-5 h-5 text-violet mx-auto" />
                <div className="font-heading font-bold text-foreground text-lg">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResearchContribution;
