import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Bloom Maternal Health"
    PROJECT_VERSION: str = "1.0.0"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-for-fyp")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week

settings = Settings()
