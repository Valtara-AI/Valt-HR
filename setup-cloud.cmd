@echo off
echo ========================================
echo   Quick Cloud Setup Guide
echo ========================================
echo.
echo This script will help you set up cloud services for your backend.
echo It takes about 10 minutes and is FREE for development!
echo.
pause

echo.
echo ========================================
echo STEP 1: Set Up Database (Supabase)
echo ========================================
echo.
echo 1. Open your browser and go to: https://supabase.com/
echo 2. Sign up or log in (free account)
echo 3. Click "New Project"
echo 4. Fill in:
echo    - Name: hrwas
echo    - Database Password: (create a strong password)
echo    - Region: (choose closest to you)
echo 5. Wait 2 minutes for project to be created
echo 6. Go to: Project Settings -^> Database
echo 7. Find "Connection String" section
echo 8. Click "URI" tab
echo 9. Copy the connection string (looks like: postgresql://postgres.[REF]:[PASSWORD]@...)
echo 10. Open .env file in this folder
echo 11. Replace the DATABASE_URL line with your copied string
echo.
echo Press any key when you've updated DATABASE_URL in .env...
pause >nul

echo.
echo ========================================
echo STEP 2: Set Up Redis (Upstash)
echo ========================================
echo.
echo 1. Open: https://upstash.com/
echo 2. Sign up or log in (free account)
echo 3. Click "Create Database"
echo 4. Fill in:
echo    - Name: hrwas-redis
echo    - Type: Regional
echo    - Region: (choose closest to you)
echo 5. Click "Create"
echo 6. On the database page, find "REST API" section
echo 7. Copy the "UPSTASH_REDIS_REST_URL" (looks like: redis://...)
echo 8. Open .env file
echo 9. Replace the REDIS_URL line with your copied URL
echo.
echo Press any key when you've updated REDIS_URL in .env...
pause >nul

echo.
echo ========================================
echo STEP 3: Verify Configuration
echo ========================================
echo.
echo Let me check your .env file...
echo.

findstr /C:"supabase.com" .env >nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ DATABASE_URL appears to be configured for Supabase
) else (
    findstr /C:"postgresql://postgres:password@localhost" .env >nul
    if %ERRORLEVEL% EQU 0 (
        echo ✗ DATABASE_URL still has default value!
        echo   Please update it with your Supabase connection string.
        pause
        exit /b 1
    )
)

findstr /C:"upstash.io" .env >nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ REDIS_URL appears to be configured for Upstash
) else (
    findstr /C:"redis://localhost:6379" .env >nul
    if %ERRORLEVEL% EQU 0 (
        echo ✗ REDIS_URL still has default value!
        echo   Please update it with your Upstash Redis URL.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo STEP 4: Run Setup
echo ========================================
echo.
echo Configuration looks good! Ready to run setup.
echo This will:
echo   1. Install dependencies
echo   2. Generate Prisma client
echo   3. Create database tables
echo.
pause

call setup.cmd

echo.
echo ========================================
echo   All Done! 
echo ========================================
echo.
echo Your cloud backend is ready!
echo.
echo Next steps:
echo   1. Run: npm run dev
echo   2. Visit: http://localhost:3000
echo   3. Test API: curl http://localhost:3000/api/health
echo.
echo For more info, see NEXT_STEPS.md
echo.
pause
