import { useState, useEffect } from "react";
import { Menu, X, Settings } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { SettingsModal } from "./SettingsModal";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Analyzer", href: "#analyzer" },
  { label: "Methodology", href: "#pipeline" },
  { label: "Research", href: "#research" },
  { label: "Use Cases", href: "#usecases" },
  { label: "Architecture", href: "#dataset-model" },
  { label: "About", href: "#about" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = navLinks.map(l => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-background/50" : "bg-transparent"}`}>
      <div className="bg-primary/10 text-primary text-xs text-center py-1 font-medium border-b border-primary/20">
        
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <a href="#home" className="flex items-center gap-2.5 group">
          <img src="/favicon.png" alt="AffectLayer Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
          <span className="font-heading font-semibold text-foreground text-lg tracking-tight">AffectLayer</span>
        </a>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 mr-2">
            {navLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeSection === l.href.slice(1)
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full border border-border text-foreground hover:bg-secondary transition-colors"
            title="AI API Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <ThemeToggle />

          <button
            className="md:hidden text-foreground ml-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border animate-fade-in">
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === l.href.slice(1) ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </nav>
  );
};

export default Navbar;
