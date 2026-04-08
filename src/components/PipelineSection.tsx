import { FileText, BarChart3, Search, Brain, Heart, Layers, MessageSquare } from "lucide-react";

const steps = [
  { icon: FileText, title: "Text Preprocessing", desc: "Tokenization, normalization, and noise removal to prepare raw input for analysis.", titleAr: "معالجة النص الأساسية", descAr: "تجزئة النص وتسويته وإزالة الضوضاء لإعداد المدخلات الأولية للتحليل." },
  { icon: BarChart3, title: "Surface Tone Detection", desc: "Classify the explicit emotional tone using sentiment and affect lexicons.", titleAr: "اكتشاف النبرة السطحية", descAr: "تصنيف النبرة العاطفية الصريحة باستخدام قواميس المشاعر." },
  { icon: Search, title: "Sarcasm / Irony Cue Detection", desc: "Identify linguistic markers of irony, sarcasm, and incongruent pragmatic signals.", titleAr: "اكتشاف أدلة السخرية", descAr: "تحديد العلامات اللغوية للسخرية والإشارات التداولية غير المتطابقة." },
  { icon: Brain, title: "Contextual Embedding Extraction", desc: "Generate deep contextual representations using transformer-based language models.", titleAr: "استخراج التضمين السياقي", descAr: "توليد تمثيلات سياقية عميقة باستخدام نماذج اللغة الحديثة." },
  { icon: Heart, title: "Hidden Emotion Classification", desc: "Predict the latent emotional state beneath the surface-level expression.", titleAr: "تصنيف العاطفة الكامنة", descAr: "التنبؤ بالحالة العاطفية الخفية تحت التعبير السطحي." },
  { icon: Layers, title: "Masking Style Prediction", desc: "Classify the emotional masking strategy employed by the speaker.", titleAr: "التنبؤ بأسلوب الإخفاء", descAr: "تصنيف استراتيجية الإخفاء العاطفي التي استخدمها المتحدث." },
  { icon: MessageSquare, title: "Explainable Rationale Generation", desc: "Produce human-readable explanations highlighting key linguistic evidence.", titleAr: "توليد التفسير المنطقي", descAr: "إنتاج تفسيرات مقروءة للبشر تسلط الضوء على الأدلة اللغوية الرئيسية." },
];

const PipelineSection = () => {
  return (
    <section id="pipeline" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="section-title">NLP <span className="gradient-text">Pipeline</span></h2>
          <p className="section-subtitle mx-auto">A multi-stage architecture representing a Tri-Engine benchmarking approach for emotional masking detection.</p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-violet via-cyan to-pink opacity-30" />

          <div className="space-y-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative flex gap-5 md:gap-6 group">
                  <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0 group-hover:border-violet/40 transition-colors">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-violet transition-colors" />
                  </div>
                  <div className="glass-card-hover p-4 md:p-5 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground/50 font-mono">0{i + 1}</span>
                      <h3 className="font-heading font-semibold text-foreground text-sm md:text-base">{step.title}</h3>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-3">{step.desc}</p>
                    
                    {/* Arabic Translation Layer */}
                    <div className="pt-3 border-t border-border/50 text-right" dir="rtl">
                      <h3 className="font-heading font-semibold text-foreground/90 text-xs md:text-sm mb-1">{step.titleAr}</h3>
                      <p className="text-xs text-muted-foreground/80 leading-relaxed">{step.descAr}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;
