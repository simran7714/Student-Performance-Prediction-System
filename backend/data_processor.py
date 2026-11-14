import io
import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder

class DataProcessor:
    def __init__(self):
        self.raw_df = None
        self.cleaned_df = None
        self.target_col = None
        self.feature_cols = []
        self.id_cols = []
        self.scaler = None
        self.label_encoder = None
        self.preprocessing_summary = {}

    def load_file(self, file_bytes: bytes, filename: str) -> pd.DataFrame:
        """Load dataset from bytes (CSV or Excel)."""
        filename_lower = filename.lower()
        if filename_lower.endswith(".csv"):
            try:
                df = pd.read_csv(io.BytesIO(file_bytes), encoding="utf-8")
            except UnicodeDecodeError:
                df = pd.read_csv(io.BytesIO(file_bytes), encoding="latin1")
        elif filename_lower.endswith((".xlsx", ".xls")):
            df = pd.read_excel(io.BytesIO(file_bytes))
        else:
            raise ValueError("Unsupported file format. Please upload a CSV or Excel (.xlsx) file.")
        
        self.raw_df = df.copy()
        return df

    def load_from_path(self, filepath: str) -> pd.DataFrame:
        """Load dataset from local file path."""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"File not found: {filepath}")
        if filepath.endswith(".csv"):
            df = pd.read_csv(filepath)
        else:
            df = pd.read_excel(filepath)
        self.raw_df = df.copy()
        return df

    def identify_columns(self, target_column: str = None):
        """Auto-detect ID columns, target column, and feature columns."""
        if self.raw_df is None or self.raw_df.empty:
            raise ValueError("Dataset is empty. Please upload a valid dataset.")

        cols = list(self.raw_df.columns)
        
        # 1. Identify ID/Name and demographic columns to exclude from training
        id_candidates = ["student_id", "id", "roll_no", "roll_number", "rollno", "name", "student_name", "first_name", "last_name", "email", "gender", "sex"]
        self.id_cols = [c for c in cols if c.strip().lower() in id_candidates or "id" in c.lower() or "name" in c.lower()]

        # 2. Identify target column
        if target_column and target_column in cols:
            self.target_col = target_column
        else:
            target_candidates = ["final_result", "result", "grade", "performance_category", "status", "pass_fail", "target", "outcome", "performance"]
            matched_target = None
            for cand in target_candidates:
                for c in cols:
                    if c.strip().lower() == cand:
                        matched_target = c
                        break
                if matched_target:
                    break
            self.target_col = matched_target if matched_target else cols[-1]

        # 3. Identify feature columns (strictly numeric academic features)
        self.feature_cols = [
            c for c in cols
            if c != self.target_col and c not in self.id_cols and pd.api.types.is_numeric_dtype(self.raw_df[c])
        ]
        
        # Fallback if no numeric columns were detected
        if not self.feature_cols:
            self.feature_cols = [c for c in cols if c != self.target_col and c not in self.id_cols]

        return {
            "target_column": self.target_col,
            "feature_columns": self.feature_cols,
            "id_columns": self.id_cols,
            "all_columns": cols
        }

    def preprocess(self, target_column: str = None):
        """Preprocess dataset: missing value imputation, duplicate removal, encoding."""
        if self.raw_df is None:
            raise ValueError("No dataset loaded.")

        self.identify_columns(target_column)
        df = self.raw_df.copy()

        initial_rows = len(df)
        initial_cols = len(df.columns)

        # Check missing values
        missing_counts = df.isnull().sum().to_dict()
        total_missing = sum(missing_counts.values())

        # Check duplicates
        duplicate_count = int(df.duplicated().sum())
        if duplicate_count > 0:
            df = df.drop_duplicates().reset_index(drop=True)

        # Handle missing values in target column
        if self.target_col in df.columns:
            df = df.dropna(subset=[self.target_col]).reset_index(drop=True)

        # Impute missing values for feature columns
        for col in self.feature_cols:
            if df[col].isnull().sum() > 0:
                if pd.api.types.is_numeric_dtype(df[col]):
                    median_val = df[col].median()
                    df[col] = df[col].fillna(median_val)
                else:
                    mode_val = df[col].mode()[0] if not df[col].mode().empty else "Unknown"
                    df[col] = df[col].fillna(mode_val)

        # Identify numeric vs categorical features
        numeric_features = [c for c in self.feature_cols if pd.api.types.is_numeric_dtype(df[c])]
        categorical_features = [c for c in self.feature_cols if not pd.api.types.is_numeric_dtype(df[c])]

        # Target encoding
        self.label_encoder = LabelEncoder()
        df["_target_encoded"] = self.label_encoder.fit_transform(df[self.target_col].astype(str))
        target_classes = [str(cls) for cls in self.label_encoder.classes_]

        # One-hot or label encode categorical features if present
        for cat_col in categorical_features:
            le_cat = LabelEncoder()
            df[cat_col] = le_cat.fit_transform(df[cat_col].astype(str))

        self.cleaned_df = df

        class_distribution = self.raw_df[self.target_col].value_counts().to_dict()
        class_distribution = {str(k): int(v) for k, v in class_distribution.items()}

        self.preprocessing_summary = {
            "initial_rows": initial_rows,
            "cleaned_rows": len(df),
            "initial_columns": initial_cols,
            "target_column": self.target_col,
            "target_classes": target_classes,
            "class_distribution": class_distribution,
            "feature_columns": self.feature_cols,
            "numeric_features": numeric_features,
            "categorical_features": categorical_features,
            "id_columns": self.id_cols,
            "missing_values_handled": total_missing,
            "duplicates_removed": duplicate_count,
            "status": "Success: Dataset preprocessed, validated, and ready for model training."
        }

        return self.preprocessing_summary

    def get_preview(self, n=15):
        """Return preview of dataset as JSON-serializable list of dicts."""
        if self.raw_df is None:
            return []
        preview_df = self.raw_df.head(n).copy()
        # Replace NaN with None for JSON serialization
        preview_df = preview_df.replace({np.nan: None})
        return preview_df.to_dict(orient="records")

    def get_feature_matrix_and_target(self):
        """Return X, y, and column names for training."""
        if self.cleaned_df is None:
            raise ValueError("Data has not been preprocessed yet.")

        X = self.cleaned_df[self.feature_cols].values
        y = self.cleaned_df["_target_encoded"].values
        return X, y, self.feature_cols, self.target_col, self.label_encoder
