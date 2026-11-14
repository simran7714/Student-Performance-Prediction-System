@echo off
echo ==============================================================================
echo     STUDENT PERFORMANCE PREDICTION SYSTEM USING MACHINE LEARNING
echo     "Analyze Student Performance. Predict Academic Success."
echo     Minor Academic Project in Computer Science and Engineering
echo ==============================================================================
echo.
echo [1/2] Launching Python FastAPI Backend Server on http://127.0.0.1:8000 ...
start "Backend Server (FastAPI)" cmd /c "cd /d "%~dp0backend" && python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Launching React.js Frontend on http://localhost:5173 ...
start "Frontend (Vite React)" cmd /c "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ==============================================================================
echo Application is running!
echo - Frontend:  http://localhost:5173
echo - API Docs:  http://127.0.0.1:8000/docs
echo ==============================================================================
