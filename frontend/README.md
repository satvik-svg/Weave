# WEAVE Frontend

A community-driven, agentic AI platform that transforms social intent into coordinated, verifiable real-world action.

## Features

- **Issue Submission**: Community members can report local problems with photos and location data
- **AI-Powered Planning**: Automatic generation of action plans with tasks and volunteer coordination
- **Volunteer Matching**: Intelligent matching of volunteers to tasks based on skills and availability
- **Impact Verification**: Evidence-based verification of real-world outcomes
- **Community Coordination**: Real-time updates and progress tracking

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Query
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Authentication**: Ready for Clerk integration

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database schema (see `docs/database-schema.sql`)

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── issues/         # Issue-related pages
│   ├── volunteer/      # Volunteer opportunities
│   ├── plans/          # Action plans
│   └── impact/         # Impact verification
├── components/         # Reusable UI components
├── lib/               # Utility functions and API
└── providers/         # Context providers
```

## Key Pages

- **Home (`/`)**: Landing page with overview and recent activity
- **Issues (`/issues`)**: Browse and filter community issues
- **Submit Issue (`/issues/submit`)**: Report new community problems
- **Volunteer (`/volunteer`)**: Find and apply for volunteer opportunities
- **Action Plans (`/plans`)**: View AI-generated action plans and progress
- **Impact (`/impact`)**: See verified outcomes and community feedback

## Database Schema

The app expects the following Supabase tables:

- `issues`: Community-reported problems
- `action_plans`: AI-generated plans to address issues
- `volunteers`: Community member profiles
- `tasks`: Individual tasks within action plans
- `impact_verifications`: Evidence and verification data

See `docs/database-schema.sql` for the complete schema.

## Development

### Adding New Features

1. Create components in `src/components/`
2. Add API functions in `src/lib/api.ts`
3. Create pages in `src/app/`
4. Update types in `src/lib/supabase.ts`

### Styling

This project uses Tailwind CSS. The design system includes:
- Blue/Purple gradient brand colors
- Consistent spacing and typography
- Mobile-responsive layouts
- Accessible color contrasts

### State Management

- React Query for server state
- React Hook Form for form state
- Local state with useState for UI state

## Integration with Backend

This frontend is designed to work with a FastAPI backend that includes:
- Agent orchestration with LangGraph
- OpenAI GPT-4 integration
- Real-time volunteer coordination
- Impact verification algorithms

API endpoints should follow RESTful conventions:
- `GET /api/issues` - List issues
- `POST /api/issues` - Create issue
- `GET /api/plans/{issue_id}` - Get action plans
- `POST /api/volunteers/apply` - Apply for tasks

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## Environment Variables

```bash
# Required - Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional - Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Optional - API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
