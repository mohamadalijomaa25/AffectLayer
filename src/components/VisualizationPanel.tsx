import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import type { AnalysisResult } from "@/lib/analyzer";

// Default static data shown before any analysis is run
const defaultRadarData = [
  { subject: "Sadness", value: 84 },
  { subject: "Frustration", value: 74 },
  { subject: "Hurt", value: 68 },
  { subject: "Distress", value: 79 },
  { subject: "Anger", value: 52 },
  { subject: "Loneliness", value: 71 },
  { subject: "Anxiety", value: 60 },
];

const defaultBarData = [
  { name: "Surface: Neutral", value: 82, color: "hsl(190, 80%, 55%)" },
  { name: "Hidden: Frustration", value: 74, color: "hsl(330, 70%, 65%)" },
  { name: "Masking: P.A.", value: 68, color: "hsl(255, 70%, 65%)" },
  { name: "Mismatch", value: 79, color: "hsl(217, 80%, 60%)" },
];

interface Props {
  latestResult?: AnalysisResult | null;
}

const VisualizationPanel = ({ latestResult }: Props) => {
  // When a live result exists, derive data from it; otherwise fall back to default
  const radarData = latestResult
    ? [
        { subject: "Surface", value: latestResult.surfaceEmotion.confidence },
        { subject: "Hidden", value: latestResult.hiddenEmotion.confidence },
        { subject: "Masking", value: latestResult.maskingStyle.confidence },
        { subject: "Overall", value: latestResult.overallConfidence },
        { subject: "Mismatch", value: latestResult.mismatchScore },
        { subject: "Ambiguity", value: latestResult.ambiguityScore },
        { subject: "Likelihood", value: latestResult.maskingLikelihood },
      ]
    : defaultRadarData;

  const barData = latestResult
    ? [
        { name: `Surface: ${latestResult.surfaceEmotion.label}`, value: latestResult.surfaceEmotion.confidence, color: "hsl(190, 80%, 55%)" },
        { name: `Hidden: ${latestResult.hiddenEmotion.label}`, value: latestResult.hiddenEmotion.confidence, color: "hsl(330, 70%, 65%)" },
        { name: `Masking: ${latestResult.maskingStyle.label.split(" ")[0]}`, value: latestResult.maskingStyle.confidence, color: "hsl(255, 70%, 65%)" },
        { name: "Mismatch Score", value: latestResult.mismatchScore, color: "hsl(217, 80%, 60%)" },
      ]
    : defaultBarData;

  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="section-title">Emotion <span className="gradient-text">Visualizations</span></h2>
          <p className="section-subtitle mx-auto">
            {latestResult
              ? "Live charts generated from your most recent analysis."
              : "Visual representations of a sample emotional analysis profile. Run the analyzer above to see your own results."}
          </p>
        </div>

        {latestResult && (
          <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg bg-cyan/5 border border-cyan/20 w-fit mx-auto">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <p className="text-xs text-cyan font-medium">Showing live results from your last analysis</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Radar */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-heading font-semibold text-foreground text-sm">
              {latestResult ? "Live Emotion Profile" : "Hidden Emotion Profile"}
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Radar dataKey="value" stroke="hsl(255, 70%, 65%)" fill="hsl(255, 70%, 65%)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-heading font-semibold text-foreground text-sm">
              {latestResult ? "Confidence by Category" : "Sample Confidence Distribution"}
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={110} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualizationPanel;
