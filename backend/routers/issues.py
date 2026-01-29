from fastapi import APIRouter, HTTPException, BackgroundTasks
from models.database import IssueCreate, IssueResponse
from utils.supabase_client import get_db
from agents.discovery_agent import analyze_issue
from agents.planning_agent import create_action_plan
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/issues", tags=["Issues"])


async def process_issue_with_agents(issue_id: str):
    """
    Background task to process issue through AI agents
    """
    try:
        # Phase 2: Discovery Agent
        print(f"🤖 Starting Discovery Agent for issue {issue_id}")
        discovery_result = await analyze_issue(issue_id)
        print(f"✅ Discovery Agent completed: {discovery_result.get('success', False)}")
        
        # Phase 3: Planning Agent (only if discovery succeeded)
        if discovery_result.get('success'):
            print(f"📋 Starting Planning Agent for issue {issue_id}")
            planning_result = await create_action_plan(issue_id)
            print(f"✅ Planning Agent completed: {planning_result.get('success', False)}")
        
        # Phase 4: Matching Agent (coming soon)
        
    except Exception as e:
        print(f"❌ Agent processing failed: {e}")


@router.post("", response_model=IssueResponse, status_code=201)
async def create_issue(issue: IssueCreate, background_tasks: BackgroundTasks):
    """
    Create a new community issue and trigger agent processing
    """
    try:
        db = get_db()
        
        # Prepare issue data
        issue_data = {
            "id": str(uuid.uuid4()),
            "title": issue.title,
            "description": issue.description,
            "category": issue.category,
            "location": issue.location,
            "images": issue.images or [],
            "status": "pending",
            "priority": 0.5,
            "created_at": datetime.utcnow().isoformat(),
            "metadata": {}
        }
        
        # Insert into database
        result = db.table("issues").insert(issue_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create issue")
        
        created_issue = result.data[0]
        
        # Trigger Discovery Agent in background
        background_tasks.add_task(process_issue_with_agents, created_issue["id"])
        
        return created_issue
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=list[IssueResponse])
async def get_issues(status: str = None, limit: int = 50):
    """
    Get all issues, optionally filtered by status
    """
    try:
        db = get_db()
        
        query = db.table("issues").select("*")
        
        if status:
            query = query.eq("status", status)
        
        query = query.order("created_at", desc=True).limit(limit)
        
        result = query.execute()
        
        return result.data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{issue_id}", response_model=IssueResponse)
async def get_issue(issue_id: str):
    """
    Get a single issue by ID
    """
    try:
        db = get_db()
        
        result = db.table("issues").select("*").eq("id", issue_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Issue not found")
        
        return result.data[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
