import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv
import openai
import logging
logging.basicConfig(level=logging.INFO)


HERE = Path(__file__).parent
load_dotenv(HERE / ".env")

openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise RuntimeError("Не найден OPENAI_API_KEY в файле .env")

app = FastAPI()

class AnnotationRequest(BaseModel):
    selectedText: str
    fullText:     str

class AnnotationResponse(BaseModel):
    annotation: str

@app.post("/api/annotate", response_model=AnnotationResponse)
async def annotate(req: AnnotationRequest):
    prompt = (
        "Ты — эксперт по интерпретации песен.\n"
        f"Фрагмент для аннотации:\n{req.selectedText}\n\n"
        "Дай короткую, но ёмкую аннотацию этого отрывка."
        )
    try:
        resp = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
            {"role": "system", "content": "Ты — эксперт по интерпретации песен."},
            {"role": "user",   "content": prompt},
            ],
            max_tokens=200,
            temperature=0.7,
        )
        return {"annotation": resp.choices[0].message.content.strip()}
    except Exception as e:
        logging.exception("💥 error in /api/annotate")
        raise HTTPException(status_code=500, detail=str(e))

frontend_dir = HERE / "frontend"
app.mount(
    "/",
    StaticFiles(directory=str(frontend_dir), html=True),
    name="frontend"
)

# uvicorn server:app --reload --host 0.0.0.0 --port 8000
