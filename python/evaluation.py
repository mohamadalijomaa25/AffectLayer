from classical_analyzer import classical_analyze
from ml_analyzer import MLAnalyzer
from tabulate import tabulate

test_sentences = [
    ("Haha don't worry about me, I'll survive.", "Sadness", "Humor Masking"),
    ("It's okay, I know I'm not anyone's first choice.", "Hurt", "Minimization"),
    ("Thanks for the last-minute update, really appreciate it.", "Frustration", "Passive Aggression"),
    ("I'm good, just exhausted in every possible way.", "Distress", "Emotional Suppression"),
    ("Sure, I'd love to do everyone else's work again.", "Anger", "Sarcasm Masking"),
    ("No worries, I'm used to being forgotten.", "Loneliness", "Minimization"),
    ("Wow, great - another meeting that could've been an email.", "Frustration", "Sarcasm Masking"),
    ("It's fine, I didn't really want to go anyway.", "Hurt", "Minimization"),
    ("I'm totally fine with being the last to know, as always.", "Resentment", "Passive Aggression"),
    ("Haha yeah, story of my life - nobody listens.", "Sadness", "Humor Masking"),
    ("Don't mind me, I'll just figure it out alone like I always do.", "Overwhelm", "Emotional Suppression"),
    ("Oh, no it's completely fine that you cancelled last minute.", "Anger", "Passive Aggression"),
    ("Lol yeah I'm great, just haven't slept in three days.", "Anxiety", "Humor Masking"),
    ("I guess I just need to accept that things are this way.", "Hopelessness", "Emotional Suppression"),
    ("It's not a big deal, I can handle everything on my own.", "Distress", "Minimization"),
]

def run_evaluation():
    print("Initializing models...")
    ml_analyzer = MLAnalyzer()
    
    print("\nStarting evaluation of 15 samples...\n")
    
    results_table = []
    classical_correct_masking = 0
    ml_correct_masking = 0
    
    for text, true_emotion, true_masking in test_sentences:
        classical_res = classical_analyze(text)
        ml_res = ml_analyzer.ml_analyze(text)
        
        # We consider marking the masking style correct if it matches the general category
        if classical_res['masking'] == true_masking:
            classical_correct_masking += 1
        if ml_res['masking'] == true_masking:
            ml_correct_masking += 1
            
        results_table.append([
            text[:30] + "...",
            true_masking,
            classical_res['masking'],
            ml_res['masking'],
        ])
    
    print(tabulate(results_table, headers=["Text Snippet", "True Masking", "Classical Pred", "ML Pred"], tablefmt="grid"))
    
    print("\n=== AffectLayer Evaluation Results ===")
    print(f"Classical Engine (VADER + Rules) Correct Masking: {classical_correct_masking}/15 ({(classical_correct_masking/15)*100:.1f}%)")
    print(f"ML Engine (DistilBERT SST-2) Correct Masking:     {ml_correct_masking}/15 ({(ml_correct_masking/15)*100:.1f}%)")
    
    print("\nNote: ML model (DistilBERT tuned on SST-2) often struggles with sarcasm and passive aggression")
    print("      unless supplemented with complex heuristics, representing the research gap addressed by this platform.")

if __name__ == "__main__":
    run_evaluation()
