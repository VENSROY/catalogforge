from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    SUPABASE_STORAGE_BUCKET: str = "catalogforge-images"
    API_SECRET: str
    
    class Config:
        env_file = ".env"

settings = Settings()