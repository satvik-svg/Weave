"""
Planning Agent - Converts validated issues into actionable task plans

This agent:
1. Takes a validated issue from Discovery Agent
2. Breaks it down into specific, executable tasks
3. Determines task dependencies and order
4. Estimates resources and timeline for each task
5. Creates an action plan in the database
"""

from utils.gemini_client import call_gemini
from utils.supabase_client import get_db
from datetime import datetime
import uuid
import re


PLANNING_PROMPT = """You are an expert community organizer and project planner. Create a detailed action plan to address this community issue.

**Issue Title:** {title}

**Issue Description:** {description}

**Issue Analysis:**
- Category: {category}
- Priority: {priority}
- Urgency: {urgency}
- Estimated Scope: {scope}
- Required Volunteers: {volunteers}

**Location:** {location}

Create a comprehensive action plan with 3-7 specific tasks. Return ONLY valid JSON with this structure:

{{
  "plan_title": "Clear, action-oriented title for the plan",
  "plan_description": "Brief overview of what this plan will accomplish",
  "estimated_duration_days": 5,
  "required_volunteers": 8,
  "priority": "high",
  "tasks": [
    {{
      "name": "Task 1: Specific action item",
      "description": "Detailed description of what needs to be done",
      "required_people": 3,
      "estimated_hours": 2.5,
      "priority": 1,
      "skills_required": ["skill1", "skill2"],
      "prerequisites": []
    }},
    {{
      "name": "Task 2: Next action item",
      "description": "What happens in this task",
      "required_people": 2,
      "estimated_hours": 4,
      "priority": 2,
      "skills_required": ["skill3"],
      "prerequisites": ["Task 1"]
    }}
  ],
  "success_criteria": "How we'll know this plan succeeded",
  "safety_considerations": ["Important safety notes"],
  "confidence": 0.88
}}

**Guidelines:**
- Tasks should be specific and actionable
- Order tasks logically (preparation → execution → completion)
- Priority: 1=highest, higher numbers = lower priority
- Include realistic time estimates
- Consider safety and logistics
- prerequisites: list task names that must complete first

Return ONLY the JSON, no markdown or extra text.
"""


