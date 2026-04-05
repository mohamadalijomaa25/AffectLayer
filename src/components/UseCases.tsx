import { Heart, MessageCircle, Briefcase, Headphones, Users, BookOpen, GraduationCap, Cpu } from "lucide-react";

const cases = [
  { icon: Heart, title: "Mental Health Support", desc: "Identify masked distress signals in patient communications for early intervention support." },
  { icon: MessageCircle, title: "Social Media Analysis", desc: "Detect emotionally suppressed content in online communication at scale." },
  { icon: Briefcase, title: "Workplace Wellbeing", desc: "Surface hidden frustration or burnout signals in professional communications." },
  { icon: Headphones, title: "Customer Support Intelligence", desc: "Understand true customer sentiment beyond polite surface-level feedback." },
  { icon: Users, title: "HR Communication Insight", desc: "Identify masked dissatisfaction in employee feedback and surveys." },
  { icon: BookOpen, title: "Journaling & Diary Analysis", desc: "Support self-reflection by revealing emotional patterns in personal writing." },
  { icon: GraduationCap, title: "Education & Student Wellbeing", desc: "Monitor student communications for signs of emotional distress." },
  { icon: Cpu, title: "HCI Research", desc: "Advance human-computer interaction through emotionally aware language models." },
];

const UseCases = () => {
  return (
    <section id="usecases" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="section-title">Use <span className="gradient-text">Cases</span></h2>
          <p className="section-subtitle mx-auto">Applications of hidden emotion detection across domains — framed as decision support, not diagnosis.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cases.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="glass-card-hover p-5 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-violet/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-violet" />
                </div>
                <h3 className="font-heading font-semibold text-foreground text-sm">{c.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
