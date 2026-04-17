# HR Workflow Assistant - Backend Implementation Guide

## ✅ Completed Implementation

All 7 phases + extended features have been implemented:

### Phase 1: Database Schema & Models
- ✅ Prisma schema with all entities
- ✅ Database connection utilities
- ✅ Queue system for background jobs

### Phase 2: Resume Upload & Parsing
- ✅ Resume upload API endpoint
- ✅ Resume parser service (Affinda integration)
- ✅ Structured data extraction and storage
- ✅ Duplicate detection

### Phase 3: Candidate Evaluation & Scoring
- ✅ Scoring service with configurable weights
- ✅ Automated scoring worker
- ✅ Red flag detection
- ✅ Background validation stubs

### Phase 4: AI Assessments
- ✅ Assessment creation and management
- ✅ Assessment start/submit endpoints
- ✅ Automated evaluation and scoring
- ✅ Phase progression logic (top 30% advance)
- ✅ Batch processing endpoint

### Phase 5: Interview System
- ✅ Phone interview initiation API
- ✅ Webhook for transcripts and completion
- ✅ Transcript analysis
- ✅ Human interview scheduling
- ✅ Interview feedback submission

### Phase 6: CRM Integration & Notifications
- ✅ Email notification service (SendGrid)
- ✅ SMS notifications (Twilio)
- ✅ Application confirmation emails
- ✅ Assessment invitations
- ✅ Interview reminders
- ✅ Hiring manager alerts
- ✅ CRM sync endpoints (Workday, Greenhouse, BambooHR)

### Phase 7: Interview Scheduling
- ✅ Calendar availability checking
- ✅ Calendar event creation
- ✅ Google Calendar integration
- ✅ Interview coordination APIs

### Phase 8: Extended Features
- ✅ Onboarding workflow initiation
- ✅ Onboarding task tracking
- ✅ Performance review creation
- ✅ Goal tracking
- ✅ Development plans
- ✅ Analytics and reporting APIs

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hr_workflow"

# Redis (for queue)
REDIS_URL="redis://localhost:6379"

# Resume Parser (Affinda)
AFFINDA_API_KEY="your_affinda_api_key"

# Email (SendGrid)
SENDGRID_API_KEY="your_sendgrid_api_key"
SENDGRID_FROM_EMAIL="noreply@yourcompany.com"
SENDGRID_FROM_NAME="HR Team"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="+1234567890"

# Calendar (Google Calendar)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"

# CRM Integrations
WORKDAY_API_KEY="your_workday_key"
WORKDAY_TENANT="your_tenant_name"

GREENHOUSE_API_KEY="your_greenhouse_key"

BAMBOOHR_API_KEY="your_bamboohr_key"
BAMBOOHR_SUBDOMAIN="yourcompany"

# Application
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed with sample data
npx prisma db seed
```

### 4. Start Background Worker

In a separate terminal:

```bash
node workers/candidate-scoring.worker.js
```

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 📡 API Endpoints

### Phase 2: Applications & Resume Processing

**Upload Resume**
```http
POST /api/applications/upload-resume
Content-Type: multipart/form-data

