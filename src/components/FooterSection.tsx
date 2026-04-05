

const FooterSection = () => {
  return (
    <footer className="border-t border-border py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="AffectLayer Logo" className="w-8 h-8 object-contain" />
            <span className="font-heading font-semibold text-foreground text-sm">AffectLayer</span>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            {[
              { label: "Home", href: "#home" },
              { label: "Analyzer", href: "#demo" },
              { label: "Methodology", href: "#pipeline" },
              { label: "Research", href: "#research" },
              { label: "Use Cases", href: "#usecases" },
              { label: "About", href: "#about" },
            ].map(l => (
              <a key={l.label} href={l.href} className="hover:text-foreground transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground/60">
            This system is for research and educational purposes only. Predictions are probabilistic and should not replace professional care.
          </p>
          <p className="text-xs text-muted-foreground/40 mt-2">
            © 2026 AffectLayer — Hidden Emotion Detection in Masked Text. Research Project.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
