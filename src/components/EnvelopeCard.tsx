import { useState, ReactNode, useEffect } from "react";
import { Lock, Unlock } from "lucide-react";

interface Props {
  title: string;
  icon: ReactNode;
  colorClass: string;
  children: ReactNode;
  resetDependency?: any; // To auto-close when running a new analysis
}

export default function EnvelopeCard({ title, icon, colorClass, children, resetDependency }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [progressText, setProgressText] = useState("SECURE ENVELOPE");
  const [hexCode, setHexCode] = useState("");

  // Generate a random hex code for the cybermatic scanner
  useEffect(() => {
    setHexCode(`0x${Math.floor(Math.random() * 10000000).toString(16).toUpperCase()}`);
  }, [isOpening]);

  // Auto-close when the result changes
  useEffect(() => {
    setIsOpen(false);
    setIsOpening(false);
    setProgressText("SECURE ENVELOPE");
  }, [resetDependency]);

  // Map incoming Tailwind colors to complex visual theme tokens
  const colorTheme = colorClass.includes("cyan")
    ? {
        themeColor: "cyan",
        glow: "glow-seal-cyan",
        border: "hover:border-cyan/40 border-cyan/10",
        line: "bg-cyan",
        light: "bg-cyan/10 border-cyan/20 text-cyan",
        activeBorder: "from-cyan/40 via-blue/50 to-cyan/40",
        scanner: "from-transparent via-cyan/50 to-transparent shadow-[0_0_12px_rgba(6,182,212,0.8)]",
        flapBorder: "border-cyan/15",
        flapBg: "bg-cyan/5",
      }
    : colorClass.includes("pink")
    ? {
        themeColor: "pink",
        glow: "glow-seal-pink",
        border: "hover:border-pink/40 border-pink/10",
        line: "bg-pink",
        light: "bg-pink/10 border-pink/20 text-pink",
        activeBorder: "from-pink/40 via-violet/50 to-pink/40",
        scanner: "from-transparent via-pink/50 to-transparent shadow-[0_0_12px_rgba(236,72,153,0.8)]",
        flapBorder: "border-pink/15",
        flapBg: "bg-pink/5",
      }
    : {
        themeColor: "violet",
        glow: "glow-seal-violet",
        border: "hover:border-violet/40 border-violet/10",
        line: "bg-violet",
        light: "bg-violet/10 border-violet/20 text-violet",
        activeBorder: "from-violet/40 via-primary/50 to-violet/40",
        scanner: "from-transparent via-violet/50 to-transparent shadow-[0_0_12px_rgba(139,92,246,0.8)]",
        flapBorder: "border-violet/15",
        flapBg: "bg-violet/5",
      };

  const handleOpen = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);
    setProgressText("DECRYPTING...");

    // Simulate multi-phase digital decryption
    const t1 = setTimeout(() => setProgressText("DECRYPTING HASH..."), 200);
    const t2 = setTimeout(() => setProgressText("UNMASKING CORE AFFECTS..."), 450);
    const t3 = setTimeout(() => setProgressText("DECRYPTION COMPLETE"), 700);

    const t4 = setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
    }, 850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  };

  if (isOpen) {
    return (
      <div className="relative w-full h-full min-h-[220px] rounded-xl overflow-hidden glass-card p-5 animate-scale-in transition-all duration-300">
        {/* Glowing border frame for the opened card to maintain visual consistency */}
        <div className={`absolute inset-0 p-[1.5px] rounded-xl z-0 pointer-events-none opacity-30 animated-border-flow bg-gradient-to-r ${colorTheme.activeBorder}`} />
        <div className="absolute inset-[1.5px] rounded-[11px] bg-card/90 backdrop-blur-xl z-0" />

        <div className="relative z-10 space-y-3 h-full">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleOpen}
      className={`relative w-full h-full min-h-[220px] rounded-xl overflow-hidden glass-card transition-all duration-500 cursor-pointer group flex flex-col items-center justify-center p-5 perspective-1000
        ${isOpening ? "scale-[0.98]" : "hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5"}
        ${colorTheme.border}
      `}
    >
      {/* Animated gradient border on hover/opening */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 rounded-xl opacity-0 group-hover:opacity-100 ${isOpening ? "opacity-100" : ""} p-[1.5px] animated-border-flow bg-gradient-to-r ${colorTheme.activeBorder} z-0`} 
      />
      
      {/* Inner card background buffer */}
      <div className="absolute inset-[1.5px] rounded-[11px] bg-card/95 backdrop-blur-xl z-0" />

      {/* Cyberpunk Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />

      {/* Corner Crosshairs */}
      <span className="absolute top-2 left-2 text-[9px] font-mono opacity-20 text-foreground pointer-events-none select-none">+</span>
      <span className="absolute top-2 right-2 text-[9px] font-mono opacity-20 text-foreground pointer-events-none select-none">+</span>
      <span className="absolute bottom-2 left-2 text-[9px] font-mono opacity-20 text-foreground pointer-events-none select-none">+</span>
      <span className="absolute bottom-2 right-2 text-[9px] font-mono opacity-20 text-foreground pointer-events-none select-none">+</span>

      {/* 3D Envelope Flaps Wireframe (Z-index 0) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity duration-300">
        {/* Top Flap */}
        <div
          className={`absolute inset-x-0 top-0 h-1/2 ${colorTheme.flapBg} border-b ${colorTheme.flapBorder} origin-top transition-all duration-700`}
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 55%)",
            transform: isOpening ? "rotateX(115deg) translateY(-8px)" : "rotateX(0deg)",
            transformStyle: "preserve-3d",
          }}
        />
        {/* Left Flap */}
        <div
          className={`absolute inset-y-0 left-0 w-1/2 ${colorTheme.flapBg} border-r ${colorTheme.flapBorder} origin-left transition-all duration-700`}
          style={{
            clipPath: "polygon(0 0, 0 100%, 48% 50%)",
            transform: isOpening ? "translateX(-15px) rotateY(-20deg)" : "translateX(0)",
          }}
        />
        {/* Right Flap */}
        <div
          className={`absolute inset-y-0 right-0 w-1/2 ${colorTheme.flapBg} border-l ${colorTheme.flapBorder} origin-right transition-all duration-700`}
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 52% 50%)",
            transform: isOpening ? "translateX(15px) rotateY(20deg)" : "translateX(0)",
          }}
        />
        {/* Bottom Flap */}
        <div
          className={`absolute inset-x-0 bottom-0 h-1/2 ${colorTheme.flapBg} border-t ${colorTheme.flapBorder} origin-bottom transition-all duration-700`}
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 50% 45%)",
            transform: isOpening ? "translateY(15px) rotateX(-20deg)" : "translateY(0)",
          }}
        />
      </div>

      {/* Center Seal */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-500
          ${isOpening ? "scale-[1.3] opacity-0 rotate-180" : "scale-100 opacity-100"}
        `}
      >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-background border ${colorClass} ${colorTheme.glow} transition-all duration-300 group-hover:scale-105`}>
          <Lock className={`w-6 h-6 group-hover:scale-110 transition-transform duration-300 ${colorClass}`} />
        </div>
      </div>

      {/* Category / Icon Title (Top aligned) */}
      <div className={`absolute top-6 flex items-center gap-2 ${colorClass} z-10 transition-all duration-500 ${isOpening ? "-translate-y-6 opacity-0" : "opacity-90 group-hover:opacity-100"}`}>
        {icon}
        <span className="text-xs font-bold uppercase tracking-widest font-heading">{title}</span>
      </div>

      {/* Click and status labels (Bottom aligned) */}
      <div className={`absolute bottom-6 flex flex-col items-center gap-1 z-10 transition-all duration-500 ${isOpening ? "translate-y-6 opacity-0" : ""}`}>
        <p className={`text-[10px] font-mono tracking-widest ${isOpening ? colorClass : "text-muted-foreground/60 group-hover:text-muted-foreground/80"} transition-colors`}>
          {progressText}
        </p>
        <p className="text-xs font-bold text-foreground/80 uppercase tracking-widest group-hover:text-foreground transition-colors">
          Click to reveal
        </p>
      </div>

      {/* Cybernetic Decryption Screen Overlay */}
      {isOpening && (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-xl">
          {/* Sweeping laser scanner line */}
          <div className={`absolute inset-x-0 h-0.5 bg-gradient-to-r ${colorTheme.scanner} animate-scan`} />
          
          {/* Scanning progress display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-[2px] animate-fade-in">
            <div className={`text-[10px] font-mono ${colorClass} space-y-1 text-center scale-95`}>
              <div className="font-bold tracking-widest animate-pulse">DECRYPTING PAYLOAD</div>
              <div className="opacity-70 font-mono tracking-wider">{hexCode}</div>
              <div className="w-24 h-1 bg-secondary mx-auto mt-2 rounded-full overflow-hidden">
                <div className={`h-full ${colorTheme.line} animate-pulse-slow`} style={{ width: "80%" }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
