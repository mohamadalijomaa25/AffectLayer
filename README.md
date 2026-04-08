# AffectLayer: Hidden Emotion Detection in Masked Text

AffectLayer is a dual-stack NLP platform that identifies hidden emotional distress concealed beneath explicitly polite or neutral surface language (emotional masking). 

Rather than relying on a single AI approach, AffectLayer implements a **Tri-Engine Benchmarking Architecture**. It allows users to process the exact same text concurrently using three distinct generations of NLP technologies, visualizing the strengths and limitations of each in real-time.

## The Tri-Engine Architecture

1. **Classical NLP (VADER):** A deterministic, rule-based lexicon running in the Python backend. Extremely fast, but lacks contextual understanding (often failing to detect sarcasm).
2. **Machine Learning (DistilBERT):** A Transformer-based neural network fine-tuned on SST-2. This engine is completely offloaded to the **Hugging Face Serverless API**, allowing complex inference without crashing the backend memory.
3. **Generative AI (Gemini 2.5):** A zero-shot prompt-engineered LLM utilizing the Google API directly from the client. It provides profound clinical reasoning and translates the explanation into Arabic dynamically.

## Tech Stack

### Frontend
- React.js & TypeScript
- Vite scaffolding
- Tailwind CSS (Zero external heavy CSS frameworks)
- Hosted on Render (Static Site)

### Backend
- Python 3
- FastAPI & Uvicorn
- Stateless API architecture
- Hosted on Render (Web Service Free Tier)

## How to Run the Project Locally

To run this project on your local machine, you will need to open **two separate terminal windows** (one for the frontend, one for the backend).

### 1. Start the React Frontend
Open your first terminal and run:
```bash
# Install Node dependencies
npm install

# Start the local development server
npm run dev
```

### 2. Start the Python Backend API
Open your second terminal and run:
```bash
# Navigate to the backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload
```

## Security & Environment Variables
In order for the Machine Learning and LLM engines to work securely, you must have the following environment variables configured:
* `VITE_BACKEND_URL` (in the root `.env`) pointing to `http://127.0.0.1:8000` locally.
* `HF_TOKEN` (in the backend `.env`) containing your Hugging Face API key.

## Dataset & Evaluation
The evaluation phase of this architecture utilizes a curated collection of 15 clinically masked statements built directly into the UI. These statements represent a wide range of coping mechanisms, including passive-aggression, sarcasm, and emotional minimization, allowing instant manual benchmarking of all three engines against proven control phrases.
