from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from payment import payment_router
from DB.main import create_db
from pipeline_route import pipeline_router
from third_party import third_party_route
# Create FastAPI app instance
app = FastAPI(
    title="Team FinForge API",
    description="Payment processing API with database",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
async def on_startup():
    create_db()

# Include routers
app.include_router(payment_router, prefix="/payment", tags=["Payment"])
app.include_router(pipeline_router, prefix="/AI_pipeline", tags=["AI"])
app.include_router(third_party_route, prefix="/third_party", tags=["API"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Team FinForge API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
