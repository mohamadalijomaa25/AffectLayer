import { exampleSamples } from "@/lib/analyzer";
import { ArrowRight } from "lucide-react";

interface Props {
  onSelect: (text: string) => void;
}

const ExampleSamples = ({ onSelect }: Props) => {
  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="section-title">Example <span className="gradient-text">Samples</span></h2>
          <p className="section-subtitle mx-auto">Click any example to load it into the analyzer and see how the system detects hidden emotions.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exampleSamples.map((sample, i) => (
            <button
              key={i}
              onClick={() => {
                onSelect(sample.text);
                document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="glass-card-hover p-5 text-left group space-y-3"
            >
              <p className="text-sm text-foreground/80 italic leading-relaxed">"{sample.text}"</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-md bg-pink/10 text-pink text-xs font-medium">{sample.hiddenEmotion}</span>
                <span className="px-2 py-1 rounded-md bg-violet/10 text-violet text-xs font-medium">{sample.maskingStyle}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-cyan transition-colors">
                Analyze this <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExampleSamples;
