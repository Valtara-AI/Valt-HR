# Setup Guide - HR Workflow Assistant

Follow these steps to get your backend up and running.

## Prerequisites

Make sure you have installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Redis** (v6 or higher) - [Download](https://redis.io/download)

---

## Step 1: Install Dependencies

```bash
npm install
```

---

## Step 2: Set Up PostgreSQL Database

### Option A: Local PostgreSQL

1. Create a new database:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hr_workflow;

# Create user (optional)
CREATE USER hr_admin WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE hr_workflow TO hr_admin;

# Exit
\q
```

2. Your `DATABASE_URL` will be:
```
postgresql://postgres:your_password@localhost:5432/hr_workflow
```

### Option B: Cloud Database (Recommended for Production)

Services like:
- **Supabase** (Free tier available) - [supabase.com](https://supabase.com)
- **Neon** (Free tier available) - [neon.tech](https://neon.tech)
- **Railway** - [railway.app](https://railway.app)

They'll provide you with a `DATABASE_URL` string.

---

## Step 3: Set Up Redis

### Option A: Local Redis (Windows)

1. Download Redis for Windows from: https://github.com/microsoftarchive/redis/releases
2. Install and start Redis:
```bash
redis-server
```

3. Test connection:
```bash
redis-cli ping
# Should return: PONG
```

Your `REDIS_URL` will be:
```
redis://localhost:6379
```

### Option B: Cloud Redis

Services like:
- **Upstash** (Free tier available) - [upstash.com](https://upstash.com)
- **Redis Cloud** - [redis.com](https://redis.com/redis-enterprise-cloud/)

They'll provide you with a `REDIS_URL` string.

---

## Step 4: Configure Environment Variables

1. Copy the example file:
```bash
copy .env.example .env
```

2. Edit `.env` and fill in the values:

### Required for Basic Functionality:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/hr_workflow"
REDIS_URL="redis://localhost:6379"
SENDGRID_API_KEY="your_sendgrid_key"
SENDGRID_FROM_EMAIL="noreply@yourcompany.com"
NEXTAUTH_SECRET="generate_random_string"
```

### Optional (can add later):
- `AFFINDA_API_KEY` - For resume parsing (can use mock data initially)
- `TWILIO_*` - For SMS and phone interviews
- `GOOGLE_CLIENT_ID` - For Google Calendar integration
- `OPENAI_API_KEY` - For AI-powered assessments

---

## Step 5: Initialize Database

Run Prisma migrations to create all tables:

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Open Prisma Studio to view your database (optional)
npx prisma studio
```

**Expected output:**
```
✔ Generated Prisma Client
✔ The migration has been generated and applied successfully.
```

---

## Step 6: Seed Sample Data (Optional)

Create a seed file to add sample jobs and test data:

**Create `prisma/seed.ts`:**

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample jobs
  const job1 = await prisma.job.create({
    data: {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      description: 'Looking for an experienced full-stack developer...',
      requirements: JSON.stringify({
        skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
        experience: 5,
        education: 'Bachelor\'s degree in Computer Science',
      }),
      status: 'open',
      postedAt: new Date(),
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: 'Product Manager',
      department: 'Product',
      description: 'Seeking a strategic product manager...',
      requirements: JSON.stringify({
        skills: ['Product Strategy', 'Agile', 'Analytics'],
        experience: 3,
        education: 'Bachelor\'s degree',
      }),
      status: 'open',
      postedAt: new Date(),
    },
  });

  console.log('✅ Seeded jobs:', { job1, job2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Add to `package.json`:**
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

**Run seed:**
```bash
npx prisma db seed
```

---

## Step 7: Start the Development Server

```bash
npm run dev
```

The app should start at: **http://localhost:3000**

---

## Step 8: Start Background Workers

In a **new terminal**, start the candidate scoring worker:

```bash
node workers/candidate-scoring.worker.js
```

**Expected output:**
```
Candidate scoring worker started...
Waiting for jobs...
```

---

## Step 9: Test the Backend

### Test 1: Health Check
```bash
curl http://localhost:3000/api/health
```

**Expected:** `{"status": "ok"}`

### Test 2: Get Analytics
```bash
curl http://localhost:3000/api/analytics/recruitment-metrics
```

**Expected:** JSON with recruitment metrics

### Test 3: Upload Resume (with a sample PDF)

```bash
curl -X POST http://localhost:3000/api/applications/upload-resume ^
  -F "resume=@path\to\resume.pdf" ^
  -F "jobId=1" ^
  -F "candidateEmail=test@example.com" ^
  -F "candidateName=John Doe"
```

**Expected:** Success message with candidate ID

---

## Step 10: Verify Database

Open Prisma Studio to see your data:

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all candidates
- Check applications
- See assessment results
- Monitor pipeline status

---

## Troubleshooting

### Issue: Database connection error
**Solution:**
- Check PostgreSQL is running: `psql -U postgres`
- Verify `DATABASE_URL` in `.env` is correct
- Run migrations: `npx prisma migrate dev`

### Issue: Redis connection error
**Solution:**
- Check Redis is running: `redis-cli ping`
- Verify `REDIS_URL` in `.env` is correct
- On Windows, make sure Redis service is started

### Issue: Worker not processing jobs
**Solution:**
- Make sure Redis is running
- Check worker logs for errors
- Restart worker: `node workers/candidate-scoring.worker.js`

### Issue: Emails not sending
**Solution:**
- Verify SendGrid API key is valid
- Check sender email is verified in SendGrid dashboard
- Review SendGrid activity log for delivery issues

### Issue: TypeScript errors
**Solution:**
```bash
# Regenerate Prisma Client
npx prisma generate

# Clear cache
del /s /q .next
npm run dev
```

---

## Development Workflow

### Daily startup:
1. Start PostgreSQL (if not auto-starting)
2. Start Redis: `redis-server`
3. Start dev server: `npm run dev`
4. Start worker: `node workers/candidate-scoring.worker.js`

### Database changes:
1. Edit `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name description`
3. Generate client: `npx prisma generate`

### View logs:
- API logs: Check terminal running `npm run dev`
- Worker logs: Check terminal running worker
- Database: Use `npx prisma studio`

---

## Next Steps

Once your backend is running:

1. **Test all endpoints** using Postman or Thunder Client
2. **Wire UI components** to backend APIs (see Phase 9 below)
3. **Set up authentication** with NextAuth.js
4. **Deploy to production** (see deployment guide)

---

## Phase 9: Wire UI to Backend

Now that the backend is functional, connect your React components:

### Example 1: Resume Upload Component

**Update `src/components/resume-processing-view.tsx`:**

```typescript
// Add at top
import { useState } from 'react';

// Replace mock upload function with real API call
const handleResumeUpload = async (file: File, jobId: number) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jobId', jobId.toString());
  formData.append('candidateEmail', 'extracted@example.com'); // Extract from resume
  formData.append('candidateName', 'Extracted Name'); // Extract from resume

  try {
    const response = await fetch('/api/applications/upload-resume', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (data.success) {
      alert(`Resume uploaded! Candidate ID: ${data.candidateId}`);
      // Refresh candidate list
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Upload failed:', error);
    alert('Upload failed. Please try again.');
  }
};
```

### Example 2: Analytics Dashboard

**Update `src/components/success-metrics-view.tsx`:**

```typescript
import { useEffect, useState } from 'react';

export function SuccessMetricsView() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/analytics/recruitment-metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Recruitment Metrics</h2>
      <div>Total Applications: {metrics?.totalApplications}</div>
      <div>Average Time to Hire: {metrics?.averageTimeToHire} days</div>
      <div>Conversion Rate: {metrics?.conversionRate}%</div>
      {/* Display other metrics */}
    </div>
  );
}
```

### Example 3: Pipeline Status

**Update `src/components/pipeline-view.tsx`:**

```typescript
import { useEffect, useState } from 'react';

