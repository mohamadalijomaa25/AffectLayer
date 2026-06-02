import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Analyzer from "@/components/Analyzer";
import ExampleSamples from "@/components/ExampleSamples";
import PipelineSection from "@/components/PipelineSection";
import ArchitectureEngines from "@/components/ArchitectureEngines";
import ResearchContribution from "@/components/ResearchContribution";
import VisualizationPanel from "@/components/VisualizationPanel";
import UseCases from "@/components/UseCases";
import EthicsSection from "@/components/EthicsSection";
import DatasetModel from "@/components/DatasetModel";
import AboutProject from "@/components/AboutProject";
import FooterSection from "@/components/FooterSection";
import IntroScreen from "@/components/IntroScreen";
import type { AnalysisResult } from "@/lib/analyzer";
import { ThemeProvider } from "@/components/theme-provider";

const Index = () => {
  const [exampleText, setExampleText] = useState("");
  const [latestResult, setLatestResult] = useState<AnalysisResult | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  const handleExampleSelect = useCallback((text: string) => {
    setExampleText(text);
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="affectlayer-theme">
      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <HeroSection />
        <Analyzer
          exampleText={exampleText}
          onExampleConsumed={() => setExampleText("")}
          onResultChange={setLatestResult}
        />
        <ExampleSamples onSelect={handleExampleSelect} />
        <PipelineSection />
        <ArchitectureEngines />
        <ResearchContribution />
        <VisualizationPanel latestResult={latestResult} />
        <UseCases />
        <EthicsSection />
        <DatasetModel />
        <AboutProject />
        <FooterSection />
      </div>
    </ThemeProvider>
  );
};

export default Index;
