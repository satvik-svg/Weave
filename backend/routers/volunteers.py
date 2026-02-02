"""
Volunteers and Task Assignments Router
Endpoints for viewing volunteers and their task assignments
"""

from fastapi import APIRouter, HTTPException
from utils.supabase_client import get_db
from typing import Optional

router = APIRouter(prefix="/api/volunteers", tags=["volunteers"])


@router.get("")
async def get_volunteers(
    limit: int = 50,
    skills: Optional[str] = None,
    available: Optional[bool] = None
):
    """
    Get list of volunteers
    Optional filters: skills (comma-separated), available
    """
    try:
        db = get_db()
        query = db.table("volunteers").select("*")
        
        # Apply filters if provided
        # Note: Advanced filtering would require database functions
        
        query = query.limit(limit)
        result = query.execute()
        
        return {
            "volunteers": result.data,
            "count": len(result.data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{volunteer_id}")
async def get_volunteer(volunteer_id: str):
    """Get specific volunteer by ID"""
    try:
        db = get_db()
        result = db.table("volunteers").select("*").eq("id", volunteer_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Volunteer not found")
        
        # Get volunteer's task assignments
        assignments = db.table("task_assignments").select(
            "*, tasks(*, action_plans(*, issues(*)))"
        ).eq("volunteer_id", volunteer_id).execute()
        
        volunteer = result.data[0]
        volunteer['assignments'] = assignments.data
        
        return volunteer
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{volunteer_id}/assignments")
async def get_volunteer_assignments(volunteer_id: str, status: Optional[str] = None):
    """Get all task assignments for a volunteer"""
    try:
        db = get_db()
        query = db.table("task_assignments").select(
            "*, tasks(*, action_plans(*, issues(*)))"
        ).eq("volunteer_id", volunteer_id)
        
        if status:
            query = query.eq("status", status)
        
        result = query.execute()
        
        return {
            "volunteer_id": volunteer_id,
            "assignments": result.data,
            "count": len(result.data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tasks/{task_id}/assignments")
async def get_task_assignments(task_id: str):
    """Get all volunteers assigned to a specific task"""
    try:
        db = get_db()
        result = db.table("task_assignments").select(
            "*, volunteers(*)"
        ).eq("task_id", task_id).execute()
        
        return {
            "task_id": task_id,
            "assignments": result.data,
            "count": len(result.data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tasks/{task_id}/assign/{volunteer_id}")
async def manually_assign_volunteer(task_id: str, volunteer_id: str):
    """Manually assign a volunteer to a task"""
    try:
        import uuid
        from datetime import datetime
        
        db = get_db()
        
        # Verify task and volunteer exist
        task = db.table("tasks").select("*").eq("id", task_id).execute()
        if not task.data:
            raise HTTPException(status_code=404, detail="Task not found")
        
        volunteer = db.table("volunteers").select("*").eq("id", volunteer_id).execute()
        if not volunteer.data:
            raise HTTPException(status_code=404, detail="Volunteer not found")
        
        # Create assignment
        assignment = {
            "id": str(uuid.uuid4()),
            "task_id": task_id,
            "volunteer_id": volunteer_id,
            "status": "assigned",
            "assigned_at": datetime.utcnow().isoformat(),
            "metadata": {
                "assignment_type": "manual"
            }
        }
        
        result = db.table("task_assignments").insert(assignment).execute()
        
        return {
            "success": True,
            "assignment": result.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