Fields:
- resume: File
- jobId: number
- candidateEmail: string
- candidateName: string
```

### Phase 3: Candidate Evaluation

**Get Candidate Score**
```http
GET /api/candidates/[id]/score
```

**Trigger Manual Scoring**
```http
POST /api/candidates/[id]/score
```

### Phase 4: Assessments

**Create Assessment**
```http
POST /api/assessments/create
{
  "candidateId": 123,
  "jobId": 456,
  "type": "phase1",
  "questions": [...]
}
```

**Start Assessment**
```http
POST /api/assessments/[id]/start
```

**Submit Assessment**
```http
POST /api/assessments/[id]/submit
{
  "answers": [...]
}
```

**Evaluate Assessment**
```http
POST /api/assessments/[id]/evaluate
```

**Batch Process Assessments**
```http
GET /api/assessments/batch-process?limit=10
```

### Phase 5: Interviews

**Schedule Interview**
```http
POST /api/interviews/schedule
{
  "candidateId": 123,
  "interviewerId": 456,
  "scheduledAt": "2025-11-20T10:00:00Z",
  "type": "phone",
  "duration": 60
}
```

**Start Phone Interview**
```http
POST /api/interviews/phone/start
{
  "candidateId": 123,
  "jobId": 456,
  "phoneNumber": "+1234567890"
}
```

**Phone Interview Webhook**
```http
POST /api/interviews/phone/webhook
{
  "interviewId": 789,
  "event": "transcript_ready",
  "data": { ... }
}
```

**Get Transcript**
```http
GET /api/interviews/[id]/transcript
```

**Submit Feedback**
```http
POST /api/interviews/[id]/feedback
{
  "interviewerId": 456,
  "ratings": { ... },
  "notes": "...",
  "recommendation": "hire"
}
```

### Phase 6: Notifications

**Send Notification**
```http
POST /api/notifications/send
{
  "type": "assessment_invitation",
  "recipientEmail": "candidate@example.com",
  "recipientName": "John Doe",
  "data": { ... }
}
```

**Sync to CRM**
```http
POST /api/crm/sync/[candidateId]
{
  "platform": "greenhouse",
  "action": "create_candidate"
}
```

### Phase 7: Scheduling

**Check Availability**
```http
GET /api/calendar/availability?email=interviewer@company.com&startDate=2025-11-18&endDate=2025-11-25
```

**Create Calendar Event**
```http
POST /api/calendar/create-event
{
  "interviewerEmail": "interviewer@company.com",
  "candidateEmail": "candidate@example.com",
  "candidateName": "John Doe",
  "startTime": "2025-11-20T10:00:00Z",
  "duration": 60,
  "title": "Technical Interview",
  "description": "..."
}
```

### Phase 8: Extended Features

**Start Onboarding**
```http
POST /api/onboarding/start
{
  "candidateId": 123,
  "startDate": "2025-12-01",
  "position": "Senior Developer",
  "department": "Engineering",
  "managerId": 456
}
```

**Complete Onboarding Task**
```http
POST /api/onboarding/[id]/tasks/[taskId]/complete
{
  "notes": "...",
  "completedBy": "HR Manager"
}
```

**Create Performance Review**
```http
POST /api/performance/reviews/create
{
  "employeeId": 123,
  "reviewerId": 456,
  "dueDate": "2025-12-31",
  "type": "annual"
}
```

**Create Goal**
```http
POST /api/performance/goals/create
{
  "employeeId": 123,
  "title": "Complete certification",
  "description": "...",
  "category": "development",
  "targetDate": "2026-03-31"
}
```

**Create Development Plan**
```http
POST /api/talent/development/create-plan
{
  "employeeId": 123,
  "currentRole": "Mid-level Developer",
  "targetRole": "Senior Developer",
  "skillGaps": ["system design", "mentoring"],
  "learningPath": [...],
  "timeline": "6 months"
}
```

### Analytics

**Recruitment Metrics**
```http
GET /api/analytics/recruitment-metrics?startDate=2025-10-01&endDate=2025-11-01&jobId=123
```

**Pipeline Status**
```http
GET /api/analytics/pipeline-status?jobId=123
```

---

## 🔄 Background Workers

The system includes background workers for CPU-intensive tasks:

### Candidate Scoring Worker

Located in `workers/candidate-scoring.worker.ts`

**Start worker:**
```bash
node workers/candidate-scoring.worker.js
```

**Processes:**
- Resume scoring based on weighted criteria
- Background validation
- Red flag detection
- Social media audit
- Automatic candidate progression

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js App   │  (Frontend + API Routes)
└────────┬────────┘
         │
    ┌────▼────┐
    │  Queue  │  (Redis + BullMQ)
    └────┬────┘
         │
    ┌────▼────────┐
    │   Workers   │  (Background processing)
    └─────────────┘
         │
    ┌────▼────────┐
    │  Database   │  (PostgreSQL + Prisma)
    └─────────────┘
```

**Service Layer:**
- `lib/services/resume-parser.service.ts` - Resume parsing
- `lib/services/scoring.service.ts` - Candidate scoring
- `lib/services/assessment.service.ts` - Assessment management
- `lib/services/interview.service.ts` - Interview coordination
- `lib/services/notification.service.ts` - Email/SMS
- `lib/services/calendar.service.ts` - Calendar integration
- `lib/services/crm.service.ts` - CRM syncing

---

## 🧪 Testing

### Test Resume Upload

