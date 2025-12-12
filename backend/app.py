from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from database import SessionLocal, engine, Base
from utils import generate_code

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

BASE_URL = "http://localhost:8000"

@app.post("/v1/urls/shorten", response_model=schemas.URLInfo)
def shorten_url(url_create: schemas.URLCreate, db: Session = Depends(get_db)):
    existing_url = db.query(models.URL).filter(models.URL.original_url == url_create.original_url).first()
    if existing_url:
        return existing_url

    short_code = generate_code()
    new_url = models.URL(
        original_url=url_create.original_url,
        short_code=short_code
    )
    db.add(new_url)
    db.commit()
    db.refresh(new_url)
    return new_url

@app.get("/v1/urls/{short_code}")
def redirect_to_original(short_code: str, db: Session = Depends(get_db)):
    url_entry = db.query(models.URL).filter(models.URL.short_code == short_code).first()
    if not url_entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="URL not found")

    url_entry.access_count += 1
    db.commit()
    return RedirectResponse(url=url_entry.original_url)
