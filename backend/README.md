# WEAVE Backend

FastAPI backend for the WEAVE community coordination platform.

## Setup

### 1. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activate (Windows CMD)
.\venv\Scripts\activate.bat

# Activate (Mac/Linux)
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials (already done).

### 4. Run Development Server

```bash
# Make sure you're in the backend folder
cd backend

# Run the server
python main.py

# Or use uvicorn directly
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── main.py              # FastAPI app entry point
├── config.py            # Settings management
├── requirements.txt     # Python dependencies
├── models/
│   └── database.py      # Pydantic models
├── routers/
│   └── issues.py        # Issue endpoints
├── agents/              # AI agents (Phase 2)
└── utils/
    └── supabase_client.py  # Database connection
```

## Available Endpoints

### Health Check
- `GET /` - Basic health check
- `GET /health` - Detailed health check

### Issues
- `POST /api/issues` - Create new issue
- `GET /api/issues` - Get all issues
- `GET /api/issues/{id}` - Get single issue

## Next Steps

Phase 2 will add:
- Discovery Agent (issue analysis)
- Agent logging
- Background task processing
