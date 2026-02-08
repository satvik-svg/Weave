# Weave

**Community-Driven Agentic AI Platform for Coordinated Action**

Weave is a solo-built, community-driven, agentic AI platform designed to convert social intent into coordinated, verifiable real-world action. Unlike traditional platforms that stop at listing volunteer opportunities, Weave employs a structured, agent-based execution pipeline to actively reason, plan, assign, monitor, and validate community initiatives.

![Weave Dashboard Screenshot](/public/dashboard-preview.png)

## Core Problem & Solution

Most community impact platforms function as passive directories. They fail to:
- Convert broad issues into executable plans.
- Dynamically coordinate people based on real-time needs.
- Handle execution failures or drop-offs.
- Verify real-world outcomes objectively.

**Weave addresses this gap** by introducing an intelligent agent layer that transforms community input into measurable outcomes through autonomous reasoning and coordination.

## System Architecture

Weave runs on a layered, event-driven architecture designed for reliability and observability:
1.  **Frontend Layer**: Next.js interface for community interaction and real-time updates.
2.  **Backend API Layer**: FastAPI service for data persistence and orchestration.
3.  **Agent Layer**: Autonomous agents (Discovery, Planning, Matching) that reason and execute complex workflows.
4.  **Data & Observability Layer**: Supabase for structured data and logs to track every agent decision.

The system is designed to be asynchronous. User requests trigger events that are processed by background agents, ensuring a responsive UI while complex reasoning occurs.

## End-to-End Workflow

The platform operates through a defined multi-agent pipeline:

### 1. Community Issue Intake
Users report local issues (e.g., "Park cleanup needed") with location, description, and images. The system accepts these inputs and triggers the agent workflow.

### 2. Issue Discovery Agent
This agent analyzes the raw submission to:
- Normalize unstructured text.
- Classify the issue type (Environmental, Civic, Social, etc.).
- Estimate urgency and scope.
- Filter spam or low-quality reports.

### 3. Action Planning Agent
Once an issue is validated, the Planning Agent breaks it down into a structured **Action Plan**. It determines:
- Specific tasks required (e.g., "Gather supplies", "Clear debris").
- Resource and skill requirements.
- Estimated time and personnel needed for each task.

### 4. Volunteer Matching Agent
The Matching Agent intelligently assigns volunteers to tasks based on:
- **Proximity**: Distance from the issue location.
- **Skills**: Matching volunteer capabilities with task requirements.
- **Availability**: Current workload (capped to prevent burnout).
- **Reliability**: Historical performance scores.

### 5. Coordination & Execution
(In Development) The system monitors task status, manages drop-offs, and ensures the plan moves forward.

### 6. Impact Verification
(In Development) Verified outcomes are tracked via evidence uploads, enabling a transparent "Impact Dashboard" that shows real-world results, not just intent.

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: React Query
- **Maps**: Leaflet / Mapbox
- **Icons**: Lucide React

### Backend & AI
- **API**: FastAPI (Python 3.10+)
- **Server**: Uvicorn
- **AI Model**: Google Gemini Pro (via `google-generativeai`)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk / Supabase Auth

## Installation & Setup

### Prerequisites
- Node.js (v18+) & npm
- Python 3.10+
- Supabase Account
- Google AI Studio API Key

### 1. Clone Repository
```bash
git clone https://github.com/satvik-svg/Weave.git
cd Weave
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

Run Server:
```bash
python3 main.py
```
*API running at http://localhost:8000*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run App:
```bash
npm run dev
```
*App running at http://localhost:3000*

## Reliability & Safety
Weave implements strict safeguards for agentic behavior:
- **Schema Validation**: All agent outputs are validated against Pydantic models.
- **Human-in-the-Loop**: Low-confidence actions are flagged for review.
- **Observability**: Every agent step, input, and reasoning trace is logged for auditing.

## Contributing
Contributions are welcome! Please submit a Pull Request or open an Issue to discuss proposed changes.

## License
This project is licensed under the MIT License.
