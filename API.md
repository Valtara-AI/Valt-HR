# HR Workflow Assistant - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently not implemented. Add JWT-based auth with:
```typescript
Authorization: Bearer <token>
```

---

## Phase 2: Resume Processing & Application

### Upload Resume
**Endpoint:** `POST /applications/upload-resume`

**Description:** Upload candidate resume, parse it, check for duplicates, and trigger scoring.

**Request:**
```bash
curl -X POST http://localhost:3000/api/applications/upload-resume \
  -H "Content-Type: multipart/form-data" \
  -F "resume=@resume.pdf" \
  -F "jobId=job-id-123"
```

**Response:**
```json
{
  "success": true,
  "application": {
    "id": "app-123",
    "candidateId": "cand-456",
    "stage": "resume-scoring"
  }
}
```

**Workflow:**
1. Parse resume using Affinda API
2. Extract: name, email, phone, skills, experience, education
3. Check for duplicate candidates (by email/phone)
4. Create Candidate and Application records
5. Queue scoring job in `candidate-scoring` queue
6. Send confirmation email to candidate

**Error Responses:**
- `400` - Missing job ID or resume file
- `409` - Duplicate application detected
- `500` - Parsing or internal error

---

## Phase 4: AI-Powered Assessments

### Start Assessment
**Endpoint:** `POST /assessments/:id/start`

**Description:** Start an assessment and receive questions.

**Request:**
```bash
curl -X POST http://localhost:3000/api/assessments/abc-123/start
```

**Response:**
```json
{
  "id": "abc-123",
  "candidateId": "cand-456",
  "jobId": "job-789",
  "phase": 1,
  "status": "in-progress",
  "timeLimit": 60,
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "Which of the following best describes your experience with React?",
      "options": ["No experience", "Basic", "Intermediate", "Advanced"],
      "points": 10,
      "difficulty": "easy",
      "skillCategory": "React"
    },
    {
      "id": "code1",
      "type": "coding",
      "question": "Write a function to reverse a linked list",
      "points": 20,
      "difficulty": "medium",
      "skillCategory": "Algorithms"
    }
  ],
  "startedAt": "2024-01-15T10:00:00Z",
  "expiresAt": "2024-01-22T10:00:00Z"
}
```

### Submit Assessment
**Endpoint:** `POST /assessments/:id/submit`

**Description:** Submit assessment answers and receive score.

**Request:**
```bash
curl -X POST http://localhost:3000/api/assessments/abc-123/submit \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": "cand-456",
    "answers": [
      {
        "questionId": "q1",
        "answer": 2,
        "timeSpent": 45
      },
      {
        "questionId": "code1",
        "answer": "function reverseLinkedList(head) {...}",
        "timeSpent": 600
      }
    ],
    "totalTime": 3000
  }'
```

**Response:**
```json
{
  "success": true,
  "result": {
    "totalScore": 85,
    "maxScore": 100,
    "percentage": 85,
    "breakdown": {
      "React": {
        "score": 10,
        "maxScore": 10,
        "percentage": 100
      },
      "Algorithms": {
        "score": 15,
        "maxScore": 20,
        "percentage": 75
      }
    },
    "advancesToPhase2": true,
    "detailedFeedback": [
      "✓ React experience: Correct",
      "Linked list reversal: Code submitted for manual review"
    ]
  }
}
```

**Scoring Logic:**
- **Phase 1:**
  - Score ≥ 70%: Advance to Phase 2 (top 30%)
  - Score 50-69%: Under review
  - Score < 50%: Rejected

- **Phase 2:**
  - Score ≥ 60%: Advance to phone interview
  - Score < 60%: Rejected

---

## Phase 5: Interview Management

### Schedule Interview
**Endpoint:** `POST /interviews/schedule`

**Description:** Schedule an AI or human interview, create calendar event.

