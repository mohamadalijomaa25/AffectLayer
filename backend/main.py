from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

# Add the existing python directory to sys.path so we can import our scripts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'python')))

try:
    from classical_analyzer import classical_analyze
    from ml_analyzer import MLAnalyzer
except ImportError as e:
    print(f"Error importing analyzers: {e}")
    # Provide dummy for development if imports fail
    def classical_analyze(text): return {}
    class MLAnalyzer:
        def ml_analyze(self, text): return {}


app = FastAPI(title="AffectLayer NLP Backend")

# Allow the frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production we should set to the Render URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML model when server starts
ml_analyzer = MLAnalyzer()

class AnalyzeRequest(BaseModel):
    text: str
    engine: str # 'classical' or 'ml'

@app.post("/api/analyze")
def analyze_endpoint(req: AnalyzeRequest):
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    try:
        if req.engine == "classical":
            result = classical_analyze(text)
            
            # Map Python dict to the JS AnalysisResult structure
            return {
                "surfaceEmotion": {
                    "label": result["surface"],
                    "confidence": 75, # Default since classical doesn't give a pure %
                    "explanation": f"Surface tone detected as '{result['surface']}' based on VADER compound score ({result['sentiment_score']:.2f})."
                },
                "hiddenEmotion": {
                    "label": result["hidden"],
                    "confidence": 65,
                    "icon": "😶" if result["hidden"] == "Neutral" else "😤" if result["hidden"] == "Frustration" else "😢" if result["hidden"] == "Sadness" else "💔" if result["hidden"] == "Hurt" else "😰"
                },
                "maskingStyle": {
                    "label": result["masking"],
                    "confidence": 70 if result["masking"] != "None Detected" else 30,
                    "definition": "Detected via classical heuristic rules."
                },
                "explanation": "Result computed using classical rule-based lexicon. No ML model inference used.",
                "cues": [],
                "overallConfidence": 70,
                "maskingLikelihood": 70 if result["masking"] != "None Detected" else 20,
                "ambiguityScore": 50,
                "mismatchScore": 60 if result["masking"] != "None Detected" else 20
            }
            
        elif req.engine == "ml":
            result = ml_analyzer.ml_analyze(text)
            
            # Map Python dict to JS AnalysisResult structure
            return {
                "surfaceEmotion": {
                    "label": result["surface"],
                    "confidence": result["confidence"],
                    "explanation": f"DistilBERT classified surface as {result['surface']} with {result['confidence']}% confidence."
                },
                "hiddenEmotion": {
                    "label": result["hidden"],
                    "confidence": 72 if result["hidden"] != "Neutral" else 40,
                    "icon": "😶" if result["hidden"] == "Neutral" else "😤" if result["hidden"] == "Frustration" else "😢" if result["hidden"] in ["Sadness", "Distress / Sadness"] else "💔" if result["hidden"] == "Hurt" else "😰"
                },
                "maskingStyle": {
                    "label": result["masking"],
                    "confidence": 80 if result["masking"] != "None Detected" else 25,
                    "definition": "Detected using passive/minimizer/suppression context evaluation."
                },
                "explanation": f"DistilBERT (SST-2) classified the surface as {result['surface']} ({result['confidence']}% conf). Latent mismatch checked against context rules.",
                "cues": [],
                "overallConfidence": round((result["confidence"] + 80 + 72)/3),
                "maskingLikelihood": 80 if result["masking"] != "None Detected" else 20,
                "ambiguityScore": 35,
                "mismatchScore": 75 if result["masking"] != "None Detected" else 25
            }
            
        else:
            raise HTTPException(status_code=400, detail="Invalid engine type")
            
    except Exception as e:
        print(f"Error analyzing text: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running!"}
