-- WEAVE Database Schema for Supabase
-- This schema supports the community-driven AI platform for coordinated action

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Issues table: Community-reported problems
CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('environment', 'civic', 'social', 'safety', 'infrastructure')),
    location JSONB NOT NULL, -- {lat, lng, address}
    priority DECIMAL(3,2) DEFAULT 0.5, -- 0.0 to 1.0 scale
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'planning', 'in_progress', 'completed', 'verified')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    images TEXT[], -- Array of image URLs
    metadata JSONB DEFAULT '{}' -- Additional data from AI analysis
);

-- Volunteers table: Community member profiles
CREATE TABLE volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    location JSONB, -- {lat, lng, address}
    skills TEXT[] DEFAULT '{}',
    availability TEXT[] DEFAULT '{}', -- Days/times available
    reliability_score DECIMAL(3,2) DEFAULT 0.8, -- 0.0 to 1.0 based on past performance
    phone VARCHAR(20),
    emergency_contact JSONB, -- {name, phone, relationship}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Action Plans table: AI-generated plans to address issues
CREATE TABLE action_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    estimated_duration_days INTEGER,
    required_volunteers INTEGER DEFAULT 0,
    assigned_volunteers INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}' -- AI analysis data, constraints, etc.
);

-- Tasks table: Individual tasks within action plans
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_plan_id UUID REFERENCES action_plans(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    required_people INTEGER DEFAULT 1,
    estimated_hours DECIMAL(4,2),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
    priority INTEGER DEFAULT 1, -- 1=highest, lower numbers = higher priority
    prerequisites TEXT[], -- Task IDs that must complete first
    skills_required TEXT[] DEFAULT '{}',
    location JSONB, -- {lat, lng, address} if different from main issue
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task Assignments table: Many-to-many relationship between volunteers and tasks
CREATE TABLE task_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    volunteer_id UUID REFERENCES volunteers(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'assigned' CHECK (status IN ('assigned', 'accepted', 'in_progress', 'completed', 'withdrawn')),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    UNIQUE(task_id, volunteer_id)
);

-- Impact Verifications table: Evidence and verification of real-world outcomes
CREATE TABLE impact_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_plan_id UUID REFERENCES action_plans(id) ON DELETE CASCADE,
    verification_type VARCHAR(50) NOT NULL CHECK (verification_type IN ('photo_evidence', 'gps_checkin', 'peer_validation', 'survey_response', 'metric_data')),
    evidence_data JSONB NOT NULL, -- Photos, GPS coordinates, survey responses, etc.
    submitted_by UUID REFERENCES volunteers(id),
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'needs_review')),
    confidence_score DECIMAL(3,2), -- AI confidence in verification (0.0 to 1.0)
    verified_by UUID REFERENCES auth.users(id), -- Admin who verified
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Agent Logs table: Track AI agent decisions and actions
CREATE TABLE agent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL, -- Links related agent actions
    agent_type VARCHAR(100) NOT NULL, -- 'issue_discovery', 'action_planning', 'volunteer_matching', etc.
    action VARCHAR(100) NOT NULL, -- Specific action taken
    input_data JSONB, -- Input to the agent
    output_data JSONB, -- Agent's output/decision
    confidence_score DECIMAL(3,2), -- Agent's confidence in decision
    execution_time_ms INTEGER, -- How long the action took
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Notifications table: User notifications about plan updates, assignments, etc.
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'task_assigned', 'plan_updated', 'verification_needed', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional data (task_id, plan_id, etc.)
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_category ON issues(category);
CREATE INDEX idx_issues_created_at ON issues(created_at);
CREATE INDEX idx_issues_priority ON issues(priority);

CREATE INDEX idx_volunteers_user_id ON volunteers(user_id);
CREATE INDEX idx_volunteers_skills ON volunteers USING GIN(skills);
CREATE INDEX idx_volunteers_reliability ON volunteers(reliability_score);

CREATE INDEX idx_action_plans_issue_id ON action_plans(issue_id);
CREATE INDEX idx_action_plans_status ON action_plans(status);
CREATE INDEX idx_action_plans_priority ON action_plans(priority);

CREATE INDEX idx_tasks_action_plan_id ON tasks(action_plan_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);

CREATE INDEX idx_task_assignments_task_id ON task_assignments(task_id);
CREATE INDEX idx_task_assignments_volunteer_id ON task_assignments(volunteer_id);
CREATE INDEX idx_task_assignments_status ON task_assignments(status);

CREATE INDEX idx_impact_verifications_action_plan_id ON impact_verifications(action_plan_id);
CREATE INDEX idx_impact_verifications_status ON impact_verifications(verification_status);
CREATE INDEX idx_impact_verifications_type ON impact_verifications(verification_type);

CREATE INDEX idx_agent_logs_session_id ON agent_logs(session_id);
CREATE INDEX idx_agent_logs_agent_type ON agent_logs(agent_type);
CREATE INDEX idx_agent_logs_created_at ON agent_logs(created_at);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_action_plans_updated_at BEFORE UPDATE ON action_plans FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Issues: Everyone can read, authenticated users can create, creators can update
CREATE POLICY "Issues are viewable by everyone" ON issues FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create issues" ON issues FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own issues" ON issues FOR UPDATE USING (auth.uid() = created_by);

-- Volunteers: Users can read all, but only update their own profile
CREATE POLICY "Volunteer profiles are viewable by everyone" ON volunteers FOR SELECT USING (true);
CREATE POLICY "Users can create their own volunteer profile" ON volunteers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own volunteer profile" ON volunteers FOR UPDATE USING (auth.uid() = user_id);

-- Action Plans: Everyone can read
CREATE POLICY "Action plans are viewable by everyone" ON action_plans FOR SELECT USING (true);

-- Tasks: Everyone can read
CREATE POLICY "Tasks are viewable by everyone" ON tasks FOR SELECT USING (true);

-- Task Assignments: Volunteers can see assignments and update their own
CREATE POLICY "Task assignments are viewable by everyone" ON task_assignments FOR SELECT USING (true);
CREATE POLICY "Volunteers can update their own assignments" ON task_assignments FOR UPDATE USING (
    volunteer_id IN (SELECT id FROM volunteers WHERE user_id = auth.uid())
);

-- Impact Verifications: Everyone can read, volunteers can create
CREATE POLICY "Impact verifications are viewable by everyone" ON impact_verifications FOR SELECT USING (true);
CREATE POLICY "Volunteers can create impact verifications" ON impact_verifications FOR INSERT WITH CHECK (
    submitted_by IN (SELECT id FROM volunteers WHERE user_id = auth.uid())
);

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Sample data for development/testing
INSERT INTO issues (title, description, category, location, priority) VALUES
('Riverside Park Cleanup Needed', 'Large amount of trash and debris has accumulated along the walking trails and near the playground area. Families have complained about the unsanitary conditions.', 'environment', '{"lat": 40.7589, "lng": -73.9851, "address": "Riverside Park, Manhattan, NY"}', 0.85),
('Potholes on Main Street', 'Multiple dangerous potholes have formed between 2nd and 4th Avenue, creating safety hazards for cyclists and drivers.', 'infrastructure', '{"lat": 40.7505, "lng": -73.9934, "address": "Main Street, between 2nd-4th Ave"}', 0.72),
('Food Distribution for Winter', 'Many families in the downtown area need assistance with groceries during the winter months. Community center has offered space.', 'social', '{"lat": 40.7282, "lng": -73.9942, "address": "Community Center, 5th Ave"}', 0.68);