**Request:**
```bash
curl -X POST http://localhost:3000/api/interviews/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": "cand-456",
    "jobId": "job-789",
    "type": "video",
    "scheduledAt": "2024-01-20T15:00:00Z",
    "interviewerEmail": "interviewer@company.com",
    "interviewerName": "John Smith",
    "duration": 60
  }'
```

**Interview Types:**
- `ai-phone`: AI-conducted phone interview (no calendar event)
- `human-phone`: Human phone interview
- `video`: Video interview (creates Google Meet link)
- `in-person`: In-person interview

**Response:**
```json
{
  "success": true,
  "interview": {
    "id": "int-123",
    "candidateId": "cand-456",
    "jobId": "job-789",
    "type": "video",
    "scheduledAt": "2024-01-20T15:00:00Z",
    "status": "scheduled",
    "meetingLink": "https://meet.google.com/abc-defg-hij",
    "calendarEventId": "google-event-id",
    "candidate": {
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com"
    },
    "job": {
      "title": "Senior Full Stack Developer"
    }
  }
}
```

**Workflow:**
1. Create Interview record in database
2. Generate Google Calendar event with Meet link
3. Send email/SMS confirmation to candidate and interviewer
4. Set reminders (24h, 1h, 15min before)

### Process Interview Transcript
**Endpoint:** `POST /interviews/:id/transcript`

**Description:** Upload interview recording, transcribe with Azure Speech, analyze with AI.

**Request:**
```bash
curl -X POST http://localhost:3000/api/interviews/int-123/transcript \
  -H "Content-Type: application/json" \
  -d '{
    "audioUrl": "https://storage.example.com/recordings/int-123.mp3"
  }'
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "sentiment": "positive",
    "keyTopics": ["React experience", "System design", "Team collaboration"],
    "technicalSkills": ["React", "Node.js", "PostgreSQL", "AWS"],
    "communicationScore": 8,
    "confidenceScore": 9,
    "responseQuality": 8,
    "overallScore": 85,
    "redFlags": [],
    "strengths": [
      "Strong technical background",
      "Clear communication",
      "Good problem-solving approach"
    ],
    "weaknesses": [
      "Limited experience with microservices"
    ],
    "recommendation": "hire",
    "summary": "Candidate demonstrated strong technical skills and excellent communication. Recommended for hire."
  }
}
```

**Recommendations:**
- `strong-hire`: Score ≥ 90, immediate offer
- `hire`: Score 75-89, proceed to final interview
- `maybe`: Score 60-74, under review
- `no-hire`: Score < 60, rejected

---

## Phase 6: CRM Integration

### Sync to CRM Systems
**Endpoint:** `POST /crm/sync/:candidateId`

**Description:** Sync candidate data to Workday, Greenhouse, and/or BambooHR.

**Request (All Systems):**
```bash
curl -X POST http://localhost:3000/api/crm/sync/cand-456
```

**Request (Specific Systems):**
```bash
curl -X POST http://localhost:3000/api/crm/sync/cand-456 \
  -H "Content-Type: application/json" \
  -d '{
    "systems": ["greenhouse", "bamboohr"]
  }'
```

**Response:**
```json
{
  "success": true,
  "results": {
    "workday": "workday-candidate-id-789",
    "greenhouse": "gh-candidate-123",
    "bamboohr": "bamboo-applicant-456",
    "errors": []
  }
}
```

**Supported Systems:**
- **Workday**: Full candidate profile sync
- **Greenhouse**: Candidate + application sync
- **BambooHR**: Basic applicant info sync

**Sync Records:**
All sync operations are logged in the `CRMSync` table with:
- External ID from CRM system
- Sync timestamp
- Status (success/failed)
- Error details (if failed)

### Update CRM Status
**Endpoint:** `PUT /crm/status/:candidateId`

**Description:** Update candidate status across all synced CRM systems.

**Request:**
```bash
curl -X PUT http://localhost:3000/api/crm/status/cand-456 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "hired"
  }'
```

