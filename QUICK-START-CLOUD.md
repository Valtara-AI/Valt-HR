# Quick Start with Cloud Services (No Local Setup Required!)

Since you don't have PostgreSQL and Redis installed locally, you can use free cloud services instead. This is actually easier and better for development!

## Step 1: Set Up Cloud Database (5 minutes)

### Option A: Supabase (Recommended - Free Forever)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up
3. Create a new project:
   - Give it a name: `hr-workflow`
   - Choose a password (save it!)
   - Select region closest to you
   - Wait 2-3 minutes for setup
4. Go to **Settings** → **Database**
5. Scroll down and copy the **Connection String** (URI format)
6. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

### Option B: Neon (Also Free)

1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy the connection string provided

**Paste this connection string into your `.env` file as `DATABASE_URL`**

---

## Step 2: Set Up Cloud Redis (3 minutes)

### Upstash (Free Forever Plan)

1. Go to [upstash.com](https://upstash.com)
2. Sign up and click "Create Database"
3. Choose:
   - Type: **Redis**
   - Name: `hr-workflow-queue`
   - Region: Choose closest to you
   - Keep default settings
4. Click **Create**
5. Copy the **Redis URL** from the database page
6. It will look like: `redis://default:[PASSWORD]@xxx.upstash.io:6379`

**Paste this into your `.env` file as `REDIS_URL`**

---

## Step 3: Set Up Email Service (5 minutes)

### SendGrid (Free - 100 emails/day)

1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up (it's free)
3. Go to **Settings** → **API Keys**
4. Click "Create API Key"
   - Name it: `hr-workflow-dev`
   - Choose **Full Access**
   - Click **Create & View**
5. **Copy the API key immediately** (you can't see it again!)
6. Go to **Settings** → **Sender Authentication**
7. Verify a sender email (use your own email for testing)

**Update your `.env` file:**
```env
SENDGRID_API_KEY="SG.xxxxxxxxxxxxx"
SENDGRID_FROM_EMAIL="your-verified-email@gmail.com"
SENDGRID_FROM_NAME="HR Team"
```

---

## Step 4: Install Dependencies and Run Setup

Open PowerShell or Command Prompt in your project folder and run:

```bash
# Install all packages
npm install

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed with sample data
npx prisma db seed
```

---

## Step 5: Start the Application

### Terminal 1: Start Next.js dev server
```bash
npm run dev
```

### Terminal 2: Start the background worker (optional for now)
```bash
node workers/candidate-scoring.worker.js
```

**Open your browser:** http://localhost:3000

---

## Step 6: Test Everything Works

### Test 1: Check API Health
Open: http://localhost:3000/api/health

Should see: `{"status":"ok"}`

### Test 2: View Sample Data
```bash
npx prisma studio
```

This opens a database viewer at http://localhost:5555

You should see:
- 5 sample jobs
- 3 sample candidates
- 3 sample applications

### Test 3: Test Analytics API

Open in browser:
- http://localhost:3000/api/analytics/recruitment-metrics
- http://localhost:3000/api/analytics/pipeline-status

You should see JSON data with recruitment stats!

---

## Your Complete .env File

Here's what your `.env` should look like after setup:

```env
# Database (from Supabase or Neon)
DATABASE_URL="postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres"

# Redis (from Upstash)
REDIS_URL="redis://default:PASSWORD@xxx.upstash.io:6379"

# Email (from SendGrid)
SENDGRID_API_KEY="SG.xxxxxxxxxxxxx"
SENDGRID_FROM_EMAIL="your-verified-email@gmail.com"
SENDGRID_FROM_NAME="HR Team"

# Authentication (generate a random string)
NEXTAUTH_SECRET="your-random-secret-here-change-this"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Leave these commented out for now
# AFFINDA_API_KEY="your_affinda_key"
# TWILIO_ACCOUNT_SID="your_twilio_sid"
# TWILIO_AUTH_TOKEN="your_twilio_token"
# TWILIO_PHONE_NUMBER="+1234567890"
# OPENAI_API_KEY="your_openai_key"
```

---

## Troubleshooting

### Problem: "Error: P1001: Can't reach database server"
**Solution:** 
- Check DATABASE_URL is correct
- Make sure Supabase project is running
- Try pinging: `npx prisma db pull` to test connection

### Problem: "Redis connection failed"
**Solution:**
- Check REDIS_URL is correct
- Make sure you copied the full URL with password
- Redis is only needed for background workers (optional for testing)

### Problem: Migration fails
**Solution:**
```bash
# Reset and try again
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Problem: Can't send emails
**Solution:**
- Verify your sender email in SendGrid
- Check SendGrid API key is correct
- For testing, you can skip email features initially

---

## What's Next?

Now that your backend is running:

1. ✅ **Backend is functional!**
2. 📊 **View data:** Run `npx prisma studio`
3. 🧪 **Test APIs:** Use the examples in `BACKEND_IMPLEMENTATION.md`
4. 🎨 **Connect UI:** Update React components to use the API client
5. 🚀 **Deploy:** See deployment guide when ready

---

## Quick Commands Reference

```bash
# Start development server
npm run dev

# Start background worker
node workers/candidate-scoring.worker.js

# View database
npx prisma studio

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Generate Prisma client (after schema changes)
npx prisma generate

# Check for errors
npm run typecheck

# Run tests
npm test
```

---

## Free Tier Limits (Plenty for Development!)

- **Supabase:** 500 MB database, unlimited API requests
- **Upstash:** 10,000 commands/day
- **SendGrid:** 100 emails/day

All free tiers are more than enough for development and testing!

---

## Need Help?

Check the main documentation:
- `BACKEND_IMPLEMENTATION.md` - Complete API reference
- `setup-guide.md` - Detailed setup guide
- `API.md` - API documentation

**You're all set! Your backend is now functional! 🎉**
