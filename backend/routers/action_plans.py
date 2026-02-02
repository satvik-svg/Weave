from fastapi import APIRouter, HTTPException
from utils.supabase_client import get_db

router = APIRouter(prefix="/api/action-plans", tags=["Action Plans"])


@router.get("")
async def get_action_plans(status: str = None, limit: int = 50):
    """
    Get all action plans, optionally filtered by status
    """
    try:
        db = get_db()
        
        query = db.table("action_plans").select("*, issues(title, category, location)")
        
        if status:
            query = query.eq("status", status)
        
        query = query.order("created_at", desc=True).limit(limit)
        
        result = query.execute()
        
        return {
            "action_plans": result.data,
            "count": len(result.data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{plan_id}")
async def get_action_plan(plan_id: str):
    """
    Get a single action plan with all tasks
    """
    try:
        db = get_db()
        
        # Get plan
        plan_result = db.table("action_plans").select("*, issues(*)").eq("id", plan_id).execute()
        
        if not plan_result.data:
            raise HTTPException(status_code=404, detail="Action plan not found")
        
        plan = plan_result.data[0]
        
        # Get tasks
        tasks_result = db.table("tasks").select("*").eq("action_plan_id", plan_id).order("priority").execute()
        
        return {
            "action_plan": plan,
            "tasks": tasks_result.data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{plan_id}/tasks")
async def get_plan_tasks(plan_id: str):
    """
    Get all tasks for an action plan WITH assigned volunteers
    """
    try:
        db = get_db()
        
        # Get tasks first
        tasks_result = db.table("tasks").select("*").eq("action_plan_id", plan_id).order("priority").execute()
        
        tasks_with_volunteers = []
        for task in tasks_result.data:
            task_data = {**task}
            
            # Manually fetch assignments for this task with volunteer details
            assignments_result = db.table("task_assignments").select(
                "id, volunteer_id, status, assigned_at, started_at, completed_at, notes, volunteers(id, name, email, reliability_score)"
            ).eq("task_id", task['id']).execute()
            
            # Transform assignments
            task_data['assigned_volunteers'] = [
                {
                    'assignment_id': a['id'],
                    'status': a['status'],
                    'assigned_at': a.get('assigned_at'),
                    'started_at': a.get('started_at'),
                    'completed_at': a.get('completed_at'),
                    'notes': a.get('notes'),
                    'volunteer': a.get('volunteers')
                }
                for a in assignments_result.data if a.get('volunteers')
            ]
            task_data['assigned_count'] = len(task_data['assigned_volunteers'])
            tasks_with_volunteers.append(task_data)
        
        return {
            "tasks": tasks_with_volunteers,
            "count": len(tasks_with_volunteers)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