**Statuses:**
- `new`: Application received
- `assessment-pending`: Assessment invited
- `phone-interview`: Phone interview scheduled
- `final-interview`: Final interview scheduled
- `offer`: Offer extended
- `hired`: Candidate hired
- `rejected`: Application rejected

---

## Phase 7: Calendar & Scheduling

### Check Availability
**Endpoint:** `GET /calendar/availability`

**Description:** Check interviewer availability for a time slot.

**Request:**
```bash
curl "http://localhost:3000/api/calendar/availability?email=interviewer@company.com&startTime=2024-01-20T15:00:00Z&endTime=2024-01-20T16:00:00Z"
```

**Response:**
```json
{
  "available": true
}
```

### Find Available Slots
**Endpoint:** `GET /calendar/slots`

**Description:** Find available time slots for multiple interviewers.

**Request:**
```bash
curl "http://localhost:3000/api/calendar/slots?emails=interviewer1@company.com,interviewer2@company.com&duration=60&daysAhead=7"
```

**Response:**
```json
{
  "slots": [
    "2024-01-16T10:00:00Z",
    "2024-01-16T14:00:00Z",
    "2024-01-17T09:00:00Z",
    "2024-01-17T15:00:00Z",
    "2024-01-18T11:00:00Z"
  ]
}
```

**Logic:**
- Checks business hours (9 AM - 5 PM)
- Skips weekends
- Finds common availability for all interviewers
- Returns top 10 slots

### Cancel Interview
**Endpoint:** `DELETE /calendar/:eventId`