def create_fallback_plan(issue: dict) -> dict:
    """
    Create a simple rule-based action plan when AI fails
    """
    category = issue.get("category", "civic")
    title = issue.get("title", "Community Issue")
    
    # Basic tasks based on category
    tasks = []
    
    if category == "infrastructure":
        tasks = [
            {
                "name": "Assessment and Documentation",
                "description": "Inspect the issue, take photos, and document extent of work needed",
                "required_people": 2,
                "estimated_hours": 1.5,
                "priority": 1,
                "skills_required": ["documentation", "assessment"],
                "prerequisites": []
            },
            {
                "name": "Gather Materials and Tools",
                "description": "Acquire necessary materials, tools, and safety equipment",
                "required_people": 2,
                "estimated_hours": 3.0,
                "priority": 2,
                "skills_required": ["logistics"],
                "prerequisites": ["Assessment and Documentation"]
            },
            {
                "name": "Execute Repair Work",
                "description": "Perform the actual repair or improvement work",
                "required_people": 4,
                "estimated_hours": 6.0,
                "priority": 3,
                "skills_required": ["manual labor", "construction"],
                "prerequisites": ["Gather Materials and Tools"]
            },
            {
                "name": "Cleanup and Verification",
                "description": "Clean up work area and verify issue is resolved",
                "required_people": 2,
                "estimated_hours": 1.5,
                "priority": 4,
                "skills_required": ["cleanup"],
                "prerequisites": ["Execute Repair Work"]
            }
        ]
    elif category == "environment":
        tasks = [
            {
                "name": "Planning and Outreach",
                "description": "Plan the event, recruit volunteers, and promote participation",
                "required_people": 3,
                "estimated_hours": 4.0,
                "priority": 1,
                "skills_required": ["coordination", "communication"],
                "prerequisites": []
            },
            {
                "name": "Gather Supplies",
                "description": "Collect bags, gloves, tools, and refreshments for volunteers",
                "required_people": 2,
                "estimated_hours": 2.0,
                "priority": 2,
                "skills_required": ["logistics"],
                "prerequisites": ["Planning and Outreach"]
            },
            {
                "name": "Execute Cleanup",
                "description": "Conduct the cleanup or environmental improvement activity",
                "required_people": 10,
                "estimated_hours": 4.0,
                "priority": 3,
                "skills_required": ["manual labor"],
                "prerequisites": ["Gather Supplies"]
            },
            {
                "name": "Document and Celebrate",
                "description": "Document results, thank volunteers, and share impact",
                "required_people": 2,
                "estimated_hours": 1.5,
                "priority": 4,
                "skills_required": ["documentation", "social media"],
                "prerequisites": ["Execute Cleanup"]
            }
        ]
    else:
        # Generic tasks for other categories
        tasks = [
            {
                "name": "Planning and Assessment",
                "description": "Assess the situation and create detailed plan",
                "required_people": 3,
                "estimated_hours": 3.0,
                "priority": 1,
                "skills_required": ["planning", "assessment"],
                "prerequisites": []
            },
            {
                "name": "Resource Gathering",
                "description": "Gather all necessary resources, materials, and volunteers",
                "required_people": 3,
                "estimated_hours": 4.0,
                "priority": 2,
                "skills_required": ["logistics", "coordination"],
                "prerequisites": ["Planning and Assessment"]
            },
            {
                "name": "Implementation",
                "description": "Execute the planned solution",
                "required_people": 8,
                "estimated_hours": 6.0,
                "priority": 3,
                "skills_required": ["manual labor", "coordination"],
                "prerequisites": ["Resource Gathering"]
            },
            {
                "name": "Follow-up and Documentation",
                "description": "Verify completion and document outcomes",
                "required_people": 2,
                "estimated_hours": 2.0,
                "priority": 4,
                "skills_required": ["documentation"],
                "prerequisites": ["Implementation"]
            }
        ]
    
    return {
        "plan_title": f"Action Plan: {title}",
        "plan_description": f"Structured plan to address {title.lower()}",
        "estimated_duration_days": 7,
        "required_volunteers": sum(t["required_people"] for t in tasks),
        "priority": "medium",
        "tasks": tasks,
        "success_criteria": "Issue is resolved and community is satisfied",
        "safety_considerations": ["Wear appropriate safety equipment", "Follow safety protocols"],
        "confidence": 0.6
    }


