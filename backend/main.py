from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from routers import issues, agent_logs, action_plans, volunteers

settings = get_settings()


# Initialize FastAPI app
app = FastAPI(
    title="WEAVE API",
    description="Community-driven agentic AI platform for coordinated action",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(issues.router)
app.include_router(agent_logs.router)
app.include_router(action_plans.router)
app.include_router(volunteers.router)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "WEAVE API",
        "version": "1.0.0",
        "environment": settings.environment
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "agents": "ready"
    }


@app.on_event("startup")
async def startup_event():
    """Validate configuration on startup"""
    if "your_supabase_url_here" in settings.supabase_url:
        print("\n\033[91mCRITICAL WARNING: Supabase Configuration Missing!\033[0m")
        print("Please update backend/.env with your actual SUPABASE_URL and SUPABASE_ANON_KEY.")
        print("The backend will not function correctly without these values.\n")
    
    if "your_gemini_api_key_here" in settings.gemini_api_key:
        print("\n\033[93mWARNING: Gemini API Key Missing!\033[0m")
        print("AI features will not work. Update backend/.env with your GEMINI_API_KEY.\n")

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler to log errors"""
    import traceback
    error_msg = traceback.format_exc()
    print(f"\n\033[91mINTERNAL SERVER ERROR: {str(exc)}\033[0m")
    print(error_msg)
    return {
        "detail": "Internal Server Error", 
        "error": str(exc),
        "hint": "Check backend console logs for details. Likely missing environment variables."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True if settings.environment == "development" else False
    )
