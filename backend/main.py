from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Bloom Maternal Health API",
    description="Smart advisory system for expectant mothers in Ghana.",
    version="1.0.0"
)

# Configure CORS for React Native/Expo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Bloom Maternal Health API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