async def create_action_plan(issue_id: str) -> dict:
    """
    Create an action plan for a validated issue
    
    Args:
        issue_id: The UUID of the issue to plan for
        
    Returns:
        Dictionary containing the created action plan
    """
    db = get_db()
    session_id = str(uuid.uuid4())
    start_time = datetime.utcnow()
    
    try:
        # Fetch issue with discovery analysis
        result = db.table("issues").select("*").eq("id", issue_id).execute()
        
        if not result.data:
            return {"error": "Issue not found", "issue_id": issue_id}
        
        issue = result.data[0]
        
        # Check if already has a plan
        existing_plan = db.table("action_plans").select("id").eq("issue_id", issue_id).execute()
        if existing_plan.data:
            return {
                "success": True,
                "message": "Action plan already exists",
                "action_plan_id": existing_plan.data[0]["id"]
            }
        
        # Get discovery analysis
        discovery_analysis = issue.get("metadata", {}).get("discovery_analysis", {})
        
        # Prepare prompt
        prompt = PLANNING_PROMPT.format(
            title=issue["title"],
            description=issue["description"],
            category=discovery_analysis.get("category", issue["category"]),
            priority=discovery_analysis.get("priority", 0.5),
            urgency=discovery_analysis.get("urgency", "medium"),
            scope=discovery_analysis.get("estimated_scope", "medium"),
            volunteers=discovery_analysis.get("estimated_volunteers_needed", 5),
            location=issue["location"]
        )
        
        # Call Gemini
        execution_start = datetime.utcnow()
        plan_data = await call_gemini(
            prompt=prompt,
            system_instruction="You are an expert community project planner creating actionable plans."
        )
        execution_time = int((datetime.utcnow() - execution_start).total_seconds() * 1000)
        
        # Check for errors or use fallback for planning
        if "error" in plan_data:
            # Create a simple fallback plan
            plan_data = create_fallback_plan(issue)
            await log_agent_execution(
                session_id=session_id,
                issue_id=issue_id,
                action="create_action_plan",
                input_data={"title": issue["title"]},
                output_data=plan_data,
                success=True,
                confidence_score=0.5,
                error_message="Used fallback planning",
                execution_time_ms=execution_time
            )
        
        # Validate that plan_data has required fields
        if not plan_data.get("tasks"):
            plan_data = create_fallback_plan(issue)
        
        # Create action plan in database
        # Normalize priority to match database constraints
        ai_priority = plan_data.get("priority", "medium").lower()
        if ai_priority not in ["low", "medium", "high"]:
            ai_priority = "medium"
        
        action_plan = {
            "id": str(uuid.uuid4()),
            "issue_id": issue_id,
            "title": plan_data.get("plan_title", issue["title"]),
            "description": plan_data.get("plan_description", ""),
            "status": "draft",
            "priority": ai_priority,
            "estimated_duration_days": plan_data.get("estimated_duration_days", 5),
            "required_volunteers": plan_data.get("required_volunteers", 5),
            "assigned_volunteers": 0,
            "progress_percentage": 0.0,
            "created_at": datetime.utcnow().isoformat(),
            "metadata": {
                "planning_analysis": plan_data,
                "session_id": session_id,
                "success_criteria": plan_data.get("success_criteria"),
                "safety_considerations": plan_data.get("safety_considerations", [])
            }
        }
        
        plan_result = db.table("action_plans").insert(action_plan).execute()
        created_plan = plan_result.data[0]
        
        # Create tasks
        tasks_data = plan_data.get("tasks", [])
        created_tasks = []
        
        for task_info in tasks_data:
            task = {
                "id": str(uuid.uuid4()),
                "action_plan_id": created_plan["id"],
                "name": task_info.get("name", "Unnamed task"),
                "description": task_info.get("description", ""),
                "required_people": task_info.get("required_people", 1),
                "estimated_hours": task_info.get("estimated_hours", 2.0),
                "status": "pending",
                "priority": task_info.get("priority", 1),
                "prerequisites": task_info.get("prerequisites", []),
                "skills_required": task_info.get("skills_required", []),
                "created_at": datetime.utcnow().isoformat()
            }
            
            task_result = db.table("tasks").insert(task).execute()
            created_tasks.append(task_result.data[0])
        
        # Update issue status
        db.table("issues").update({
            "status": "planning",
            "metadata": {
                **issue.get("metadata", {}),
                "action_plan_id": created_plan["id"]
            }
        }).eq("id", issue_id).execute()
        
        # Log successful execution
        await log_agent_execution(
            session_id=session_id,
            issue_id=issue_id,
            action="create_action_plan",
            input_data={"title": issue["title"], "category": issue["category"]},
            output_data=plan_data,
            success=True,
            confidence_score=plan_data.get("confidence", 0.0),
            execution_time_ms=execution_time
        )
        
        return {
            "success": True,
            "issue_id": issue_id,
            "action_plan": created_plan,
            "tasks": created_tasks,
            "session_id": session_id
        }
        
    except Exception as e:
        # Log error
        await log_agent_execution(
            session_id=session_id,
            issue_id=issue_id,
            action="create_action_plan",
            input_data={},
            output_data={},
            success=False,
            error_message=str(e),
            execution_time_ms=int((datetime.utcnow() - start_time).total_seconds() * 1000)
        )
        
        return {
            "error": str(e),
            "issue_id": issue_id,
            "session_id": session_id
        }


async def log_agent_execution(
    session_id: str,
    issue_id: str,
    action: str,
    input_data: dict,
    output_data: dict,
    success: bool,
    confidence_score: float = None,
    error_message: str = None,
    execution_time_ms: int = None
):
    """Log planning agent execution to database"""
    db = get_db()
    
    log_entry = {
        "id": str(uuid.uuid4()),
        "session_id": session_id,
        "agent_type": "action_planning",
        "action": action,
        "input_data": input_data,
        "output_data": output_data,
        "confidence_score": confidence_score,
        "execution_time_ms": execution_time_ms,
        "success": success,
        "error_message": error_message,
        "created_at": datetime.utcnow().isoformat(),
        "metadata": {
            "issue_id": issue_id
        }
    }
    
    try:
        db.table("agent_logs").insert(log_entry).execute()
    except Exception as e:
        print(f"Failed to log agent execution: {e}")
