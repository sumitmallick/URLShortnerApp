from pydantic import BaseModel

class URLCreate(BaseModel):
    original_url: str

class URLInfo(BaseModel):
    id: int
    original_url: str
    short_code: str
    created_at: str
    access_count: int

    class Config:
        orm_mode = True
