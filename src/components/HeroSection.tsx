import { ArrowRight, Sparkles } from "lucide-react";

const floatingChips = [
  { label: "Surface: Polite", x: "right-4 md:right-12", y: "top-16", delay: "0s" },
  { label: "Hidden: Frustration", x: "right-0 md:right-4", y: "top-36", delay: "1s" },
  { label: "Masking: Passive Aggression", x: "right-8 md:right-20", y: "top-56", delay: "2s" },
  { label: "Confidence: 88%", x: "right-2 md:right-8", y: "top-72", delay: "0.5s" },
];

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink/6 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "4s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div className="space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet/10 border border-violet/20 text-violet text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              NLP Research Project
            </div>
            <h1 className="section-title leading-tight">
              Hidden Emotion Detection in{" "}
              <span className="gradient-text">Masked Text</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Detect when language sounds fine on the surface, but carries hidden emotional distress underneath.
            </p>
            <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-lg">
              A multi-stage NLP system that identifies the mismatch between explicit tone and latent affect, combining emotion recognition, sarcasm detection, and explainable inference.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#analyzer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-violet to-primary text-primary-foreground font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-violet/25 hover:-translate-y-0.5">
                Try Analyzer
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#research" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium text-sm transition-all duration-300 hover:bg-secondary hover:-translate-y-0.5">
                Explore Research
              </a>
            </div>
          </div>

          {/* Right - floating cards */}
          <div className="relative hidden lg:block h-[420px]">
            {/* Central analysis mockup */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-card p-6 w-80 animate-float">
                <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Live Analysis</div>
                <p className="text-sm text-foreground/80 italic mb-4">"Haha it's okay, I'm used to being ignored."</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Surface</span>
                    <span className="text-cyan font-medium">Humorous</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan to-cyan/60" style={{ width: "86%" }} />
                  </div>
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-muted-foreground">Hidden</span>
                    <span className="text-pink font-medium">Sadness</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-pink to-pink/60" style={{ width: "84%" }} />
                  </div>
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-muted-foreground">Mismatch</span>
                    <span className="text-violet font-medium">81%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet to-violet/60" style={{ width: "81%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating chips */}
            {floatingChips.map((chip, i) => (
              <div
                key={i}
                className={`absolute ${chip.x} ${chip.y} px-3 py-1.5 rounded-full glass-card text-xs font-medium text-foreground/70 animate-float`}
                style={{ animationDelay: chip.delay }}
              >
                {chip.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
