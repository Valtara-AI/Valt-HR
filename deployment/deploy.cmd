@echo off
REM Deployment script for HR Suite on Windows
REM Run this from the project root (d:\hrwas)

echo ========================================
echo HR Suite Deployment Script
echo Server: 91.98.203.231
echo Domain: hr-suite.valtara.ai
echo ========================================
echo.

SET SSH_KEY=C:\Users\SHIVAM\Downloads\Francis\ubuntu-ky.pem
SET SERVER_USER=ubuntu
SET SERVER_IP=91.98.203.231
SET APP_DIR=/home/ubuntu/hr-suite

echo Step 1: Creating deployment package...
tar -czf hr-suite-deploy.tar.gz --exclude=node_modules --exclude=.git --exclude=*.log --exclude=.next --exclude=deployment *
if %errorlevel% neq 0 (
    echo Error creating deployment package
    exit /b 1
)
echo ✓ Package created: hr-suite-deploy.tar.gz
echo.

echo Step 2: Uploading to server...
scp -i %SSH_KEY% hr-suite-deploy.tar.gz %SERVER_USER%@%SERVER_IP%:/home/ubuntu/
if %errorlevel% neq 0 (
    echo Error uploading to server
    exit /b 1
)
echo ✓ Upload complete
echo.

echo Step 3: Deploying on server...
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "cd /home/ubuntu && rm -rf hr-suite-old && mv hr-suite hr-suite-old 2>/dev/null; mkdir -p hr-suite && tar -xzf hr-suite-deploy.tar.gz -C hr-suite && cd hr-suite && npm ci --production && npm run build && pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js && pm2 save"
if %errorlevel% neq 0 (
    echo Error during deployment
    echo Rolling back...
    ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "cd /home/ubuntu && rm -rf hr-suite && mv hr-suite-old hr-suite && pm2 restart hr-suite"
    exit /b 1
)
echo ✓ Deployment complete
echo.

echo Step 4: Cleaning up...
del hr-suite-deploy.tar.gz
ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "rm /home/ubuntu/hr-suite-deploy.tar.gz && rm -rf /home/ubuntu/hr-suite-old"
echo ✓ Cleanup complete
echo.

echo ========================================
echo Deployment successful!
echo ========================================
echo Visit: https://hr-suite.valtara.ai
echo.
echo Check status: ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 status"
echo View logs: ssh -i %SSH_KEY% %SERVER_USER%@%SERVER_IP% "pm2 logs hr-suite"
echo.

pause
