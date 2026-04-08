from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

def classical_analyze(text):
    """
    Classical rule-based lexicon approach using VADER sentiment analyzer 
    and custom heuristic rules for emotional masking.
    """
    analyzer = SentimentIntensityAnalyzer()
    scores = analyzer.polarity_scores(text)
    
    text_lower = text.lower()
    
    # Custom Masking Patterns (same logic as JS version)
    sarcasm_markers = ["sure", "totally", "clearly", "obviously", "wow", "great", "thanks so much"]
    minimizers = ["it's fine", "i'm fine", "no worries", "i'm okay", "not a big deal", "never mind"]
    humor = ["haha", "lol", "lmao", "just kidding", "kidding", "i'll survive"]
    passive = ["thanks for", "appreciate it", "everyone else", "once again", "as usual", "last minute"]
    
    # Check for presence of masking cues
    has_sarcasm = any(marker in text_lower for marker in sarcasm_markers)
    has_minimization = any(marker in text_lower for marker in minimizers)
    has_humor = any(marker in text_lower for marker in humor)
    has_passive = any(marker in text_lower for marker in passive)
    
    masking_style = "None Detected"
    if has_passive:
        masking_style = "Passive Aggression"
    elif has_humor:
        masking_style = "Humor Masking"
    elif has_minimization:
        masking_style = "Minimization"
    elif has_sarcasm:
        masking_style = "Sarcasm Masking"
        
    hidden_emotion = "Neutral"
    if masking_style != "None Detected":
        if masking_style == "Passive Aggression":
            hidden_emotion = "Frustration"
        elif masking_style == "Humor Masking":
            hidden_emotion = "Sadness"
        elif masking_style == "Minimization":
            hidden_emotion = "Hurt"
        elif masking_style == "Sarcasm Masking":
            hidden_emotion = "Anger"
    
    surface = "Neutral"
    if scores['compound'] > 0.05:
        surface = "Positive"
    elif scores['compound'] < -0.05:
        surface = "Negative"

    return {
        "surface": surface,
        "hidden": hidden_emotion,
        "masking": masking_style,
        "sentiment_score": scores['compound']
    }

if __name__ == "__main__":
    test_phrase = "I'm totally fine with being the last to know, as always."
    print("Test Phrase:", test_phrase)
    print("Result:", classical_analyze(test_phrase))
