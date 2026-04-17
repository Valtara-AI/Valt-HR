# HR Workflow Assistant - Setup Guide

## Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL**: v14 or higher
- **Redis**: v6 or higher (for job queues)

## Installation Steps

### 1. Install Dependencies

```cmd
npm install
```

### 2. Database Setup

#### Create PostgreSQL Database

```sql
CREATE DATABASE hr_suite;
```

#### Configure Environment Variables

Copy `.env.example` to `.env`:

```cmd
copy .env.example .env
```

Edit `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hr_suite"

# Redis (for job queues)
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### Initialize Database Schema

```cmd
npm run db:push
```

Or create a migration:

```cmd
npm run db:migrate
```

#### View Database (Optional)

```cmd
npm run db:studio
```

### 3. Configure External Services

#### Resume Parsing (Phase 2)

Choose one parsing service:

**Option A: Affinda (Recommended)**
```env
RESUME_PARSER_API_KEY=your-affinda-key
RESUME_PARSER_API_URL=https://api.affinda.com/v3
```

**Option B: Sovren**
```env
RESUME_PARSER_API_KEY=your-sovren-key
RESUME_PARSER_API_URL=https://rest.sovren.com/v10
```

#### Email & SMS (Phase 6)

**SendGrid (Email)**
```env
SENDGRID_API_KEY=your-sendgrid-key
EMAIL_FROM=noreply@hr-suite.valtara.ai
```

**Twilio (SMS)**
```env
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

#### AI Services (Phases 4, 5)

**OpenAI (Assessment & Interview Analysis)**
```env
OPENAI_API_KEY=your-openai-key
```

**Azure Speech (Interview Transcription)**
```env
AZURE_SPEECH_KEY=your-azure-key
AZURE_SPEECH_REGION=eastus
```

#### Calendar Integration (Phase 7)

**Google Calendar**

1. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Calendar API
3. Configure:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GOOGLE_REFRESH_TOKEN=your-refresh-token
```

#### CRM Integration (Phase 6)

**Workday (Optional)**
```env
WORKDAY_API_URL=https://your-tenant.workday.com/api
WORKDAY_API_KEY=your-workday-key
```

**Greenhouse (Optional)**
```env
GREENHOUSE_API_KEY=your-greenhouse-key
```

**BambooHR (Optional)**
```env
BAMBOOHR_API_KEY=your-bamboohr-key
BAMBOOHR_SUBDOMAIN=your-subdomain
```

### 4. Start Redis Server

**Windows:**
```cmd
# If installed via Chocolatey
redis-server

# Or via WSL
wsl redis-server
```

**Linux/Mac:**
```bash
redis-server
```

### 5. Start Background Workers

Open a new terminal and run:

```cmd
node -r ts-node/register workers/candidate-scoring.worker.ts
```

For production, use PM2:

```cmd
npm install -g pm2
pm2 start ecosystem.config.js
```

### 6. Start Development Server

```cmd
npm run dev
```

Application will be available at: **http://localhost:3000**

## Project Structure

```
hrwas/
├── prisma/
│   └── schema.prisma          # Database schema (15+ models)
├── lib/
│   ├── db.ts                  # Prisma client singleton
│   ├── queue.ts               # BullMQ job queues
│   └── services/              # Business logic
│       ├── resume-parser.service.ts    # Phase 2: Resume parsing
│       ├── scoring.service.ts          # Phase 3: Candidate scoring
│       ├── assessment.service.ts       # Phase 4: Assessments
│       ├── interview.service.ts        # Phase 5: Interviews
│       ├── calendar.service.ts         # Phase 7: Scheduling
│       ├── crm.service.ts              # Phase 6: CRM sync
│       └── notification.service.ts     # Phase 6: Notifications
├── pages/api/                 # Next.js API routes
│   ├── applications/
│   │   └── upload-resume.ts   # Resume upload endpoint
│   └── assessments/
│       └── [id]/
│           ├── start.ts       # Start assessment
│           └── submit.ts      # Submit assessment
├── workers/                   # Background job processors
│   └── candidate-scoring.worker.ts
└── src/components/            # React UI components
```

## Testing the System

### 1. Upload a Resume

```bash
curl -X POST http://localhost:3000/api/applications/upload-resume \
  -F "resume=@sample-resume.pdf" \
  -F "jobId=job-id-here"
```

### 2. Check Job Queue Status

Redis CLI:
```bash
redis-cli
> LLEN bull:candidate-scoring:wait
```

### 3. Monitor Logs

Watch worker output:
```cmd
# Worker logs
pm2 logs candidate-scoring

# Application logs
npm run dev
```

## API Endpoints

### Applications
- `POST /api/applications/upload-resume` - Upload resume (Phase 2)
- `GET /api/applications/[id]` - Get application details
- `PUT /api/applications/[id]/stage` - Update application stage

### Assessments
- `POST /api/assessments/[id]/start` - Start assessment (Phase 4)
- `POST /api/assessments/[id]/submit` - Submit answers
- `GET /api/assessments/[id]` - Get assessment details

### Interviews
- `POST /api/interviews/schedule` - Schedule interview (Phase 5)
- `GET /api/interviews/[id]` - Get interview details
- `POST /api/interviews/[id]/transcript` - Upload transcript

### Calendar
- `POST /api/calendar/schedule` - Create calendar event (Phase 7)
- `GET /api/calendar/availability` - Check availability
- `DELETE /api/calendar/[eventId]` - Cancel event

### CRM
- `POST /api/crm/sync/[candidateId]` - Sync candidate to CRM (Phase 6)
- `PUT /api/crm/status/[candidateId]` - Update status in CRM

## Database Seeding (Optional)

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample job
  const job = await prisma.job.create({
    data: {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      description: 'Looking for an experienced full stack developer',
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
      preferredSkills: ['TypeScript', 'Docker', 'AWS'],
      minExperience: 5,
      maxExperience: 10,
      minEducation: 'Bachelor',
      location: 'Remote',
      employmentType: 'full-time',
      status: 'open',
      openings: 2,
    },
  });

  console.log('Created job:', job.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run seed:
```cmd
npm run db:seed
```

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in .env
- Ensure database exists: `psql -l`

### Redis Connection Error
- Verify Redis is running: `redis-cli ping`
- Check REDIS_HOST and REDIS_PORT in .env

### Resume Parsing Fails
- Verify RESUME_PARSER_API_KEY is valid
- Check API rate limits
- Test with smaller PDF files first

### Worker Not Processing Jobs
- Ensure Redis is running
- Check worker is started: `pm2 list`
- View worker logs: `pm2 logs candidate-scoring`

### Email/SMS Not Sending
- Verify SendGrid/Twilio credentials
- Check email domain is verified in SendGrid
- Verify phone number format for Twilio

## Production Deployment

See `deployment/DEPLOY-NOW.md` for production deployment instructions.

## Next Steps

1. **UI Integration**: Connect existing React components to new API endpoints
2. **Authentication**: Add JWT-based auth with role-based access control
3. **File Storage**: Configure AWS S3 for resume storage
4. **Monitoring**: Set up Sentry error tracking
5. **Analytics**: Implement Mixpanel or Segment tracking

## Support

For issues or questions:
- Review logs: `pm2 logs` or console output
- Check database: `npm run db:studio`
- Verify environment variables in `.env`
