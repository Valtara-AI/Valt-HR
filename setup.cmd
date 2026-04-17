@echo off
echo ========================================
echo    HR Workflow Assistant Setup
echo ========================================
echo.

REM Check if PostgreSQL and Redis are configured
echo [1/5] Checking environment configuration...
if not exist .env (
    echo ERROR: .env file not found!
    echo Please copy .env.example to .env first
    pause
    exit /b 1
)

REM Check if DATABASE_URL is set
findstr /C:"postgresql://postgres:password@localhost" .env >nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo WARNING: You're using the default DATABASE_URL!
    echo.
    echo You have two options:
    echo.
    echo   OPTION A - Cloud Database ^(Recommended - Takes 5 minutes^)
    echo   1. Go to https://supabase.com/
    echo   2. Create new project ^(free tier^)
    echo   3. Copy connection string from Settings -^> Database
    echo   4. Update DATABASE_URL in .env file
    echo.
    echo   OPTION B - Local PostgreSQL
    echo   1. Download from https://www.postgresql.org/download/windows/
    echo   2. Install and create database: CREATE DATABASE hrwas;
    echo   3. Update DATABASE_URL with your credentials
    echo.
    echo Press Ctrl+C to exit and set up database, or
    pause
)

echo [2/5] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo [3/5] Generating Prisma Client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)

echo.
echo [4/5] Running database migrations...
call npx prisma migrate dev --name init
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Database migration failed!
    echo.
    echo This usually means:
    echo   1. PostgreSQL is not running
    echo   2. DATABASE_URL is incorrect
    echo   3. Database doesn't exist
    echo.
    echo Please check your .env file and try again.
    pause
    exit /b 1
)

echo.
echo [5/5] Setup complete!
echo.
echo ========================================
echo    Setup Successful! 
echo ========================================
echo.
echo Your backend is ready to run!
echo.
echo To start the development server:
echo   npm run dev
echo.
echo Then visit: http://localhost:3000
echo.
echo To test the API:
echo   curl http://localhost:3000/api/health
echo.
echo ========================================
pause
