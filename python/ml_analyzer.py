from transformers import pipeline

class MLAnalyzer:
    def __init__(self):
        # Load DistilBERT model fine-tuned on SST-2 (same as the JS version)
        self.sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

    def ml_analyze(self, text):
        """
        Contemporary ML approach using pre-trained DistilBERT model.
        """
        result = self.sentiment_pipeline(text)[0]
        label = result['label']
        score = result['score']
        
        # Heuristics derived from raw text (mimicking the JS behavior)
        text_lower = text.lower()
        passive = ["thanks for", "appreciate it", "everyone else", "once again", "as usual", "last minute"]
        humor = ["haha", "lol", "lmao", "i'll survive", "could be worse"]
        minimizers = ["it's fine", "i'm fine", "no worries", "not a big deal", "never mind"]
        suppression = ["i'm used to", "always like this", "story of my life"]
        
        masking_label = "None Detected"
        if any(p in text_lower for p in passive):
            masking_label = "Passive Aggression"
        elif any(h in text_lower for h in humor):
            masking_label = "Humor Masking"
        elif any(m in text_lower for m in minimizers):
            masking_label = "Minimization"
        elif any(s in text_lower for s in suppression):
            masking_label = "Emotional Suppression"

        mismatch = masking_label != "None Detected" and label == "POSITIVE"
        
        hidden_emotion = "Neutral"
        if mismatch:
            if masking_label == "Passive Aggression":
                hidden_emotion = "Frustration"
            elif masking_label == "Humor Masking":
                hidden_emotion = "Sadness"
            elif masking_label == "Minimization":
                hidden_emotion = "Hurt"
            else:
                hidden_emotion = "Anxiety"
        elif label == "NEGATIVE":
            hidden_emotion = "Distress / Sadness"
            
        surface_label = "Humorous / Cheerful" if label == "POSITIVE" and score > 0.85 else "Polite / Positive" if label == "POSITIVE" else "Negative / Distressed"

        return {
            "surface": surface_label,
            "hidden": hidden_emotion,
            "masking": masking_label,
            "confidence": round(score * 100)
        }

if __name__ == "__main__":
    analyzer = MLAnalyzer()
    test_phrase = "I'm totally fine with being the last to know, as always."
    print("Test Phrase:", test_phrase)
    print("Result:", analyzer.ml_analyze(test_phrase))
