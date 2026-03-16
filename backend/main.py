from app.routers import auth, health, user

app = FastAPI(
    title="BLOOM - Smart Maternal Health App",
    description="Smart advisory system for expectant mothers in Ghana.",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(health.router, prefix="/api/v1")
app.include_router(user.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to the Bloom Maternal Health API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