export function PipelineView() {
  const [pipeline, setPipeline] = useState(null);

  useEffect(() => {
    const fetchPipeline = async () => {
      const response = await fetch('/api/analytics/pipeline-status');
      const data = await response.json();
      setPipeline(data);
    };

    fetchPipeline();
    
    // Poll every 30 seconds for updates
    const interval = setInterval(fetchPipeline, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {pipeline?.byStage.map((stage) => (
        <div key={stage.stage}>
          <h3>{stage.stage}</h3>
          <div>Count: {stage.count}</div>
          {stage.candidates.map((candidate) => (
            <div key={candidate.id}>
              {candidate.name} - Score: {candidate.score}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

---

## API Client Helper

Create a centralized API client:

**Create `src/services/apiClient.ts`:**

```typescript
class APIClient {
  private baseURL = '/api';

  async uploadResume(file: File, jobId: number, email: string, name: string) {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobId', jobId.toString());
    formData.append('candidateEmail', email);
    formData.append('candidateName', name);

    return this.post('/applications/upload-resume', formData);
  }

  async getRecruitmentMetrics(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return this.get(`/analytics/recruitment-metrics?${params}`);
  }

  async getPipelineStatus(jobId?: number) {
    const params = jobId ? `?jobId=${jobId}` : '';
    return this.get(`/analytics/pipeline-status${params}`);
  }

  async startAssessment(assessmentId: number) {
    return this.post(`/assessments/${assessmentId}/start`);
  }

  async submitAssessment(assessmentId: number, answers: any[]) {
    return this.post(`/assessments/${assessmentId}/submit`, { answers });
  }

  async scheduleInterview(data: any) {
    return this.post('/interviews/schedule', data);
  }

  private async get(endpoint: string) {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    return response.json();
  }

  private async post(endpoint: string, body?: any) {
    const isFormData = body instanceof FormData;
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? body : JSON.stringify(body),
    });
    
    return response.json();
  }
}

export const apiClient = new APIClient();
```

**Use in components:**
```typescript
import { apiClient } from '@/services/apiClient';

// In your component
const metrics = await apiClient.getRecruitmentMetrics();
const pipeline = await apiClient.getPipelineStatus();
```

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Use production database (not localhost)
- [ ] Use production Redis (not localhost)
- [ ] Add rate limiting to API routes
- [ ] Set up proper authentication
- [ ] Configure CORS properly
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure backups for database
- [ ] Set up CI/CD pipeline
- [ ] Add error tracking
- [ ] Load test the APIs
- [ ] Review security (API keys, CORS, rate limits)

---

## Need Help?

- **Database issues:** Check `npx prisma studio` and logs
- **API errors:** Check browser console and Network tab
- **Worker not running:** Check Redis connection and worker logs
- **Email issues:** Check SendGrid dashboard for delivery status

Your backend is now ready! 🚀
