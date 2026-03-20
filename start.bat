@echo off
chcp 65001 >nul
title enStudy - 英文每日練習系統

echo ====================================
echo   enStudy - 英文每日練習系統
echo ====================================
echo.

:: 檢查 node 是否安裝
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [錯誤] 找不到 Node.js，請先安裝 Node.js
    pause
    exit /b 1
)

:: 檢查是否已安裝依賴
if not exist "node_modules" (
    echo [安裝] 正在安裝根目錄依賴...
    call npm install
)
if not exist "server\node_modules" (
    echo [安裝] 正在安裝 server 依賴...
    cd server && call npm install && cd ..
)
if not exist "client\node_modules" (
    echo [安裝] 正在安裝 client 依賴...
    cd client && call npm install && cd ..
)

echo.
echo [啟動] 後端 http://localhost:3001
echo [啟動] 前端 http://localhost:3000
echo.
echo 按 Ctrl+C 可停止所有服務
echo ====================================
echo.

npm run dev
