"""
Discovery Agent - Analyzes and categorizes community issues

This agent:
1. Normalizes unstructured text
2. Classifies issue type (environmental, civic, social, etc.)
3. Estimates urgency and scope
4. Filters low-quality or spam submissions
5. Produces structured metadata with confidence scores
"""

from utils.gemini_client import call_gemini
from utils.supabase_client import get_db
from datetime import datetime
import uuid


DISCOVERY_PROMPT = """You are a community issue analysis agent. Analyze the following community issue and provide structured metadata.

**Issue Title:** {title}

**Issue Description:** {description}

**Location:** {location}

Analyze this issue and return a JSON response with the following structure:

{{
  "category": "one of: environment, civic, social, safety, infrastructure",
  "priority": 0.75,
  "urgency": "one of: low, medium, high, critical",
  "estimated_scope": "one of: small, medium, large, very_large",
  "is_valid": true,
  "requires_resources": ["list of required resources"],
  "estimated_volunteers_needed": 5,
  "estimated_duration_days": 3,
  "confidence": 0.92,
  "reasoning": "Brief explanation of your analysis",
  "tags": ["relevant", "tags", "for", "this", "issue"]
}}

**Guidelines:**
- category: Choose the most relevant category
- priority: Score from 0.0 to 1.0 (higher = more urgent)
- urgency: Based on time-sensitivity and community impact
- estimated_scope: Based on complexity and resources needed
- is_valid: false only for spam, duplicates, or nonsensical submissions
- confidence: Your confidence in this analysis (0.0 to 1.0)

Return ONLY valid JSON, no additional text or markdown.
"""


async def analyze_issue(issue_id: str) -> dict:
    """
    Analyze a community issue and generate structured metadata
    
    Args:
        issue_id: The UUID of the issue to analyze
        
    Returns:
        Dictionary containing analysis results and metadata
    """
    db = get_db()
    session_id = str(uuid.uuid4())
    start_time = datetime.utcnow()
    
    try:
        # Fetch issue from database
        result = db.table("issues").select("*").eq("id", issue_id).execute()
        
        if not result.data:
            return {"error": "Issue not found", "issue_id": issue_id}
        
        issue = result.data[0]
        
        # Prepare prompt
        prompt = DISCOVERY_PROMPT.format(
            title=issue["title"],
            description=issue["description"],
            location=issue["location"]
        )
        
        # Log agent input
        execution_start = datetime.utcnow()
        
        # Call Gemini
        analysis = await call_gemini(
            prompt=prompt,
            system_instruction="You are an expert community organizer and issue analyst."
        )
        
        execution_time = int((datetime.utcnow() - execution_start).total_seconds() * 1000)
        
        # Check for errors
        if "error" in analysis:
            await log_agent_execution(
                session_id=session_id,
                issue_id=issue_id,
                action="analyze_issue",
                input_data={"title": issue["title"], "description": issue["description"]},
                output_data=analysis,
                success=False,
                error_message=analysis.get("error"),
                execution_time_ms=execution_time
            )
            return analysis
        
        # Update issue with analysis results
        update_data = {
            "category": analysis.get("category", issue["category"]),
            "priority": analysis.get("priority", 0.5),
            "status": "planning" if analysis.get("is_valid", True) else "pending",
            "metadata": {
                "discovery_analysis": analysis,
                "analyzed_at": datetime.utcnow().isoformat()
            }
        }
        
        db.table("issues").update(update_data).eq("id", issue_id).execute()
        
        # Log successful execution
        await log_agent_execution(
            session_id=session_id,
            issue_id=issue_id,
            action="analyze_issue",
            input_data={"title": issue["title"], "description": issue["description"]},
            output_data=analysis,
            success=True,
            confidence_score=analysis.get("confidence", 0.0),
            execution_time_ms=execution_time
        )
        
        return {
            "success": True,
            "issue_id": issue_id,
            "analysis": analysis,
            "session_id": session_id
        }
        
    except Exception as e:
        # Log error
        await log_agent_execution(
            session_id=session_id,
            issue_id=issue_id,
            action="analyze_issue",
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
    """Log agent execution to database for observability"""
    db = get_db()
    
    log_entry = {
        "id": str(uuid.uuid4()),
        "session_id": session_id,
        "agent_type": "issue_discovery",
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
