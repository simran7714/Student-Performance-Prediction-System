import os
import io
import pandas as pd
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse

from data_processor import DataProcessor
from ml_engine import MLEngine
from eda_engine import EDAEngine
from report_generator import ReportGenerator

app = FastAPI(
    title="Student Performance Prediction API",
    description="Machine Learning and Educational Analytics API for Student Performance Prediction",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite dev server and production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global State for active session
data_processor = DataProcessor()
ml_engine = MLEngine()
eda_engine = EDAEngine()
report_generator = ReportGenerator()

active_dataset_name = "None"
active_eda_cache = None
active_models_cache = None
active_batch_results = None

SAMPLE_DATA_DIR = os.path.join(os.path.dirname(__file__), "sample_data")

@app.on_event("startup")
def startup_event():
    """Load default Pass/Fail sample dataset and train models on startup."""
    global active_dataset_name, active_eda_cache, active_models_cache
    default_sample_path = os.path.join(SAMPLE_DATA_DIR, "student_performance_pass_fail.csv")
    if os.path.exists(default_sample_path):
        try:
            data_processor.load_from_path(default_sample_path)
            prep_summary = data_processor.preprocess()
            active_dataset_name = "student_performance_pass_fail.csv"
            
            # Generate initial EDA
            active_eda_cache = eda_engine.generate_eda(
                df=data_processor.raw_df,
                target_col=data_processor.target_col,
                feature_cols=data_processor.feature_cols,
                id_cols=data_processor.id_cols
            )

            # Train models automatically on startup
            X, y, feats, target, le = data_processor.get_feature_matrix_and_target()
            active_models_cache = ml_engine.train_all_models(X, y, feats, target, le)
            print("Startup: Successfully initialized and trained baseline ML models.")
        except Exception as e:
            print(f"Startup Warning: Could not auto-train baseline: {e}")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "active_dataset": active_dataset_name,
        "is_trained": len(ml_engine.models) > 0,
        "best_model": ml_engine.best_model_name
    }

