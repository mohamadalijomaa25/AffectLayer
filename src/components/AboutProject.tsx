import { Github, Mail, Instagram } from "lucide-react";

const AboutProject = () => {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="section-title">About the <span className="gradient-text">Project</span></h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-heading font-semibold text-foreground text-lg">Project Overview</h3>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                This project explores the intersection of emotion recognition, sarcasm detection, and explainable NLP to address a critical gap in sentiment analysis: the detection of emotionally masked language.
              </p>
              <p>
                Unlike conventional approaches that take text at face value, this system identifies the mismatch between what is said and what is felt, providing both predictions and human-readable explanations.
              </p>
              <p>
                The project contributes to the growing field of affective computing and computational psychology, with applications in mental health, social media analysis, and human-computer interaction.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="font-heading font-semibold text-foreground text-lg">Researcher</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                {[
                  { label: "Student", value: "Mohamad-Ali Jomaa" },
                  { label: "Supervisor", value: "Dr. Zeinab Hajj Hassan" },
                  { label: "University", value: "Lebanese International University (LIU)" },
                  { label: "Program", value: "Computer Science / NLP" },
                  { label: "Year", value: "2026" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={`font-medium ${item.value.startsWith("[") ? "text-violet/70 italic" : "text-foreground"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 flex flex-wrap gap-4">
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=moudijomaa16@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-violet transition-colors"
                  title="Contact via email"
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
                <a
                  href="https://github.com/mohamadalijomaa25"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-violet transition-colors"
                  title="View source on GitHub"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub
                </a>
                <a
                  href="https://www.instagram.com/mhmdalijomaa_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-violet transition-colors"
                  title="Follow on Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" /> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutProject;
