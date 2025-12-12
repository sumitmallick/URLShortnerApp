from sqlalchemy import Column, Integer, String
from .database import Base
from datetime import datetime

class URL(Base):
    __tablename__ = "urls"

    id = Column(Integer, primary_key=True, index=True)
    original_url = Column(String, unique=True, index=True, nullable=False)
    short_code = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(String, default=datetime.utcnow().isoformat(), nullable=False)
    access_count = Column(Integer, default=0, nullable=False)
