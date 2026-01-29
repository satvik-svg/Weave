from fastapi import APIRouter, HTTPException
from utils.supabase_client import get_db

router = APIRouter(prefix="/api/agent-logs", tags=["Agent Logs"])


@router.get("")
async def get_agent_logs(limit: int = 50, agent_type: str = None):
    """
    Get agent execution logs for observability
    """
    try:
        db = get_db()
        
        query = db.table("agent_logs").select("*")
        
        if agent_type:
            query = query.eq("agent_type", agent_type)
        
        query = query.order("created_at", desc=True).limit(limit)
        
        result = query.execute()
        
        return {
            "logs": result.data,
            "count": len(result.data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/session/{session_id}")
async def get_session_logs(session_id: str):
    """
    Get all logs for a specific agent session
    """
    try:
        db = get_db()
        
        result = db.table("agent_logs").select("*").eq("session_id", session_id).order("created_at").execute()
        
        return {
            "session_id": session_id,
            "logs": result.data,
            "count": len(result.data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
