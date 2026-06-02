import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Settings } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { SettingsModal } from "./SettingsModal";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Analyzer", path: "/analyzer" },
  { label: "Methodology", path: "/methodology" },
  { label: "Engines", path: "/engines" },
  { label: "Research", path: "/research" },
  { label: "Use Cases", path: "/use-cases" },
  { label: "Architecture", path: "/dataset" },
  { label: "About", path: "/about" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-background/50" : "bg-transparent"}`}>
      <div className="bg-primary/10 text-primary text-xs text-center py-1 font-medium border-b border-primary/20">
        
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src="/favicon.png" alt="AffectLayer Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
          <span className="font-heading font-semibold text-foreground text-lg tracking-tight">AffectLayer</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 mr-2">
            {navLinks.map(l => (
              <Link
                key={l.path}
                to={l.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  location.pathname === l.path
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {l.label}
              </Link>
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
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === l.path ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </nav>
  );
};

export default Navbar;
