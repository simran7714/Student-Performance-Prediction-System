import os
import io
import datetime
mpl_cache_dir = os.path.join(os.path.dirname(__file__), ".mplcache")
os.makedirs(mpl_cache_dir, exist_ok=True)
os.environ["MPLCONFIGDIR"] = mpl_cache_dir
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
    KeepTogether,
    HRFlowable
)

class ReportGenerator:
    def __init__(self):
        pass

    def _generate_comparison_chart(self, models_dict: dict) -> io.BytesIO:
        """Generate a Matplotlib comparison bar chart for Accuracy & F1-Score."""
        names = list(models_dict.keys())
        accs = [models_dict[m]["accuracy_percentage"] for m in names]
        f1s = [models_dict[m]["f1_score_percentage"] for m in names]

        x = np.arange(len(names))
        width = 0.35

        fig, ax = plt.subplots(figsize=(7.5, 3.2), dpi=200)
        fig.patch.set_facecolor("#ffffff")
        ax.set_facecolor("#f8fafc")

        rects1 = ax.bar(x - width/2, accs, width, label="Accuracy (%)", color="#3b82f6", edgecolor="#1d4ed8")
        rects2 = ax.bar(x + width/2, f1s, width, label="F1-Score (%)", color="#10b981", edgecolor="#047857")

        ax.set_ylabel("Score (%)", fontsize=10, fontweight="bold", color="#1e293b")
        ax.set_title("Machine Learning Models Performance Comparison", fontsize=12, fontweight="bold", color="#0f172a", pad=12)
        ax.set_xticks(x)
        ax.set_xticklabels(names, fontsize=9, fontweight="semibold", color="#334155")
        ax.set_ylim(0, 110)
        ax.grid(axis="y", linestyle="--", alpha=0.5)
        ax.legend(frameon=True, facecolor="white")

        # Value labels above bars
        def autolabel(rects):
            for rect in rects:
                height = rect.get_height()
                ax.annotate(f"{height:.1f}%",
                            xy=(rect.get_x() + rect.get_width() / 2, height),
                            xytext=(0, 3),
                            textcoords="offset points",
                            ha="center", va="bottom", fontsize=8, fontweight="bold", color="#1e293b")

        autolabel(rects1)
        autolabel(rects2)
        plt.tight_layout()

        buf = io.BytesIO()
        plt.savefig(buf, format="png", bbox_inches="tight")
        plt.close(fig)
        buf.seek(0)
        return buf

    def _generate_confusion_matrix_chart(self, cm_dict: dict, model_name: str) -> io.BytesIO:
        """Generate a confusion matrix heatmap image."""
        matrix = np.array(cm_dict["matrix"])
        labels = cm_dict["labels"]

        fig, ax = plt.subplots(figsize=(4.0, 3.0), dpi=200)
        sns.heatmap(matrix, annot=True, fmt="d", cmap="Blues", cbar=False,
                    xticklabels=labels, yticklabels=labels, ax=ax, annot_kws={"fontsize": 11, "fontweight": "bold"})
        ax.set_title(f"Confusion Matrix ({model_name})", fontsize=10, fontweight="bold", color="#0f172a", pad=8)
        ax.set_xlabel("Predicted Class", fontsize=9, fontweight="bold", color="#334155")
        ax.set_ylabel("Actual Class", fontsize=9, fontweight="bold", color="#334155")
        plt.tight_layout()

        buf = io.BytesIO()
        plt.savefig(buf, format="png", bbox_inches="tight")
        plt.close(fig)
        buf.seek(0)
        return buf

    def generate_pdf_report(self,
                            prep_summary: dict,
                            models_summary: dict,
                            eda_summary: dict,
                            at_risk_list: list = None) -> bytes:
        """Create an academic PDF report with metrics, charts, and recommendations."""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()

        # Custom styles
        header_title = ParagraphStyle(
            "HeaderTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=18,
            textColor=colors.HexColor("#1e3a8a"),
            alignment=1, # Center
            spaceAfter=4
        )
        tagline_style = ParagraphStyle(
            "TaglineStyle",
            parent=styles["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=11,
            textColor=colors.HexColor("#3b82f6"),
            alignment=1,
            spaceAfter=12
        )
        section_heading = ParagraphStyle(
            "SectionHeading",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=12,
            textColor=colors.HexColor("#0f172a"),
            spaceBefore=10,
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#334155")
        )
        meta_style = ParagraphStyle(
            "Meta",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8,
            textColor=colors.HexColor("#64748b"),
            alignment=1,
            spaceAfter=8
        )

        story = []

        # 1. Header & Title
        story.append(Paragraph("Student Performance Prediction System", header_title))
        story.append(Paragraph('"Analyze Student Performance. Predict Academic Success."', tagline_style))
        now_str = datetime.datetime.now().strftime("%B %d, %Y - %I:%M %p")
        story.append(Paragraph(f"Minor Academic Project Report | Machine Learning & Educational Analytics | Generated: {now_str}", meta_style))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1e3a8a"), spaceAfter=10))

        # 2. Executive Summary
        story.append(Paragraph("1. Executive Summary", section_heading))
        cleaned_rows = prep_summary.get("cleaned_rows", 0)
        target_col = prep_summary.get("target_column", "Final_Result")
        best_model = models_summary.get("best_model", "Best ML Model")
        best_acc = models_summary.get("best_model_metrics", {}).get("accuracy_percentage", 0.0)

        exec_text = (
            f"This academic report summarizes the machine learning pipeline applied to <b>{cleaned_rows} student records</b>. "
            f"The primary target variable investigated is <b>{target_col}</b>. Four standard classification algorithms "
            f"(Logistic Regression, Decision Tree, Naive Bayes, Support Vector Machine) were evaluated across 80% training "
            f"and 20% independent testing partitions. The highest performing model is <b>{best_model}</b>, reaching an "
            f"overall classification accuracy of <b>{best_acc}%</b>."
        )
        story.append(Paragraph(exec_text, body_style))
        story.append(Spacer(1, 8))

        # 3. Dataset Preprocessing Summary Table
        story.append(Paragraph("2. Dataset Validation & Preprocessing Audit", section_heading))
        prep_data = [
            ["Metric / Parameter", "Value", "Metric / Parameter", "Value"],
            ["Total Records", str(prep_summary.get("initial_rows", "N/A")), "Missing Values Imputed", str(prep_summary.get("missing_values_handled", 0))],
            ["Validated Records", str(cleaned_rows), "Duplicates Dropped", str(prep_summary.get("duplicates_removed", 0))],
            ["Target Variable", str(target_col), "Feature Count", str(len(prep_summary.get("feature_columns", [])))],
            ["Class Distribution", ", ".join([f"{k}: {v}" for k, v in prep_summary.get("class_distribution", {}).items()]), "Scaling Method", "StandardScaler (Z-Score)"]
        ]
        t_prep = Table(prep_data, colWidths=[130, 140, 130, 140])
        t_prep.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor("#0f172a")),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(t_prep)
        story.append(Spacer(1, 10))

        # 4. Model Comparison Table
        story.append(Paragraph("3. Machine Learning Model Performance Comparison", section_heading))
        models_data = [
            ["Model Algorithm", "Model Family", "Accuracy (%)", "Precision (%)", "Recall (%)", "F1-Score (%)"]
        ]
        models_dict = models_summary.get("models", {})
        for name, m in models_dict.items():
            star = " (Best)" if name == best_model else ""
            models_data.append([
                f"{name}{star}",
                m.get("type", "Classifier"),
                f"{m.get('accuracy_percentage', 0.0):.2f}%",
                f"{m.get('precision_percentage', 0.0):.2f}%",
                f"{m.get('recall_percentage', 0.0):.2f}%",
                f"{m.get('f1_score_percentage', 0.0):.2f}%"
            ])

        t_models = Table(models_data, colWidths=[140, 120, 70, 70, 70, 70])
        t_models.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1e3a8a")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('ALIGN', (2, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#94a3b8")),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(t_models)
        story.append(Spacer(1, 10))

        # 5. Charts (Comparison bar chart & Confusion Matrix)
        story.append(Paragraph("4. Performance Visualizations", section_heading))
        chart_buf = self._generate_comparison_chart(models_dict)
        story.append(Image(chart_buf, width=480, height=200))
        story.append(Spacer(1, 10))

        # 6. Early Warning System & At-Risk Students
        story.append(Paragraph("5. Early Warning Identification & Intervention Roster", section_heading))
        if at_risk_list and len(at_risk_list) > 0:
            at_risk_data = [
                ["Student ID", "Attendance", "Study Hrs", "Prev Marks", "Predicted", "Risk Severity"]
            ]
            for student in at_risk_list[:12]: # Top 12 at risk for printable brevity
                at_risk_data.append([
                    str(student.get("Student_ID", student.get("Name", "Student"))),
                    f"{student.get('Attendance', 'N/A')}%",
                    f"{student.get('Study_Hours', 'N/A')}h",
                    f"{student.get('Previous_Marks', 'N/A')}",
                    str(student.get("Predicted_Result", "Fail")),
                    str(student.get("Risk_Level", "Critical"))
                ])
            t_risk = Table(at_risk_data, colWidths=[90, 80, 80, 80, 100, 110])
            t_risk.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#dc2626")),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 8),
                ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#fca5a5")),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
                ('TOPPADDING', (0, 0), (-1, -1), 3),
            ]))
            story.append(t_risk)
        else:
            story.append(Paragraph("No critical at-risk students were detected in the primary threshold scan.", body_style))

        story.append(Spacer(1, 10))

        # 7. Actionable Teacher Interventions & Recommendations
        story.append(Paragraph("6. Prescribed Teacher Interventions & Preventative Actions", section_heading))
        recommendations = [
            "<b>Attendance Reinforcement:</b> Students maintaining <75% attendance should undergo mandatory weekly attendance review meetings with academic advisors.",
            "<b>Remedial Subject Coaching:</b> Pair students with internal marks <12/25 with high-achieving peer mentors for targeted problem-solving tutorials.",
            "<b>Structured Study Plans:</b> Guide students reporting <2.5 study hours per day into scheduled library sessions and guided assignment clinics.",
            "<b>Continuous Diagnostic Testing:</b> Conduct low-stakes bi-weekly quizzes to detect learning gaps prior to final semester examinations."
        ]
        for rec in recommendations:
            story.append(Paragraph(f"• {rec}", body_style))
            story.append(Spacer(1, 3))

        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()
