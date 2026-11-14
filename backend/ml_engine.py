import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings('ignore')
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

class MLEngine:
    def __init__(self):
        self.scaler = None
        self.models = {}
        self.trained_results = {}
        self.best_model_name = None
        self.feature_names = []
        self.target_name = ""
        self.label_encoder = None
        self.classes_ = []
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None

    def train_all_models(self, X, y, feature_names, target_name, label_encoder, test_size=0.2, random_state=42):
        """Train and evaluate Logistic Regression, Decision Tree, Naive Bayes, and SVM."""
        self.feature_names = feature_names
        self.target_name = target_name
        self.label_encoder = label_encoder
        self.classes_ = [str(c) for c in label_encoder.classes_]

        # 80% Train, 20% Test Split (Stratified if multiple classes with >=2 instances)
        try:
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=test_size, random_state=random_state, stratify=y
            )
        except Exception:
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=test_size, random_state=random_state
            )

        # Standard Scaling for numerical stability
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        self.X_train = X_train_scaled
        self.X_test = X_test_scaled
        self.y_train = y_train
        self.y_test = y_test

        # Initialize the 4 mandatory algorithms
        algorithm_configs = {
            "Logistic Regression": {
                "instance": LogisticRegression(max_iter=1000, random_state=random_state),
                "type": "Linear Classifier",
                "uses_scaled": True
            },
            "Decision Tree": {
                "instance": DecisionTreeClassifier(max_depth=6, min_samples_split=4, random_state=random_state),
                "type": "Tree-based Classifier",
                "uses_scaled": False # Trees can use unscaled or scaled; scaled works identically
            },
            "Naive Bayes": {
                "instance": GaussianNB(),
                "type": "Probabilistic Classifier",
                "uses_scaled": True
            },
            "Support Vector Machine (SVM)": {
                "instance": SVC(kernel="rbf", probability=True, random_state=random_state),
                "type": "Kernel-based Classifier",
                "uses_scaled": True
            }
        }

        self.trained_results = {}
        best_f1 = -1.0

        for name, config in algorithm_configs.items():
            clf = config["instance"]
            # Train model on genuine training set
            clf.fit(X_train_scaled, y_train)
            self.models[name] = clf

            # Predict on test set
            y_pred = clf.predict(X_test_scaled)
            
            # Predict probabilities if supported
            if hasattr(clf, "predict_proba"):
                y_proba = clf.predict_proba(X_test_scaled)
            else:
                y_proba = None

            # Calculate real metrics
            acc = float(accuracy_score(y_test, y_pred))
            prec = float(precision_score(y_test, y_pred, average="weighted", zero_division=0))
            rec = float(recall_score(y_test, y_pred, average="weighted", zero_division=0))
            f1 = float(f1_score(y_test, y_pred, average="weighted", zero_division=0))

            # Train accuracy to detect overfitting/generalization
            y_train_pred = clf.predict(X_train_scaled)
            train_acc = float(accuracy_score(y_train, y_train_pred))

            # Confusion Matrix
            cm = confusion_matrix(y_test, y_pred)
            cm_dict = {
                "matrix": cm.tolist(),
                "labels": self.classes_
            }

            # Detailed per-class report
            report_dict = classification_report(y_test, y_pred, target_names=self.classes_, output_dict=True, zero_division=0)

            # Feature importance if available
            importance = {}
            if name == "Decision Tree" and hasattr(clf, "feature_importances_"):
                for feat, imp in zip(self.feature_names, clf.feature_importances_):
                    importance[feat] = round(float(imp), 4)
            elif name == "Logistic Regression" and hasattr(clf, "coef_"):
                # For multiclass, take mean absolute coef across classes
                coef_abs = np.mean(np.abs(clf.coef_), axis=0) if clf.coef_.ndim > 1 else np.abs(clf.coef_[0])
                # Normalize to sum 1
                coef_sum = np.sum(coef_abs) if np.sum(coef_abs) > 0 else 1.0
                for feat, imp in zip(self.feature_names, coef_abs / coef_sum):
                    importance[feat] = round(float(imp), 4)

            self.trained_results[name] = {
                "name": name,
                "type": config["type"],
                "accuracy": round(acc, 4),
                "accuracy_percentage": round(acc * 100, 2),
                "train_accuracy_percentage": round(train_acc * 100, 2),
                "precision": round(prec, 4),
                "precision_percentage": round(prec * 100, 2),
                "recall": round(rec, 4),
                "recall_percentage": round(rec * 100, 2),
                "f1_score": round(f1, 4),
                "f1_score_percentage": round(f1 * 100, 2),
                "confusion_matrix": cm_dict,
                "classification_report": report_dict,
                "feature_importance": importance,
                "test_samples": len(y_test),
                "train_samples": len(y_train)
            }

            # Determine best model based on F1 Score and Accuracy
            if f1 > best_f1:
                best_f1 = f1
                self.best_model_name = name

        return {
            "models": self.trained_results,
            "best_model": self.best_model_name,
            "best_model_metrics": self.trained_results[self.best_model_name],
            "feature_names": self.feature_names,
            "target_classes": self.classes_,
            "total_test_samples": len(y_test),
            "total_train_samples": len(y_train)
        }

    def predict_single(self, input_features: dict, model_name: str = None):
        """Make real-time prediction for a single student."""
        if not self.models:
            raise ValueError("No models trained yet. Please train models first.")

        chosen_model_name = model_name if (model_name and model_name in self.models) else self.best_model_name
        model = self.models[chosen_model_name]

        # Prepare feature vector matching training columns
        feat_vector = []
        for feat in self.feature_names:
            val = input_features.get(feat, 0.0)
            try:
                feat_vector.append(float(val))
            except (ValueError, TypeError):
                feat_vector.append(0.0)

        X_input = np.array([feat_vector])
        X_input_scaled = self.scaler.transform(X_input)

        pred_idx = model.predict(X_input_scaled)[0]
        predicted_label = self.label_encoder.inverse_transform([pred_idx])[0]

        # Get probabilities
        confidence = 0.0
        prob_breakdown = {}
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(X_input_scaled)[0]
            confidence = float(np.max(probs))
            for cls_name, p in zip(self.classes_, probs):
                prob_breakdown[cls_name] = round(float(p) * 100, 2)
        else:
            confidence = 1.0
            prob_breakdown[str(predicted_label)] = 100.0

        # Risk Analysis & Explainability
        risk_info = self._analyze_risk_factors(input_features, predicted_label, confidence)

        return {
            "model_used": chosen_model_name,
            "predicted_result": str(predicted_label),
            "confidence_percentage": round(confidence * 100, 2),
            "probability_breakdown": prob_breakdown,
            "input_features": input_features,
            "risk_assessment": risk_info
        }

    def _analyze_risk_factors(self, features: dict, predicted_label: str, confidence: float):
        """Analyze individual risk factors and produce teacher interventions."""
        pred_lower = str(predicted_label).strip().lower()
        is_fail_or_low = pred_lower in ["fail", "f", "low", "critical", "poor", "at-risk", "at risk"]

        study_hours = float(features.get("Study_Hours", features.get("study_hours", 3.0)))
        attendance = float(features.get("Attendance", features.get("attendance", 75.0)))
        prev_marks = float(features.get("Previous_Marks", features.get("previous_marks", 60.0)))
        assignments = float(features.get("Assignments", features.get("assignments", 15.0)))
        internal = float(features.get("Internal_Marks", features.get("internal_marks", 15.0)))

        risk_score = 0
        risk_factors = []
        teacher_recommendations = []

        # Attendance Check
        if attendance < 65.0:
            risk_score += 35
            risk_factors.append(f"Severe attendance deficit: {attendance}% (mandatory minimum is 75%).")
            teacher_recommendations.append("Conduct an immediate parent-teacher attendance meeting and assign mandatory remedial sessions.")
        elif attendance < 75.0:
            risk_score += 18
            risk_factors.append(f"Borderline attendance: {attendance}% is below recommended threshold.")
            teacher_recommendations.append("Issue attendance alert notice and monitor weekly class participation.")

        # Study Hours Check
        if study_hours < 2.0:
            risk_score += 25
            risk_factors.append(f"Critical study deficit: {study_hours} hrs/day is insufficient for course requirements.")
            teacher_recommendations.append("Provide a structured daily study schedule and time-management counseling.")
        elif study_hours < 3.5:
            risk_score += 12
            risk_factors.append(f"Below average study time: {study_hours} hrs/day.")
            teacher_recommendations.append("Encourage student to attend peer study groups and library study hours.")

        # Previous Marks Check
        if prev_marks < 40.0:
            risk_score += 25
            risk_factors.append(f"Weak academic foundation: Previous marks {prev_marks}/100 indicate high vulnerability.")
            teacher_recommendations.append("Assign foundational prerequisite review modules and pair with a high-performing student mentor.")
        elif prev_marks < 55.0:
            risk_score += 10
            risk_factors.append(f"Moderate prior performance: {prev_marks}/100.")
            teacher_recommendations.append("Review weak topic areas from past semester examinations.")

        # Internal Assessment & Assignments Check
        if internal < 10.0:
            risk_score += 15
            risk_factors.append(f"Low internal assessment score: {internal}/25.")
            teacher_recommendations.append("Offer a re-test opportunity or supplementary quiz to recover internal marks.")

        if assignments < 10.0:
            risk_score += 12
            risk_factors.append(f"Poor assignment submission performance: {assignments}/25.")
            teacher_recommendations.append("Enforce strict assignment milestone deadlines with weekly progress reviews.")

        if is_fail_or_low:
            risk_score = max(risk_score, 65)

        # Categorize overall risk level
        if risk_score >= 60 or is_fail_or_low:
            level = "High / Critical Risk"
            badge_color = "red"
            is_at_risk = True
        elif risk_score >= 30:
            level = "Medium / Moderate Risk"
            badge_color = "yellow"
            is_at_risk = True
        else:
            level = "Low Risk / Safe"
            badge_color = "green"
            is_at_risk = False

        if not teacher_recommendations:
            teacher_recommendations.append("Student demonstrates solid academic momentum. Encourage participation in advanced seminars or honors projects.")

        return {
            "risk_score": min(risk_score, 100),
            "risk_level": level,
            "badge_color": badge_color,
            "is_at_risk": is_at_risk,
            "contributing_factors": risk_factors if risk_factors else ["No major academic risk factors detected."],
            "teacher_recommendations": teacher_recommendations
        }

    def predict_batch(self, df_input: pd.DataFrame, model_name: str = None):
        """Predict results for an entire table of students and flag at-risk records."""
        if not self.models:
            raise ValueError("No models trained yet.")

        chosen_model_name = model_name if (model_name and model_name in self.models) else self.best_model_name
        model = self.models[chosen_model_name]

        df = df_input.copy()
        
        # Verify feature columns exist
        missing_cols = [c for c in self.feature_names if c not in df.columns]
        if missing_cols:
            raise ValueError(f"Batch dataset missing required features: {missing_cols}")

        # Safely convert to numeric float matrix
        feature_matrix = []
        for feat in self.feature_names:
            series_num = pd.to_numeric(df[feat], errors='coerce').fillna(0.0).values
            feature_matrix.append(series_num)
        
        X_batch = np.column_stack(feature_matrix)
        X_batch_scaled = self.scaler.transform(X_batch)

        preds = model.predict(X_batch_scaled)
        pred_labels = self.label_encoder.inverse_transform(preds)

        confidences = []
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(X_batch_scaled)
            confidences = [round(float(np.max(p)) * 100, 1) for p in probs]
        else:
            confidences = [100.0] * len(df)

        df["Predicted_Result"] = pred_labels
        df["Confidence_%"] = confidences

        risk_levels = []
        is_at_risk_list = []
        primary_risk_factors = []

        for idx, row in df.iterrows():
            row_dict = row.to_dict()
            pred_lbl = str(row["Predicted_Result"])
            conf = row["Confidence_%"]
            risk_meta = self._analyze_risk_factors(row_dict, pred_lbl, conf)
            risk_levels.append(risk_meta["risk_level"])
            is_at_risk_list.append(risk_meta["is_at_risk"])
            primary_risk_factors.append("; ".join(risk_meta["contributing_factors"][:2]))

        df["Risk_Level"] = risk_levels
        df["Is_At_Risk"] = is_at_risk_list
        df["Primary_Risk_Factors"] = primary_risk_factors

        at_risk_count = sum(is_at_risk_list)
        total_count = len(df)

        return {
            "total_students": total_count,
            "at_risk_count": int(at_risk_count),
            "safe_count": int(total_count - at_risk_count),
            "model_used": chosen_model_name,
            "results": df.replace({np.nan: None}).to_dict(orient="records")
        }
