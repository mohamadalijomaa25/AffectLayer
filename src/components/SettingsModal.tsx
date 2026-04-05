import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Key, Save } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: Props) {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem("gemini_api_key") || "";
      setApiKey(storedKey);
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem("gemini_api_key", apiKey.trim());
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="glass-card w-full max-w-md p-6 space-y-6 relative overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
            <Key className="w-5 h-5 text-violet" />
            API Configuration
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AffectLayer uses the <strong className="text-foreground">Google Gemini API</strong> to perform real-time semantic analysis. Provide your free API key below to enable live network inference.
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet/30 transition-all font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Don't have one? Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline hover:text-cyan/80">Google AI Studio</a>.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 text-sm text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg animate-fade-in">
            ✓ Key saved securely to your browser.
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors border border-transparent"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-gradient-to-r from-violet to-cyan text-primary-foreground rounded-lg hover:shadow-lg hover:shadow-violet/25 transition-all"
          >
            <Save className="w-4 h-4" /> Save Key
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
