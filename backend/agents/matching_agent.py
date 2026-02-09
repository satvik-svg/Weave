"""
Matching Agent - Assigns volunteers to tasks based on intelligent matching

This agent:
1. Analyzes task requirements (skills, people needed, location)
2. Finds available volunteers with matching skills
3. Scores candidates based on skill match, location proximity, and reliability
4. Assigns optimal volunteers to each task
5. Creates task assignments in the database
"""

from utils.supabase_client import get_db
from datetime import datetime
import uuid
import math


def calculate_distance(lat1, lng1, lat2, lng2):
    """
    Calculate distance between two points using Haversine formula
    Returns distance in kilometers
    """
    R = 6371  # Earth's radius in kilometers
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lng = math.radians(lng2 - lng1)
    
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lng/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c


def calculate_skill_match(required_skills, volunteer_skills):
    """
    Calculate how well a volunteer's skills match task requirements
    Returns score between 0.0 and 1.0
    """
    if not required_skills:
        return 0.5  # Neutral score if no skills required
    
    if not volunteer_skills:
        return 0.0  # No skills = no match
    
    # Calculate intersection
    required_set = set(skill.lower() for skill in required_skills)
    volunteer_set = set(skill.lower() for skill in volunteer_skills)
    
    matches = required_set.intersection(volunteer_set)
    
    # Score based on percentage of required skills matched
    match_score = len(matches) / len(required_set)
    
    # Bonus for having extra relevant skills
    if len(matches) > 0 and len(volunteer_set) > len(required_set):
        bonus = min(0.1, (len(volunteer_set) - len(required_set)) * 0.02)
        match_score = min(1.0, match_score + bonus)
    
    return match_score


def score_volunteer_for_task(volunteer, task, issue_location):
    """
    Calculate overall match score for a volunteer-task pair
    Considers skills, location, and reliability
    """
    # Skill match (40% weight)
    skill_score = calculate_skill_match(task.get('skills_required', []), volunteer.get('skills', []))
    
    # Location proximity (30% weight)
    distance_km = None
    volunteer_loc = volunteer.get('location', {})
    if (volunteer_loc and 'lat' in volunteer_loc and 'lng' in volunteer_loc and
        issue_location and 'lat' in issue_location and 'lng' in issue_location):
        distance_km = calculate_distance(
            volunteer_loc['lat'], volunteer_loc['lng'],
            issue_location['lat'], issue_location['lng']
        )
        # Score decreases with distance (max 10km for full score)
        location_score = max(0, 1.0 - (distance_km / 10.0))
    else:
        location_score = 0.5  # Neutral if no location data
    
    # Reliability (30% weight)
    reliability_score = volunteer.get('reliability_score', 0.8)
    
    # Calculate weighted total
    total_score = (
        skill_score * 0.4 +
        location_score * 0.3 +
        reliability_score * 0.3
    )
    
    return {
        'total_score': total_score,
        'skill_score': skill_score,
        'location_score': location_score,
        'reliability_score': reliability_score,
        'distance_km': distance_km
    }


