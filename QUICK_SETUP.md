# Quick Setup Guide

## 🚀 Get Your Backend Running in 10 Minutes

### Step 1: Environment Setup

1. **Copy the example environment file:**
   ```bash
   copy .env.example .env
   ```

2. **Update `.env` with your credentials:**

   **Required for basic functionality:**
   - `DATABASE_URL` - PostgreSQL connection string
   - `REDIS_URL` - Redis connection string (for background jobs)

   **Optional (can add later):**
   - `AFFINDA_API_KEY` - For resume parsing (get free trial at https://app.affinda.com/)
   - `SENDGRID_API_KEY` - For email notifications (free tier available)
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` - For SMS/phone interviews
   - `OPENAI_API_KEY` - For AI-powered assessments

### Step 2: Database Setup

#### Option A: Local PostgreSQL

1. **Install PostgreSQL:**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt install postgresql`

2. **Create database:**
   ```bash
   psql -U postgres
   CREATE DATABASE hr_workflow;
   \q
   ```

3. **Update DATABASE_URL in `.env`:**
   ```
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/hr_workflow"
   ```

#### Option B: Cloud Database (Recommended for Quick Start)

Use a free cloud PostgreSQL database:

**Supabase (Recommended - Free tier available):**
1. Go to https://supabase.com/
2. Create new project
3. Copy the connection string from Settings → Database
4. Paste into `.env` as `DATABASE_URL`

**Neon (Alternative):**
1. Go to https://neon.tech/
2. Create new project
3. Copy connection string
4. Paste into `.env` as `DATABASE_URL`

### Step 3: Redis Setup

#### Option A: Local Redis

1. **Install Redis:**
   - Windows: Download from https://github.com/microsoftarchive/redis/releases
   - Mac: `brew install redis`
   - Linux: `sudo apt install redis`

2. **Start Redis:**
   ```bash
   redis-server
   ```

#### Option B: Cloud Redis (Recommended for Quick Start)

**Upstash (Free tier available):**
1. Go to https://upstash.com/
2. Create Redis database
3. Copy the Redis URL
4. Paste into `.env` as `REDIS_URL`

### Step 4: Run Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Step 5: Start the Application

```bash
npm run dev
```

Your backend is now running at `http://localhost:3000`!

### Step 6: Test the API

**Health check:**
```bash
curl http://localhost:3000/api/health
```

**Upload a test resume:**
```bash
curl -X POST http://localhost:3000/api/applications/upload-resume ^
  -F "resume=@path/to/resume.pdf" ^
  -F "jobId=1" ^
  -F "candidateEmail=test@example.com" ^
  -F "candidateName=Test Candidate"
```

---

## ⚠️ Troubleshooting

**"Database connection failed":**
- Check your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

**"Redis connection failed":**
- Check `REDIS_URL` is correct
- Ensure Redis is running
- Test: `redis-cli ping` (should return PONG)

**"Prisma generate failed":**
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Run `npx prisma generate`

**Port 3000 already in use:**
- Change `PORT=3001` in `.env`
- Or kill the process: 
  - Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
  - Mac/Linux: `lsof -ti:3000 | xargs kill`

---

## 📋 What Works Without External Services

Even without API keys, you can still:
- ✅ Upload resumes (parsing will be limited)
- ✅ Create candidates manually
- ✅ Score candidates (with basic algorithm)
- ✅ Create and manage jobs
- ✅ Track application pipeline
- ✅ Schedule interviews
- ✅ View analytics dashboard

With API keys, you unlock:
- 🔓 Automated resume parsing (Affinda)
- 🔓 Email notifications (SendGrid)
- 🔓 SMS alerts (Twilio)
- 🔓 AI phone interviews (Twilio + OpenAI)
- 🔓 Calendar integration (Google/Microsoft)
- 🔓 CRM syncing (Workday/Greenhouse/BambooHR)

---

## 🎯 Next: Connect to UI

Once your backend is running, update your frontend components to call the real APIs:

1. Update `src/services/apiClient.ts` to use real endpoints
2. Replace mock data in components with API calls
3. Add loading states and error handling

See `BACKEND_IMPLEMENTATION.md` for detailed API documentation.

---

## 🆘 Still Need Help?

1. Check the logs: Look at your terminal for error messages
2. Review `.env`: Ensure all required variables are set
3. Check database: Run `npx prisma studio` to view data
4. Test Redis: Run `redis-cli ping`
5. Verify migrations: Run `npx prisma migrate status`

**Need more detailed setup?** See `SETUP.md` for comprehensive instructions.
