import { useState, useCallback } from "react";
import Analyzer from "@/components/Analyzer";
import ExampleSamples from "@/components/ExampleSamples";
import VisualizationPanel from "@/components/VisualizationPanel";
import type { AnalysisResult } from "@/lib/analyzer";

const AnalyzerPage = () => {
  const [exampleText, setExampleText] = useState("");
  const [latestResult, setLatestResult] = useState<AnalysisResult | null>(null);

  const handleExampleSelect = useCallback((text: string) => {
    setExampleText(text);
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-16">
      <Analyzer
        exampleText={exampleText}
        onExampleConsumed={() => setExampleText("")}
        onResultChange={setLatestResult}
      />
      <ExampleSamples onSelect={handleExampleSelect} />
      <VisualizationPanel latestResult={latestResult} />
    </div>
  );
};

export default AnalyzerPage;