**Description:** Cancel calendar event and notify attendees.

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/calendar/google-event-id-123
```

**Response:**
```json
{
  "success": true,
  "message": "Interview cancelled and notifications sent"
}
```

---

## Background Jobs (BullMQ Queues)

### Queue: `candidate-scoring`
**Trigger:** Automatic after resume upload  
**Worker:** `workers/candidate-scoring.worker.ts`

**Job Data:**
```json
{
  "applicationId": "app-123",
  "candidateId": "cand-456",
  "jobId": "job-789"
}
```

**Processing:**
1. Fetch job requirements and candidate data
2. Score resume (40% skills, 30% experience, 20% education, 10% other)
3. Detect red flags (employment gaps, short tenure)
4. Update application with score
5. If score ≥ 60%, send assessment invitation
6. If score ≥ 90%, notify hiring manager

### Queue: `assessment-evaluation`
**Trigger:** Manual or automatic after Phase 1 assessment  
**Worker:** Not yet implemented

**Job Data:**
```json
{
  "assessmentId": "assess-123",
  "candidateId": "cand-456"
}
```

### Queue: `interview-analysis`
**Trigger:** After interview transcript upload  
**Worker:** Not yet implemented

**Job Data:**
```json
{
  "interviewId": "int-123",
  "transcriptUrl": "https://..."
}
```

### Queue: `notifications`
**Trigger:** Various events (application received, assessment ready, interview scheduled)  
**Worker:** Not yet implemented

**Job Data:**
```json
{
  "type": "email",
  "to": "candidate@example.com",
  "subject": "...",
  "body": "..."
}
```

### Queue: `crm-sync`
**Trigger:** Candidate status changes  
**Worker:** Not yet implemented

**Job Data:**
```json
{
  "candidateId": "cand-456",
  "action": "create" | "update",
  "systems": ["workday", "greenhouse"]
}
```

---

## Database Models

### Candidate
```prisma
model Candidate {
  id               String    @id @default(cuid())
  email            String    @unique
  firstName        String
  lastName         String
  phone            String?
  location         String?
  linkedinUrl      String?
  resumeParsedData Json?
  skills           String[]
  experience       Json[]
  education        Json[]
  source           String    // 'linkedin', 'job-board', 'referral'
  applications     Application[]
  assessments      Assessment[]
  interviews       Interview[]
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}
```

### Application
```prisma
model Application {
  id                String    @id @default(cuid())
  candidateId       String
  jobId             String
  stage             String    // Pipeline stage
  resumeScore       Float?
  assessmentScore   Float?
  interviewScore    Float?
  resumeParsed      Boolean   @default(false)
  duplicateChecked  Boolean   @default(false)
  isDuplicate       Boolean   @default(false)
  rejectionReason   String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  candidate         Candidate @relation(...)
  job               Job       @relation(...)
  
  @@unique([candidateId, jobId])
}
```

### Assessment
```prisma
model Assessment {
  id              String    @id @default(cuid())
  candidateId     String
  jobId           String
  phase           Int       // 1 or 2
  questions       Json
  totalQuestions  Int
  maxScore        Int
  score           Float?
  timeLimit       Int       // minutes
  status          String    // 'not-started', 'in-progress', 'completed'
  startedAt       DateTime?
  completedAt     DateTime?
  expiresAt       DateTime
  createdAt       DateTime  @default(now())
  
  candidate       Candidate @relation(...)
  job             Job       @relation(...)
  results         AssessmentResult[]
}
```

### Interview
```prisma
model Interview {
  id              String    @id @default(cuid())
  candidateId     String
  jobId           String
  type            String    // 'ai-phone', 'human-phone', 'video', 'in-person'
  scheduledAt     DateTime
  status          String    // 'scheduled', 'completed', 'cancelled'
  aiGenerated     Boolean   @default(false)
  transcript      String?
  score           Float?
  notes           String?
  analysis        Json?
  calendarEventId String?
  meetingLink     String?
  completedAt     DateTime?
  createdAt       DateTime  @default(now())
  
  candidate       Candidate @relation(...)
  job             Job       @relation(...)
}
```

---

## Error Handling

All API endpoints follow consistent error format:

```json
{
  "error": "Detailed error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Common Error Codes:**
- `MISSING_FIELDS`: Required fields not provided
- `NOT_FOUND`: Resource not found
- `DUPLICATE`: Resource already exists
- `VALIDATION_ERROR`: Input validation failed
- `EXTERNAL_API_ERROR`: Third-party API error
- `INTERNAL_ERROR`: Server error

---

## Rate Limits

**Current:** No rate limiting implemented

**Recommended for Production:**
- 100 requests/minute per IP for public endpoints
- 1000 requests/minute for authenticated users
- Use Redis for rate limit tracking

---

## Webhooks (Future)

### CRM Sync Webhook
**POST** `https://hr-suite.valtara.ai/api/webhooks/crm`

Receive updates from CRM systems when candidate status changes externally.

### Calendar Webhook
**POST** `https://hr-suite.valtara.ai/api/webhooks/calendar`

Receive notifications when calendar events are updated/cancelled.

---

## Next Steps for UI Integration

1. **Update `resume-processing-view.tsx`:**
   ```typescript
   const handleUpload = async (file: File, jobId: string) => {
     const formData = new FormData();
     formData.append('resume', file);
     formData.append('jobId', jobId);
     
     const response = await fetch('/api/applications/upload-resume', {
       method: 'POST',
       body: formData,
     });
     
     const result = await response.json();
     // Handle result
   };
   ```

2. **Update `assessments-view.tsx`:**
   ```typescript
   const startAssessment = async (assessmentId: string) => {
     const response = await fetch(`/api/assessments/${assessmentId}/start`, {
       method: 'POST',
     });
     const data = await response.json();
     // Display questions
   };
   ```

3. **Update `interviews-view.tsx`:**
   ```typescript
   const scheduleInterview = async (data: InterviewData) => {
     const response = await fetch('/api/interviews/schedule', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(data),
     });
     // Handle response
   };
   ```

---

## Testing

Use the provided Postman collection or curl commands to test all endpoints.

**Example Test Flow:**
1. Upload resume → Get application ID
2. Wait for scoring (check application stage)
3. Start assessment → Get questions
4. Submit assessment → Get score
5. Schedule interview → Get calendar event
6. Sync to CRM → Verify external ID
