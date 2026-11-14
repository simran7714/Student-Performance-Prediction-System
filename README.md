# Student Performance Prediction System Using Machine Learning

> **Tagline:** *"Analyze Student Performance. Predict Academic Success."*  
> **Course / Degree:** Minor Academic Project in Computer Science and Engineering  
> **Domain:** Machine Learning, Educational Analytics, Web Development  

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Problem Statement & Objectives](#problem-statement--objectives)
3. [System Architecture & Workflow](#system-architecture--workflow)
4. [Dataset Description](#dataset-description)
5. [Machine Learning Methodology](#machine-learning-methodology)
6. [Supported Classification Algorithms](#supported-classification-algorithms)
7. [System Modules & Main Website Features](#system-modules--main-website-features)
8. [Technologies Used](#technologies-used)
9. [Project Directory Structure](#project-directory-structure)
10. [Installation & Setup Instructions](#installation--setup-instructions)
11. [Running the Application](#running-the-application)
12. [API Reference Endpoints](#api-reference-endpoints)
13. [Limitations & Future Enhancements](#limitations--future-enhancements)
14. [Academic Viva Questions & Answers](#academic-viva-questions--answers)

---

## 🎯 Project Overview

The **Student Performance Prediction System** is an end-to-end, production-grade web application developed as an academic minor project in Computer Science and Engineering. It leverages advanced Machine Learning and Educational Analytics to predict student academic outcomes (Pass/Fail, Grades A–F, or Performance Tiers) using key academic indicators such as:
- Class Attendance Percentage
- Daily Self-Study Hours
- Previous Semester / Examination Marks
- Internal Assessment Scores
- Homework / Assignment Submissions

By processing historical datasets, the system identifies academically vulnerable students **early in the academic semester**, providing faculty advisors and educational institutions with diagnostic insights, risk factor attribution, and prescribed intervention strategies before semester examinations occur.

---

## ⚠️ Problem Statement & Objectives

### Problem Statement
In traditional educational institutions:
- Teachers and mentors cannot easily track individual academic trajectories across large student cohorts.
- Early identification of academically weak students is hindered by delayed manual analysis.
- Remedial decisions are frequently subjective or reactive rather than data-driven.

### Project Objectives
1. **Predict Academic Performance:** Accurately classify student performance outcomes using verified Machine Learning models.
2. **Flexible Target Classification:** Support binary (Pass/Fail), multi-class (Letter Grades A–F), and tier-based (High/Medium/Low) performance targets.
3. **Early Warning System (EWS):** Pinpoint at-risk students before examinations to curb course dropouts and failure rates.
4. **Bivariate & Multivariate Insights:** Analyze relationships between attendance, study hours, internal assessments, and final marks.
5. **Actionable Remedial Plans:** Prescribe targeted teacher interventions (remedial sessions, study plans, peer mentoring) based on each student's specific academic deficits.
6. **Downloadable Academic Documentation:** Generate institutional PDF reports and CSV analytics with one click.

---

## 🏗️ System Architecture & Workflow

```
[ Academic Dataset (CSV / Excel) ]
               │
               ▼
[ 1. Data Preprocessing & Validation ]
   • Missing Value Imputation (Median / Mode)
   • Duplicate Record Removal
   • Feature Scaling (StandardScaler Z-score)
   • Target Label Encoding
               │
               ▼
[ 2. Exploratory Data Analysis (EDA) ]
   • Bivariate Scatter Plots (Study Hours vs Marks, Attendance vs Marks)
   • Pearson Correlation Matrix
   • Grouped Cohort Metrics & Histograms
               │
               ▼
[ 3. Model Training & Validation (80/20 Partition) ]
   ┌─────────────────────────────────────────────────────────┐
   │ 1. Logistic Regression      (Linear Baseline)           │
   │ 2. Decision Tree            (Non-Linear / Rule-Based)   │
   │ 3. Naive Bayes              (Gaussian Probabilistic)    │
   │ 4. Support Vector Machine   (RBF Kernel Classifier)     │
   └─────────────────────────────────────────────────────────┘
               │
               ▼
[ 4. Model Evaluation & Benchmarking ]
   • Accuracy, Precision, Recall, F1-Score
   • Confusion Matrix & Error Boundary Inspection
   • Automated "Best Model" Selection
               │
               ▼
[ 5. Inference & Explainability Engine ]
   • Real-Time Single Student Prediction
   • Confidence Score (%) & Probability Spread
   • Algorithmic Risk Assessment (Low, Medium, Critical)
   • Attribution of Weak Factors & Teacher Interventions
               │
               ▼
[ 6. Reports & Data Exports ]
   • Academic PDF Report (ReportLab + Matplotlib Charts)
   • Predictions & At-Risk Roster CSV Exports
```

---

## 📊 Dataset Description

The system supports datasets uploaded in **CSV** or **Excel (.xlsx, .xls)** format containing student records:

| Feature Name | Data Type | Permissible Range | Description |
|---|---|---|---|
| `Student_ID` | String | e.g. STU20240001 | Unique student identifier (excluded from training) |
| `Name` | String | Full Name | Student name (excluded from training) |
| `Study_Hours` | Float | 0.5 – 12.0 hrs/day | Average daily self-study duration outside lectures |
| `Attendance` | Float | 0.0 – 100.0% | Percentage of lectures attended during semester |
| `Previous_Marks`| Float | 0.0 – 100.0 | Past semester exam / qualifying test percentage |
| `Assignments` | Float | 0.0 – 25.0 | Cumulative homework and project marks |
| `Internal_Marks`| Float | 0.0 – 25.0 | Periodic internal assessment test score |
| `Final_Result` | Categorical| Pass / Fail (or A-F) | **Target Variable** (Ground truth academic outcome) |

### Preloaded Datasets Included:
1. `student_performance_pass_fail.csv` (600 records, Binary Pass/Fail classification)
2. `student_performance_grades.csv` (600 records, 5-class Grade classification: A, B, C, D, F)
3. `student_performance_categories.csv` (600 records, 3-class Tier classification: High, Medium, Low)
4. `unlabeled_students_batch.csv` (60 records, Unlabeled test roster for testing batch inference)

---

## ⚙️ Supported Classification Algorithms

In strict adherence to academic standards, all models are trained on an **80% training set** and evaluated against an independent **20% testing set**. No fabricated accuracy values are used.

1. **Logistic Regression:**
   - Linear probabilistic classification model optimizing log-loss with L2 regularization.
   - Provides clear interpretable feature weights.
2. **Decision Tree Classifier:**
   - Non-parametric recursive splitting model (`max_depth=6`, `min_samples_split=4`).
   - Captures non-linear relationships and thresholds (e.g. attendance < 60%).
3. **Naive Bayes (Gaussian NB):**
   - Probabilistic classifier assuming conditional feature independence.
   - Exceptionally fast training with strong baseline performance.
4. **Support Vector Machine (SVM):**
   - Radial Basis Function (`rbf` kernel) mapping feature vectors into high-dimensional space for optimal margin separation.
   - Produces calibrated class probability outputs.

---

## 💻 System Modules & Main Website Features

### 1. Executive Dashboard
- Cohort KPI counters: Total Students, Passing Students, At-Risk Students, Average Attendance, Average Marks, Best Model Accuracy.
- Target class distribution doughnut chart.
- Algorithm benchmark comparison preview.
- One-click shortcuts for individual prediction and PDF export.

### 2. Dataset Management & Preprocessing
- Drag-and-drop file uploader for custom CSV and Excel files.
- Instant preloaded sample dataset selector (Pass/Fail, Letter Grades, Categories).
- Automated preprocessing audit: missing value imputation, duplicate removal, feature scaling, label encoding.
- Dataset preview table with pagination.

### 3. Exploratory Data Analysis (EDA)
- Interactive scatter plots: *Study Hours vs Marks* and *Attendance vs Marks* with color-coded target classes.
- Pearson correlation matrix heatmap between all numerical features.
- Cohort comparison bar chart contrasting Pass vs Fail average metrics.
- Histogram distribution of attendance brackets and study hours.

### 4. Model Training & Comparison
- Train/Test partition slider (70/30 to 85/15) with live retraining.
- Benchmark comparison table: Train Accuracy, Test Accuracy, Precision, Recall, F1-Score.
- Side-by-side multi-metric comparative bar chart.
- Interactive Confusion Matrix viewer for any of the 4 models.
- Feature importance weight bar chart.

### 5. Student Predictor (Single & Batch)
- **Single Student Form:** Interactive sliders and numeric inputs for Study Hours, Attendance %, Previous Marks, Assignment Marks, Internal Marks.
- Instant prediction outcome (Pass/Fail or Grade), confidence score (%), risk severity badge.
- Factor attribution list (e.g. *Attendance is below 75% threshold*).
- Prescribed teacher recommendations and intervention actions.
- **Batch Mode:** Upload an unlabeled roster to generate predictions and identify all at-risk students simultaneously.

### 6. At-Risk Early Warning Identification
- Filterable roster of academically vulnerable students.
- Filter by severity (High/Critical vs Medium/Moderate Risk).
- Student search by ID or Name.
- Individual intervention modal providing customized academic recovery roadmaps.

### 7. Reports & Academic Documentation
- 1-Click download of institutional **Academic PDF Report** generated via ReportLab and Matplotlib.
- CSV export of predicted student records and risk flags.
- Offline printable view summarizing methodology, findings, limitations, and future scope.

---

## 🛠️ Technologies Used

- **Backend:** Python 3.11+, FastAPI, Uvicorn, Pydantic
- **Machine Learning & Analytics:** Scikit-learn, Pandas, NumPy, SciPy
- **Data Visualization & PDF:** Matplotlib, Seaborn, ReportLab
- **Frontend:** React.js 19, Vite, Chart.js, React-Chartjs-2, Lucide React
- **Styling:** Custom Modern Responsive CSS Design System

---

## 📂 Project Directory Structure

```
STUDENT PERFORMANCE PREDICTION/
├── backend/
│   ├── app.py                      # FastAPI application with REST endpoints & CORS
│   ├── data_processor.py           # Preprocessing, imputation, validation & scaling
│   ├── ml_engine.py                # Logistic Regression, Decision Tree, Naive Bayes, SVM
│   ├── eda_engine.py               # Statistics, correlations, distributions & scatter data
│   ├── report_generator.py         # PDF report generation with ReportLab & Matplotlib
│   ├── generate_samples.py         # Realistic academic dataset generator
│   ├── test_api.py                 # Backend verification test suite
│   ├── requirements.txt            # Python dependencies
│   └── sample_data/                # Preloaded academic datasets
│       ├── student_performance_pass_fail.csv
│       ├── student_performance_grades.csv
│       ├── student_performance_categories.csv
│       └── unlabeled_students_batch.csv
├── frontend/
│   ├── package.json                # React dependencies
│   ├── vite.config.js              # Vite build configuration
│   ├── index.html                  # HTML entry point
│   └── src/
│       ├── main.jsx                # React DOM entry
│       ├── App.jsx                 # Root component & state management
│       ├── index.css               # Modern CSS theme & styling system
│       ├── api.js                  # Centralized REST API client
│       ├── chartSetup.js           # Chart.js component registration
│       └── components/
│           ├── Navbar.jsx          # Academic header & tab navigation
│           ├── DashboardTab.jsx    # Overview metrics & distribution charts
│           ├── DatasetTab.jsx      # CSV/XLSX upload, preview & audit
│           ├── EDATab.jsx          # Exploratory data analysis charts
│           ├── ModelTrainingTab.jsx# ML benchmark, confusion matrix & weights
│           ├── PredictTab.jsx      # Single & batch prediction with risk factors
│           ├── AtRiskTab.jsx       # Early warning roster & action plans
│           └── ReportsTab.jsx      # PDF report download & printable summary
├── start_all.bat                   # One-click launch for both Backend and Frontend
├── start_backend.bat               # Launcher for FastAPI server (Port 8000)
├── start_frontend.bat              # Launcher for React Vite frontend (Port 5173)
└── README.md                       # Comprehensive Project Documentation
```

---

## 🚀 Installation & Setup Instructions

### Prerequisites
- **Python:** 3.10 or higher
- **Node.js:** v18 or higher (with npm)

### Step 1: Install Python Backend Dependencies
Open PowerShell or Command Prompt in the project root:
```powershell
pip install -r backend/requirements.txt
```

### Step 2: Install React Frontend Dependencies
```powershell
cd frontend
npm install
cd ..
```

---

## ▶️ Running the Application

### Option A: One-Click Startup (Recommended)
Simply double-click:
```
start_all.bat
```
This automatically starts:
- **Backend API:** `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/docs`)
- **React Frontend:** `http://localhost:5173`

### Option B: Manual Startup in Two Terminals

**Terminal 1 (Backend):**
```powershell
cd backend
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 (Frontend):**
```powershell
cd frontend
npm run dev
```
Open your browser and navigate to: **`http://localhost:5173`**

---

## 🔌 API Reference Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status, active dataset, trained models |
| `POST`| `/api/dataset/upload` | Upload custom CSV or Excel dataset |
| `POST`| `/api/dataset/load-sample` | Load preloaded dataset (pass_fail, grades, categories) |
| `GET` | `/api/eda` | Summary statistics, correlations, scatter data |
| `POST`| `/api/model/train` | Retrain Logistic Regression, DT, NB, SVM with test ratio |
| `GET` | `/api/model/summary` | Retrieve model benchmark table & best model |
| `POST`| `/api/predict/single` | Predict individual student with confidence & risk factors |
| `POST`| `/api/predict/batch` | Batch predict uploaded CSV roster |
| `GET` | `/api/at-risk/list` | List vulnerable students requiring interventions |
| `GET` | `/api/report/download-pdf`| Download academic PDF report with embedded charts |
| `GET` | `/api/report/download-csv`| Download predicted student analytics as CSV |
| `GET` | `/api/samples/download/{file}` | Download sample dataset template |

---

## 🔒 Limitations & Future Enhancements

### Limitations
1. **Data Dependency:** Accuracy relies directly on historical record consistency and absence of reporting bias.
2. **Unmeasured Factors:** Academic outcomes are also influenced by socioeconomic, personal, or emotional stressors not captured in typical mark sheets.
3. **Decision Support Role:** Algorithmic predictions are designed to assist educators, not automate punitive academic decisions.

### Future Enhancements
1. **LMS Integration:** Direct web-hook sync with Canvas, Moodle, or Google Classroom.
2. **Personalized Study Plans:** Generative AI integration to output personalized weekly revision timetables for at-risk students.
3. **Parent Notification Gateway:** Automated SMS/Email alerts to guardians when attendance drops below statutory thresholds.
4. **Deep Learning Sequence Models:** LSTM/GRU models to analyze multi-semester time-series performance trajectories.

---

## 🎓 Academic Viva Questions & Answers

### Q1: Why did you choose these four classification algorithms?
**Ans:** To compare different families of Machine Learning algorithms:
- *Logistic Regression:* Parametric linear classifier that models probabilities using a sigmoid function.
- *Decision Tree:* Non-linear rule-based tree model that handles complex non-linear thresholds.
- *Naive Bayes:* Probabilistic model applying Bayes' Theorem under conditional independence assumptions.
- *Support Vector Machine (SVM):* Maximum margin hyperplane classifier utilizing an RBF kernel for complex decision boundaries.

### Q2: Why is F1-Score important in addition to Accuracy?
**Ans:** In academic datasets, passing students often outnumber failing students (class imbalance). Accuracy can be misleading if a model simply predicts the majority class. The **F1-Score** is the harmonic mean of Precision and Recall, ensuring that failing students (the minority class) are correctly detected without excessive false alarms.

### Q3: How is feature scaling applied and why?
**Ans:** Features like Attendance (0–100%) and Daily Study Hours (0–10 hrs) have vastly different numerical ranges. We apply **StandardScaler** ($z = \frac{x - \mu}{\sigma}$), transforming features to have zero mean and unit variance. This prevents distance-based algorithms like SVM and gradient-based models like Logistic Regression from being biased toward larger numerical features.

### Q4: How does the system determine if a student is "At-Risk"?
**Ans:** A multi-factor diagnostic algorithm checks the model's predicted class (e.g. Fail/Low), model confidence, and statutory educational criteria (attendance < 75%, study hours < 2.5 hrs/day, internal marks < 12/25). It assigns a weighted risk score and categorizes the student into Low, Medium, or High/Critical Risk, along with specific remedial actions.

---

## 📜 Academic Declaration
This project is submitted in partial fulfillment of the requirements for the degree of **Bachelor of Engineering / Technology in Computer Science and Engineering**.

## Live Website Depolyment
Live Website- https://student-performance-prediction-syst-seven.vercel.app/
