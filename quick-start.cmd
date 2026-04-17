@echo off
REM Quick Start Script for HR Workflow Assistant
REM This script helps you set up the backend

echo.
echo ========================================
echo  HR Workflow Assistant - Quick Start
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo [1/6] Creating .env file from template...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Please edit .env file and add your API keys!
    echo    - DATABASE_URL (PostgreSQL connection string)
    echo    - REDIS_URL (Redis connection string)
    echo    - SENDGRID_API_KEY (for emails)
    echo    - Other API keys as needed
    echo.
    pause
) else (
    echo [1/6] .env file already exists ✓
)

echo.
echo [2/6] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [3/6] Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo [4/6] Running database migrations...
call npx prisma migrate dev --name init
if errorlevel 1 (
    echo ❌ Failed to run migrations
    echo    Make sure PostgreSQL is running and DATABASE_URL is correct in .env
    pause
    exit /b 1
)

echo.
echo [5/6] Seeding database with sample data...
call npx prisma db seed
if errorlevel 1 (
    echo ⚠️  Failed to seed database (this is optional)
    echo    You can continue without sample data
)

echo.
echo [6/6] Setup complete! ✅
echo.
echo ========================================
echo  Next Steps:
echo ========================================
echo.
echo 1. Make sure Redis is running:
echo    redis-server
echo.
echo 2. Start the development server:
echo    npm run dev
echo.
echo 3. In a new terminal, start the worker:
echo    node workers/candidate-scoring.worker.js
echo.
echo 4. Open your browser:
echo    http://localhost:3000
echo.
echo 5. View database (optional):
echo    npx prisma studio
echo    (opens at http://localhost:5555)
echo.
echo ========================================
echo.
pause