```bash
curl -X POST http://localhost:3000/api/applications/upload-resume \
  -F "resume=@path/to/resume.pdf" \
  -F "jobId=1" \
  -F "candidateEmail=test@example.com" \
  -F "candidateName=Test Candidate"
```

### Test Assessment Flow

```bash
# 1. Create assessment
curl -X POST http://localhost:3000/api/assessments/create \
  -H "Content-Type: application/json" \
  -d '{"candidateId":1,"jobId":1,"type":"phase1"}'

# 2. Start assessment
curl -X POST http://localhost:3000/api/assessments/1/start

# 3. Submit answers
curl -X POST http://localhost:3000/api/assessments/1/submit \
  -H "Content-Type: application/json" \
  -d '{"answers":[{"questionId":1,"answer":"..."}]}'

# 4. Evaluate
curl -X POST http://localhost:3000/api/assessments/1/evaluate
```

---

## 📊 Success Metrics

The system tracks:

- **Time-to-hire:** Average days from application to hire
- **Quality of hire:** Score based on 6-month performance
- **Cost-per-hire:** Total recruitment costs per hire
- **Candidate experience:** Ratings and feedback
- **Conversion rates:** Stage-to-stage conversion percentages
- **Resume screening accuracy:** 95%+ target
- **Interview-to-offer rate:** Percentage of interviews leading to offers
- **Automation ratio:** 70%+ manual task reduction

View metrics at: `/api/analytics/recruitment-metrics`

---

## 🔐 Security Considerations

1. **Environment Variables:** Never commit `.env` to version control
2. **API Keys:** Rotate regularly and use key management services
3. **File Uploads:** Validate file types and scan for malware
4. **Rate Limiting:** Implement rate limiting on public endpoints
5. **Authentication:** Use NextAuth.js or similar for user auth
6. **CORS:** Configure CORS properly for production
7. **SQL Injection:** Prisma protects against this by default
8. **PII Handling:** Ensure GDPR/CCPA compliance for candidate data

---

## 📝 Next Steps

### Phase 9: Wire to UI ⏳

Connect the backend APIs to existing UI components:

1. **Update state management**
   - Add API client utilities
   - Implement React Query or SWR for data fetching
   - Create custom hooks for each service

2. **Connect components**
   - `resume-processing-view.tsx` → `/api/applications/upload-resume`
   - `assessments-view.tsx` → `/api/assessments/*`
   - `ai-interviews-view.tsx` → `/api/interviews/phone/*`
   - `scheduling-view.tsx` → `/api/calendar/*`
   - `crm-integration-view.tsx` → `/api/crm/sync/*`

3. **Add real-time updates**
   - WebSocket or Server-Sent Events for pipeline updates
   - Live status updates during interviews
   - Real-time notifications

4. **Implement authentication**
   - Add NextAuth.js
   - Protect API routes with middleware
   - Role-based access control

### Future Enhancements

- **AI/ML Models:**
  - Train custom resume scoring models
  - Sentiment analysis for interview transcripts
  - Predictive hiring success models

- **Advanced Integrations:**
  - LinkedIn Recruiter integration
  - Job board auto-posting (Indeed, Glassdoor)
  - Video interview platforms (Zoom SDK)

- **Mobile App:**
  - React Native mobile app for candidates
  - Push notifications for interview reminders

---

## 🐛 Troubleshooting

**Database connection issues:**
```bash
# Check PostgreSQL is running
psql -U postgres -d hr_workflow

# Reset database
npx prisma migrate reset
```

**Queue not processing:**
```bash
# Check Redis is running
redis-cli ping

# Clear stuck jobs
redis-cli FLUSHDB
```

**Emails not sending:**
- Verify SendGrid API key is valid
- Check sender email is verified in SendGrid
- Review SendGrid activity dashboard

**Resume parsing fails:**
- Verify Affinda API key
- Check file format (PDF, DOCX supported)
- Ensure file size < 10MB

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Affinda API Docs](https://docs.affinda.com/)
- [SendGrid API Docs](https://docs.sendgrid.com/)
- [Google Calendar API](https://developers.google.com/calendar/api)

---

## 💬 Support

For issues or questions:
- Check the logs: `pm2 logs hr-suite`
- Review API responses for error details
- Consult service documentation above

---

**Implementation Status:** ✅ All 8 phases complete! Ready for UI integration.
