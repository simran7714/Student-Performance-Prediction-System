@echo off
echo =====================================================================
echo  Student Performance Prediction System - Starting Backend (FastAPI)
echo  "Analyze Student Performance. Predict Academic Success."
echo =====================================================================
cd /d "%~dp0backend"
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
pause
