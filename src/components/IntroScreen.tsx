import { useEffect, useState } from "react";

const IntroScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"visible" | "fadeout">("visible");
  const [ready, setReady] = useState(false);

  // Show the "Enter" button after animations settle
  useEffect(() => {
    const readyTimer = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(readyTimer);
  }, []);

  const handleEnter = () => {
    setPhase("fadeout");
    setTimeout(() => onComplete(), 700);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-700 ease-in-out ${
        phase === "fadeout" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Radial glow behind logo */}
      <div className="absolute w-96 h-96 rounded-full bg-violet/10 blur-3xl animate-pulse" />
      <div className="absolute w-72 h-72 rounded-full bg-cyan/10 blur-2xl animate-pulse delay-300" />

      {/* Logo + ring animation */}
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <div className="absolute w-64 h-64 rounded-full border border-violet/20 animate-spin" style={{ animationDuration: "6s" }} />
        {/* Middle counter-rotating ring */}
        <div className="absolute w-52 h-52 rounded-full border border-cyan/20 animate-spin" style={{ animationDuration: "10s", animationDirection: "reverse" }} />
        {/* Inner pulsing ring */}
        <div className="absolute w-44 h-44 rounded-full border border-pink/20 animate-ping" style={{ animationDuration: "2.2s" }} />

        {/* Favicon */}
        <img
          src="/favicon.png"
          alt="AffectLayer"
          className="relative w-36 h-36 object-contain drop-shadow-2xl animate-[fadeInScale_0.6s_ease-out_forwards]"
        />
      </div>

      {/* Brand name */}
      <div className="mt-24 flex flex-col items-center gap-3 animate-[fadeUp_0.7s_ease-out_0.4s_both]">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
          Affect<span className="gradient-text">Layer</span>
        </h1>
        <p className="text-sm text-muted-foreground tracking-[0.3em] uppercase">
          Hidden Emotion Detection
        </p>
      </div>

      {/* Click-to-Enter button */}
      <div
        className={`mt-12 transition-all duration-500 ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <button
          onClick={handleEnter}
          className="group relative px-10 py-3.5 rounded-xl border border-violet/40 bg-violet/10 hover:bg-violet/20 text-foreground font-semibold text-sm tracking-widest uppercase transition-all duration-300 hover:border-violet/70 hover:shadow-[0_0_24px_rgba(139,92,246,0.3)] cursor-pointer"
        >
          <span className="gradient-text">Enter</span>
          <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform duration-200">→</span>
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;
