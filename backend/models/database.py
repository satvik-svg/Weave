from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID


# Issues
class IssueCreate(BaseModel):
    """Schema for creating a new issue"""
    title: str = Field(..., min_length=5, max_length=255)
    description: str = Field(..., min_length=10)
    category: str = Field(default="other")
    location: dict  # {lat, lng, address}
    images: Optional[List[str]] = []
    created_by: Optional[str] = None


class IssueResponse(BaseModel):
    """Schema for issue response"""
    id: str
    title: str
    description: str
    category: str
    location: dict
    priority: Optional[float] = 0.5
    status: str = "pending"
    created_at: str
    images: Optional[List[str]] = []
    metadata: Optional[dict] = {}


# Action Plans
class ActionPlanResponse(BaseModel):
    """Schema for action plan response"""
    id: str
    issue_id: str
    title: str
    description: Optional[str] = None
    status: str = "draft"
    priority: str = "medium"
    estimated_duration_days: Optional[int] = None
    required_volunteers: int = 0
    assigned_volunteers: int = 0
    progress_percentage: float = 0.0
    created_at: str
    metadata: Optional[dict] = {}


# Tasks
class TaskResponse(BaseModel):
    """Schema for task response"""
    id: str
    action_plan_id: str
    name: str
    description: Optional[str] = None
    required_people: int = 1
    estimated_hours: Optional[float] = None
    status: str = "pending"
    priority: int = 1
    skills_required: List[str] = []
    created_at: str


# Volunteers
class VolunteerResponse(BaseModel):
    """Schema for volunteer response"""
    id: str
    name: str
    email: str
    location: Optional[dict] = None
    skills: List[str] = []
    availability: List[str] = []
    reliability_score: float = 0.8
    created_at: str


# Agent Logs
class AgentLog(BaseModel):
    """Schema for agent execution log"""
    session_id: str
    agent_type: str
    action: str
    input_data: Optional[dict] = None
    output_data: Optional[dict] = None
    confidence_score: Optional[float] = None
    execution_time_ms: Optional[int] = None
    success: bool = True
    error_message: Optional[str] = None
    metadata: Optional[dict] = {}
