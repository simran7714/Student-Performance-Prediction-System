import numpy as np
import pandas as pd

class EDAEngine:
    def __init__(self):
        pass

    def generate_eda(self, df: pd.DataFrame, target_col: str, feature_cols: list, id_cols: list = None):
        """Generate comprehensive exploratory data analysis data for the frontend."""
        if df is None or df.empty:
            raise ValueError("No data available for EDA.")

        if id_cols is None:
            id_cols = []

        # 1. Summary Statistics for Numeric Columns
        numeric_cols = [c for c in df.columns if pd.api.types.is_numeric_dtype(df[c]) and c not in id_cols]
        stats = {}
        for col in numeric_cols:
            s = df[col].dropna()
            stats[col] = {
                "mean": round(float(s.mean()), 2),
                "std": round(float(s.std()), 2),
                "min": round(float(s.min()), 2),
                "max": round(float(s.max()), 2),
                "median": round(float(s.median()), 2),
                "q25": round(float(s.quantile(0.25)), 2),
                "q75": round(float(s.quantile(0.75)), 2),
                "count": int(s.count())
            }

        # 2. Target Variable Distribution
        target_counts = df[target_col].value_counts().to_dict() if target_col in df.columns else {}
        target_dist = {
            "labels": [str(k) for k in target_counts.keys()],
            "counts": [int(v) for v in target_counts.values()],
            "percentages": [round((v / len(df)) * 100, 1) for v in target_counts.values()]
        }

        # 3. Correlation Matrix (Numeric Features)
        corr_matrix = {}
        if len(numeric_cols) > 1:
            corr_df = df[numeric_cols].corr().fillna(0)
            corr_matrix = {
                "features": numeric_cols,
                "values": [[round(float(val), 3) for val in row] for row in corr_df.values]
            }

        # 4. Study Hours vs Marks Scatter Data
        # Pick relevant marks column (Previous_Marks, Internal_Marks, Final_Score, etc.)
        marks_col = next((c for c in ["Previous_Marks", "Final_Score", "Internal_Marks", "Assignments"] if c in df.columns), None)
        study_col = next((c for c in ["Study_Hours", "study_hours"] if c in df.columns), None)
        study_vs_marks = []
        if study_col and marks_col:
            sample_df = df.sample(min(250, len(df)), random_state=42) if len(df) > 250 else df
            for _, r in sample_df.iterrows():
                study_vs_marks.append({
                    "x": round(float(r[study_col]), 1),
                    "y": round(float(r[marks_col]), 1),
                    "target": str(r[target_col]) if target_col in df.columns else "N/A"
                })

        # 5. Attendance vs Marks Scatter Data
        att_col = next((c for c in ["Attendance", "attendance"] if c in df.columns), None)
        att_vs_marks = []
        if att_col and marks_col:
            sample_df = df.sample(min(250, len(df)), random_state=42) if len(df) > 250 else df
            for _, r in sample_df.iterrows():
                att_vs_marks.append({
                    "x": round(float(r[att_col]), 1),
                    "y": round(float(r[marks_col]), 1),
                    "target": str(r[target_col]) if target_col in df.columns else "N/A"
                })

        # 6. Grouped Aggregates by Target Class
        # E.g. average study hours, attendance, previous marks for Pass vs Fail
        grouped_by_target = {}
        if target_col in df.columns:
            for cls_val, group in df.groupby(target_col):
                cls_str = str(cls_val)
                grouped_by_target[cls_str] = {
                    "count": len(group),
                    "avg_attendance": round(float(group[att_col].mean()), 1) if att_col in group else 0.0,
                    "avg_study_hours": round(float(group[study_col].mean()), 1) if study_col in group else 0.0,
                    "avg_prev_marks": round(float(group["Previous_Marks"].mean()), 1) if "Previous_Marks" in group else 0.0,
                    "avg_internal_marks": round(float(group["Internal_Marks"].mean()), 1) if "Internal_Marks" in group else 0.0,
                    "avg_assignments": round(float(group["Assignments"].mean()), 1) if "Assignments" in group else 0.0
                }

        # 7. Distribution Histograms / Bins for key features
        histograms = {}
        for col in [study_col, att_col, marks_col]:
            if col and col in df.columns:
                counts, bin_edges = np.histogram(df[col].dropna(), bins=8)
                bin_labels = [f"{round(bin_edges[i], 1)}-{round(bin_edges[i+1], 1)}" for i in range(len(counts))]
                histograms[col] = {
                    "bins": bin_labels,
                    "counts": [int(c) for c in counts]
                }

        return {
            "total_records": len(df),
            "target_column": target_col,
            "target_distribution": target_dist,
            "summary_statistics": stats,
            "correlation_matrix": corr_matrix,
            "study_vs_marks": study_vs_marks,
            "attendance_vs_marks": att_vs_marks,
            "grouped_by_target": grouped_by_target,
            "histograms": histograms,
            "marks_column_used": marks_col,
            "study_column_used": study_col,
            "attendance_column_used": att_col
        }