@app.post("/api/dataset/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    target_column: Optional[str] = Form(None)
):
    """Upload custom CSV or Excel dataset, preprocess, and prepare for training."""
    global active_dataset_name, active_eda_cache, active_models_cache, active_batch_results
    try:
        contents = await file.read()
        df = data_processor.load_file(contents, file.filename)
        prep_summary = data_processor.preprocess(target_column=target_column)
        active_dataset_name = file.filename
        active_batch_results = None

        # Recompute EDA
        active_eda_cache = eda_engine.generate_eda(
            df=data_processor.raw_df,
            target_col=data_processor.target_col,
            feature_cols=data_processor.feature_cols,
            id_cols=data_processor.id_cols
        )

        # Automatically train models with the new dataset
        X, y, feats, target, le = data_processor.get_feature_matrix_and_target()
        active_models_cache = ml_engine.train_all_models(X, y, feats, target, le)

        preview = data_processor.get_preview(15)

        return {
            "status": "success",
            "filename": file.filename,
            "preprocessing_summary": prep_summary,
            "preview": preview,
            "models_summary": active_models_cache
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/dataset/load-sample")
def load_sample_dataset(sample_type: str = Form("pass_fail")):
    """Load one of the predefined sample datasets: pass_fail, grades, categories."""
    global active_dataset_name, active_eda_cache, active_models_cache, active_batch_results
    mapping = {
        "pass_fail": "student_performance_pass_fail.csv",
        "grades": "student_performance_grades.csv",
        "categories": "student_performance_categories.csv"
    }
    filename = mapping.get(sample_type, "student_performance_pass_fail.csv")
    filepath = os.path.join(SAMPLE_DATA_DIR, filename)

    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Sample dataset file not found.")

    try:
        data_processor.load_from_path(filepath)
        prep_summary = data_processor.preprocess()
        active_dataset_name = filename
        active_batch_results = None

        # Compute EDA
        active_eda_cache = eda_engine.generate_eda(
            df=data_processor.raw_df,
            target_col=data_processor.target_col,
            feature_cols=data_processor.feature_cols,
            id_cols=data_processor.id_cols
        )

        # Train models
        X, y, feats, target, le = data_processor.get_feature_matrix_and_target()
        active_models_cache = ml_engine.train_all_models(X, y, feats, target, le)

        preview = data_processor.get_preview(15)

        return {
            "status": "success",
            "filename": filename,
            "sample_type": sample_type,
            "preprocessing_summary": prep_summary,
            "preview": preview,
            "models_summary": active_models_cache
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/eda")
def get_eda():
    """Retrieve Exploratory Data Analysis metrics, correlations, and distribution curves."""
    global active_eda_cache
    if active_eda_cache is None:
        if data_processor.raw_df is not None:
            active_eda_cache = eda_engine.generate_eda(
                df=data_processor.raw_df,
                target_col=data_processor.target_col,
                feature_cols=data_processor.feature_cols,
                id_cols=data_processor.id_cols
            )
        else:
            raise HTTPException(status_code=400, detail="No dataset loaded. Please upload or load a sample dataset first.")
    return active_eda_cache

@app.post("/api/model/train")
def train_models(test_size: float = Form(0.2)):
    """Retrain the 4 ML models on active dataset with configurable test size."""
    global active_models_cache
    if data_processor.cleaned_df is None:
        raise HTTPException(status_code=400, detail="No preprocessed dataset available.")

    try:
        X, y, feats, target, le = data_processor.get_feature_matrix_and_target()
        active_models_cache = ml_engine.train_all_models(
            X=X,
            y=y,
            feature_names=feats,
            target_name=target,
            label_encoder=le,
            test_size=test_size
        )
        return {
            "status": "success",
            "models_summary": active_models_cache
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/model/summary")
def get_model_summary():
    """Get performance metrics for all 4 models and the identified Best Model."""
    if active_models_cache is None:
        raise HTTPException(status_code=400, detail="Models have not been trained yet.")
    return active_models_cache

@app.post("/api/predict/single")
def predict_single(data: Dict[str, Any]):
    """Predict performance for a single student with risk analysis and recommendations."""
    if not ml_engine.models:
        raise HTTPException(status_code=400, detail="Models not trained yet.")

    model_name = data.get("model_name", None)
    inputs = data.get("features", data)
    try:
        res = ml_engine.predict_single(inputs, model_name=model_name)
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/predict/batch")
async def predict_batch(
    file: UploadFile = File(...),
    model_name: Optional[str] = Form(None)
):
    """Predict results for batch upload of students (CSV/Excel)."""
    global active_batch_results
    if not ml_engine.models:
        raise HTTPException(status_code=400, detail="Models not trained yet.")

    try:
        contents = await file.read()
        filename_lower = file.filename.lower()
        if filename_lower.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))

        batch_output = ml_engine.predict_batch(df, model_name=model_name)
        active_batch_results = batch_output
        return batch_output
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/at-risk/list")
def get_at_risk_students():
    """Identify students at risk from current dataset or batch predictions."""
    if data_processor.raw_df is None:
        raise HTTPException(status_code=400, detail="No active dataset.")

    # If we have batch results, prioritize those
    if active_batch_results and "results" in active_batch_results:
        at_risk_list = [r for r in active_batch_results["results"] if r.get("Is_At_Risk")]
        return {
            "source": "batch_upload",
            "total_at_risk": len(at_risk_list),
            "students": at_risk_list
        }

    # Otherwise evaluate active dataset
    df = data_processor.raw_df.copy()
    try:
        batch_out = ml_engine.predict_batch(df)
        at_risk_list = [r for r in batch_out["results"] if r.get("Is_At_Risk")]
        return {
            "source": active_dataset_name,
            "total_at_risk": len(at_risk_list),
            "total_analyzed": len(df),
            "students": at_risk_list
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/report/download-pdf")
def download_pdf_report():
    """Generate and return the academic PDF report."""
    if active_models_cache is None or data_processor.preprocessing_summary is None:
        raise HTTPException(status_code=400, detail="Please upload data and train models first.")

    try:
        # Fetch at-risk students for the report table
        df = data_processor.raw_df.copy()
        batch_out = ml_engine.predict_batch(df)
        at_risk_list = [r for r in batch_out["results"] if r.get("Is_At_Risk")]

        pdf_bytes = report_generator.generate_pdf_report(
            prep_summary=data_processor.preprocessing_summary,
            models_summary=active_models_cache,
            eda_summary=active_eda_cache or {},
            at_risk_list=at_risk_list
        )

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=Student_Performance_Prediction_Report_{active_dataset_name}.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF Generation failed: {str(e)}")

@app.get("/api/report/download-csv")
def download_csv_predictions():
    """Export predictions and risk flags as CSV."""
    if data_processor.raw_df is None:
        raise HTTPException(status_code=400, detail="No active dataset.")

    try:
        df = data_processor.raw_df.copy()
        batch_out = ml_engine.predict_batch(df)
        pred_df = pd.DataFrame(batch_out["results"])

        csv_buffer = io.StringIO()
        pred_df.to_csv(csv_buffer, index=False)
        csv_buffer.seek(0)

        return StreamingResponse(
            io.BytesIO(csv_buffer.getvalue().encode("utf-8")),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=Predicted_Students_Analytics_{active_dataset_name}.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/samples/download/{filename}")
def download_sample_file(filename: str):
    """Download one of the sample CSV templates."""
    filepath = os.path.join(SAMPLE_DATA_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Sample file not found.")

    with open(filepath, "rb") as f:
        file_bytes = f.read()

    return Response(
        content=file_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
