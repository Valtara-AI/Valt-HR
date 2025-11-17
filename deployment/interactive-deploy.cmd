@echo off
SETLOCAL EnableDelayedExpansion

echo ================================================
echo HR Suite Deployment - Interactive Setup
echo ================================================
echo.
echo This script will guide you through deploying your
echo application to hr-suite.valtara.ai (91.98.203.231)
echo.
echo Note: You'll need your server password for SSH/SCP
echo ================================================
echo.

SET SERVER=ubuntu@91.98.203.231
SET APP_DIR=/home/ubuntu/hr-suite

echo [1/10] Testing DNS resolution...
nslookup hr-suite.valtara.ai | findstr "91.98.203.231" > nul
if %errorlevel% EQU 0 (
    echo ✓ DNS configured correctly
) else (
    echo ✗ DNS not pointing to 91.98.203.231
    echo   Please configure DNS first
    pause
    exit /b 1
)
echo.

echo [2/10] Creating deployment package...
cd /d d:\hrwas
if exist hr-suite-deploy.tar.gz del hr-suite-deploy.tar.gz

tar --version > nul 2>&1
if %errorlevel% NEQ 0 (
    echo ✗ tar command not found
    echo   Installing tar is required
    pause
    exit /b 1
)

echo Creating package (excluding node_modules, .git, .next)...
tar -czf hr-suite-deploy.tar.gz --exclude=node_modules --exclude=.git --exclude=*.log --exclude=.next --exclude=test src pages public package.json package-lock.json next.config.js tsconfig.json next-env.d.ts index.html vite.config.ts vitest.config.ts deployment/ecosystem.config.js 2>nul

if exist hr-suite-deploy.tar.gz (
    echo ✓ Package created: hr-suite-deploy.tar.gz
) else (
    echo ✗ Failed to create package
    pause
    exit /b 1
)
echo.

echo [3/10] Uploading package to server...
echo You will be prompted for the server password
echo.
scp hr-suite-deploy.tar.gz %SERVER%:/home/ubuntu/
if %errorlevel% NEQ 0 (
    echo ✗ Upload failed
    echo   Make sure you can SSH to the server with password
    pause
    exit /b 1
)
echo ✓ Upload successful
echo.

echo [4/10] Uploading Nginx configuration...
scp deployment\nginx-hr-suite.conf %SERVER%:/home/ubuntu/
echo.

echo [5/10] Running server setup...
echo You may be prompted for password and sudo password
echo.

echo Creating setup script on server...
ssh %SERVER% "cat > /home/ubuntu/setup-server.sh" < deployment\server-setup.sh

echo Making script executable and running...
ssh %SERVER% "chmod +x /home/ubuntu/setup-server.sh && bash /home/ubuntu/setup-server.sh"

if %errorlevel% NEQ 0 (
    echo ⚠ Server setup had issues
    echo   You may need to run commands manually
    pause
)
echo.

echo [6/10] Extracting and building application...
ssh %SERVER% "cd /home/ubuntu && rm -rf hr-suite-old && mv hr-suite hr-suite-old 2>/dev/null; mkdir -p hr-suite && tar -xzf hr-suite-deploy.tar.gz -C hr-suite"

echo.
echo [7/10] Installing dependencies...
ssh %SERVER% "cd /home/ubuntu/hr-suite && npm ci --production"
echo.

echo [8/10] Building application...
ssh %SERVER% "cd /home/ubuntu/hr-suite && npm run build"
echo.

echo [9/10] Starting with PM2...
echo.
echo ⚠ IMPORTANT: Create .env file first
echo.
echo Run these commands ON THE SERVER:
echo   ssh %SERVER%
echo   cd /home/ubuntu/hr-suite
echo   nano .env
echo   # Add your environment variables (see .env.example)
echo   # Save with Ctrl+X, Y, Enter
echo   chmod 600 .env
echo.
echo Then start the app:
echo   pm2 start ecosystem.config.js
echo   pm2 save
echo   sudo pm2 startup systemd -u ubuntu --hp /home/ubuntu
echo   # Run the command PM2 prints
echo.

set /p CONTINUE="Have you created the .env file? (Y/N): "
if /i "%CONTINUE%" NEQ "Y" (
    echo.
    echo Please create .env file first, then run:
    echo   ssh %SERVER%
    echo   cd /home/ubuntu/hr-suite
    echo   pm2 start ecosystem.config.js
    echo   pm2 save
    goto SSL_SECTION
)

echo Starting application...
ssh %SERVER% "cd /home/ubuntu/hr-suite && pm2 start ecosystem.config.js && pm2 save"
echo.

:SSL_SECTION
echo [10/10] SSL Certificate Setup
echo.
echo To complete deployment with HTTPS, run ON THE SERVER:
echo   ssh %SERVER%
echo   sudo certbot --nginx -d hr-suite.valtara.ai
echo.
echo Follow the prompts:
echo   - Enter your email
echo   - Agree to terms of service
echo   - Choose option 2 to redirect HTTP to HTTPS
echo.

set /p SSL_NOW="Setup SSL now? (Y/N): "
if /i "%SSL_NOW%" EQU "Y" (
    ssh %SERVER% "sudo certbot --nginx -d hr-suite.valtara.ai"
)
echo.

echo ================================================
echo Deployment Complete!
echo ================================================
echo.
echo Your application should be available at:
echo   https://hr-suite.valtara.ai
echo.
echo Verify deployment:
echo   ssh %SERVER% "pm2 status"
echo   ssh %SERVER% "pm2 logs hr-suite --lines 20"
echo   ssh %SERVER% "curl -I http://localhost:3000"
echo.
echo Check in browser:
echo   https://hr-suite.valtara.ai
echo.
echo ================================================
echo.

REM Cleanup
del hr-suite-deploy.tar.gz 2>nul
ssh %SERVER% "rm -f /home/ubuntu/hr-suite-deploy.tar.gz"

echo To update later, run: deployment\deploy.cmd
echo.
pause
