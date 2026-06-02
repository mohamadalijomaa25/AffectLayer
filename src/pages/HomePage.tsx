import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import IntroScreen from "@/components/IntroScreen";

const HomePage = () => {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}
      <HeroSection />
    </>
  );
};

export default HomePage;