async def match_volunteers_to_tasks(action_plan_id: str) -> dict:
    """
    Match volunteers to all tasks in an action plan
    
    Args:
        action_plan_id: The UUID of the action plan
        
    Returns:
        Dictionary containing assignment results
    """
    db = get_db()
    session_id = str(uuid.uuid4())
    start_time = datetime.utcnow()
    
    try:
        # Get action plan and associated issue
        plan_result = db.table("action_plans").select("*, issues(*)").eq("id", action_plan_id).execute()
        
        if not plan_result.data:
            return {"error": "Action plan not found", "action_plan_id": action_plan_id}
        
        plan = plan_result.data[0]
        issue = plan.get('issues', {})
        issue_location = issue.get('location', {})
        
        # Get all tasks for this plan
        tasks_result = db.table("tasks").select("*").eq("action_plan_id", action_plan_id).execute()
        tasks = tasks_result.data
        
        if not tasks:
            return {"message": "No tasks found for this action plan"}
        
        # Get all volunteers
        volunteers_result = db.table("volunteers").select("*").execute()
        all_volunteers = volunteers_result.data
        
        if not all_volunteers:
            return {"error": "No volunteers available in the database"}
        
        # Get volunteers who are already assigned to active (non-completed) tasks
        active_assignments = db.table("task_assignments").select("volunteer_id").in_("status", ["assigned", "in_progress"]).execute()
        
        # Count assignments per volunteer
        assignment_counts = {}
        for a in active_assignments.data:
            v_id = a['volunteer_id']
            assignment_counts[v_id] = assignment_counts.get(v_id, 0) + 1
            
        # Filter strictly busy volunteers (more than MAX_CONCURRENT_TASKS active tasks)
        MAX_CONCURRENT_TASKS = 10
        busy_volunteer_ids = set(v_id for v_id, count in assignment_counts.items() if count >= MAX_CONCURRENT_TASKS)
        
        # Filter to available volunteers (less than MAX_CONCURRENT_TASKS assignments)
        available_volunteers = [v for v in all_volunteers if v['id'] not in busy_volunteer_ids]
        
        print(f"📊 Volunteers: {len(all_volunteers)} total, {len(busy_volunteer_ids)} busy, {len(available_volunteers)} available")
        
        # Fallback: If no volunteers are "available" (all hit the limit), pick the least busy ones
        if not available_volunteers:
            print("⚠️ All volunteers are busy! Falling back to least busy volunteers.")
            # Sort all volunteers by their current assignment count (ascending)
            # Volunteers with 0 assignments won't be in assignment_counts, so get(v_id, 0) handles them
            available_volunteers = sorted(all_volunteers, key=lambda v: assignment_counts.get(v['id'], 0))
            
            # If we really just want to proceed, we use everyone, but prioritized by least busy
            # The sorting above achieves that.
            
            # Log this fallback event (optional but good for debugging)
            # We don't return error anymore, we proceed with these "busy" volunteers

        
        assignments = []
        assignment_summary = {
            'total_tasks': len(tasks),
            'tasks_fully_assigned': 0,
            'tasks_partially_assigned': 0,
            'total_assignments_made': 0,
            'unassigned_tasks': []
        }
        
        # For each task, find and assign best matching volunteers
        for task in tasks:
            required_people = task.get('required_people', 1)
            task_name = task.get('name', 'Unnamed task')
            
            # Score all volunteers for this task
            scored_volunteers = []
            for volunteer in available_volunteers:
                score_data = score_volunteer_for_task(volunteer, task, issue_location)
                scored_volunteers.append({
                    'volunteer': volunteer,
                    'scores': score_data
                })
            
            # Sort by total score (descending)
            scored_volunteers.sort(key=lambda x: x['scores']['total_score'], reverse=True)
            
            # Assign top N volunteers
            task_assignments = []
            for i in range(min(required_people, len(scored_volunteers))):
                candidate = scored_volunteers[i]
                volunteer = candidate['volunteer']
                scores = candidate['scores']
                
                # Create assignment (notes field stores matching metadata as JSON string)
                distance_display = f"{scores['distance_km']:.1f}km" if scores['distance_km'] is not None else "N/A"
                assignment = {
                    "id": str(uuid.uuid4()),
                    "task_id": task['id'],
                    "volunteer_id": volunteer['id'],
                    "status": "assigned",
                    "assigned_at": datetime.utcnow().isoformat(),
                    "notes": f"Auto-assigned by matching agent. Skill match: {scores['skill_score']:.2f}, Location: {distance_display}, Reliability: {scores['reliability_score']:.2f}"
                }
                
                task_assignments.append(assignment)
            
            # Insert assignments for this task
            if task_assignments:
                db.table("task_assignments").insert(task_assignments).execute()
                assignments.extend(task_assignments)
                
                # UPDATE TASK STATUS based on assignments
                if len(task_assignments) >= required_people:
                    # Fully assigned - mark as ready to start
                    db.table("tasks").update({
                        "status": "pending"  # Ready to be accepted by volunteers
                    }).eq("id", task['id']).execute()
                    assignment_summary['tasks_fully_assigned'] += 1
                else:
                    # Partially assigned - still need more volunteers
                    assignment_summary['tasks_partially_assigned'] += 1
                    assignment_summary['unassigned_tasks'].append({
                        'task_name': task_name,
                        'required': required_people,
                        'assigned': len(task_assignments)
                    })
                
                assignment_summary['total_assignments_made'] += len(task_assignments)
            else:
                assignment_summary['unassigned_tasks'].append({
                    'task_name': task_name,
                    'required': required_people,
                    'assigned': 0
                })
        
        # Update action plan with assigned volunteer count
        total_assigned_volunteers = len(set(a['volunteer_id'] for a in assignments))
        db.table("action_plans").update({
            "assigned_volunteers": total_assigned_volunteers,
            "status": "active" if total_assigned_volunteers > 0 else "draft"
        }).eq("id", action_plan_id).execute()
        
        # Log agent execution
        execution_time = int((datetime.utcnow() - start_time).total_seconds() * 1000)
        await log_agent_execution(
            session_id=session_id,
            action_plan_id=action_plan_id,
            action="match_volunteers",
            input_data={
                "tasks_count": len(tasks),
                "total_volunteers": len(all_volunteers),
                "available_volunteers": len(available_volunteers),
                "busy_volunteers": len(busy_volunteer_ids)
            },
            output_data=assignment_summary,
            success=True,
            execution_time_ms=execution_time
        )
        
        return {
            "success": True,
            "action_plan_id": action_plan_id,
            "session_id": session_id,
            "summary": assignment_summary,
            "assignments": assignments
        }
        
    except Exception as e:
        # Log error
        execution_time = int((datetime.utcnow() - start_time).total_seconds() * 1000)
        await log_agent_execution(
            session_id=session_id,
            action_plan_id=action_plan_id,
            action="match_volunteers",
            input_data={},
            output_data={},
            success=False,
            error_message=str(e),
            execution_time_ms=execution_time
        )
        
        return {
            "error": str(e),
            "action_plan_id": action_plan_id,
            "session_id": session_id
        }


async def log_agent_execution(
    session_id: str,
    action_plan_id: str,
    action: str,
    input_data: dict,
    output_data: dict,
    success: bool,
    confidence_score: float = None,
    error_message: str = None,
    execution_time_ms: int = None
):
    """Log matching agent execution to database"""
    db = get_db()
    
    log_entry = {
        "id": str(uuid.uuid4()),
        "session_id": session_id,
        "agent_type": "volunteer_matching",
        "action": action,
        "input_data": input_data,
        "output_data": output_data,
        "confidence_score": confidence_score,
        "execution_time_ms": execution_time_ms,
        "success": success,
        "error_message": error_message,
        "created_at": datetime.utcnow().isoformat(),
        "metadata": {
            "action_plan_id": action_plan_id
        }
    }
    
    try:
        db.table("agent_logs").insert(log_entry).execute()
    except Exception as e:
        print(f"Failed to log agent execution: {e}")
