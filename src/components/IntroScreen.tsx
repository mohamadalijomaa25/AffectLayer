import { useEffect, useState } from "react";

const IntroScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"visible" | "fadeout">("visible");
  const [ready, setReady] = useState(false);

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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070b14] overflow-hidden transition-opacity duration-700 ease-in-out ${
        phase === "fadeout" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* ── Aurora blobs ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Violet blob – top-left drift */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-[120px]"
          style={{
            background: "hsl(255 70% 60%)",
            top: "-10%", left: "-10%",
            animation: "blobDrift1 12s ease-in-out infinite alternate",
          }}
        />
        {/* Cyan blob – bottom-right drift */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-25 blur-[110px]"
          style={{
            background: "hsl(190 80% 55%)",
            bottom: "-10%", right: "-8%",
            animation: "blobDrift2 14s ease-in-out infinite alternate",
          }}
        />
        {/* Pink blob – top-right drift */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-[100px]"
          style={{
            background: "hsl(330 70% 65%)",
            top: "5%", right: "5%",
            animation: "blobDrift3 10s ease-in-out infinite alternate",
          }}
        />
        {/* Blue blob – bottom-left drift */}
        <div
          className="absolute w-[350px] h-[350px] rounded-full opacity-20 blur-[90px]"
          style={{
            background: "hsl(217 80% 60%)",
            bottom: "5%", left: "5%",
            animation: "blobDrift1 16s ease-in-out infinite alternate-reverse",
          }}
        />
      </div>

      {/* ── Dot-grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, #070b14 100%)",
        }}
      />

      {/* ── Logo + rings ── */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="absolute w-64 h-64 rounded-full border border-violet/20 animate-spin" style={{ animationDuration: "6s" }} />
        <div className="absolute w-52 h-52 rounded-full border border-cyan/20 animate-spin" style={{ animationDuration: "10s", animationDirection: "reverse" }} />
        <div className="absolute w-44 h-44 rounded-full border border-pink/20 animate-ping" style={{ animationDuration: "2.2s" }} />
        <img
          src="/favicon.png"
          alt="AffectLayer"
          className="relative w-36 h-36 object-contain drop-shadow-2xl animate-[fadeInScale_0.6s_ease-out_forwards]"
        />
      </div>

      {/* ── Brand name ── */}
      <div className="relative z-10 mt-24 flex flex-col items-center gap-3 animate-[fadeUp_0.7s_ease-out_0.4s_both]">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-white">
          Affect<span className="gradient-text">Layer</span>
        </h1>
        <p className="text-sm text-white/40 tracking-[0.3em] uppercase">
          Hidden Emotion Detection
        </p>
      </div>

      {/* ── Enter button ── */}
      <div className={`relative z-10 mt-12 transition-all duration-500 ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <button
          onClick={handleEnter}
          className="group px-10 py-3.5 rounded-xl border border-violet/40 bg-violet/10 hover:bg-violet/20 text-white font-semibold text-sm tracking-widest uppercase transition-all duration-300 hover:border-violet/70 hover:shadow-[0_0_32px_rgba(139,92,246,0.4)] cursor-pointer"
        >
          <span className="gradient-text">Enter</span>
          <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform duration-200">→</span>
        </button>
      </div>

      {/* ── Keyframes injected via style tag ── */}
      <style>{`
        @keyframes blobDrift1 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(60px, 40px) scale(1.1); }
          100% { transform: translate(-40px, 70px) scale(0.95); }
        }
        @keyframes blobDrift2 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(-50px, -60px) scale(1.15); }
          100% { transform: translate(70px, -30px) scale(0.9); }
        }
        @keyframes blobDrift3 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(-30px, 50px) scale(1.08); }
          100% { transform: translate(40px, 20px) scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default IntroScreen;
