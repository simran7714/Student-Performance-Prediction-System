import React from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  Database,
  FileText,
  Sliders,
  Award,
  Layers,
  ShieldCheck,
  TrendingUp,
  BookOpen,
  ArrowUpRight,
  Cpu,
  Clock,
  Download
} from 'lucide-react';
import '../landing.css';

export default function LandingPage({ onLaunchDashboard, onNavigateTab }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="lp-root">
      {/* Background Radial Glow */}
      <div className="lp-ambient-mesh"></div>

      {/* 1. STICKY NAVIGATION BAR */}
      <header className="lp-navbar">
        <div className="lp-nav-container">
          <div className="lp-brand" onClick={() => scrollToSection('hero')}>
            <div className="lp-logo-badge">
              <GraduationCap size={24} strokeWidth={2.4} />
            </div>
            <div className="lp-brand-info">
              <h2>Student Performance Prediction System</h2>
              <div className="lp-brand-tagline">"Analyze Student Performance. Predict Academic Success."</div>
            </div>
          </div>

          <nav className="lp-nav-links">
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Home</a>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a>
            <a href="#workflow" onClick={(e) => { e.preventDefault(); scrollToSection('workflow'); }}>How It Works</a>
            <a href="#algorithms" onClick={(e) => { e.preventDefault(); scrollToSection('algorithms'); }}>ML Models</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
          </nav>

          <div className="lp-nav-cta">
            <button className="lp-btn lp-btn-primary" onClick={onLaunchDashboard}>
              Launch Dashboard <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="lp-hero" id="hero">
        <div className="lp-hero-content">
          <div className="lp-pill">
            <Sparkles size={14} color="#60a5fa" /> Machine Learning & Educational Analytics
          </div>

          <h1 className="lp-hero-title">
            Predict Student Performance. <br />
            <span className="lp-text-gradient">Empower Academic Success.</span>
          </h1>

          <p className="lp-hero-desc">
            An intelligent Machine Learning platform that analyzes student academic data, predicts performance, identifies at-risk students, and supports smarter educational decisions.
          </p>

          <div className="lp-hero-actions">
            <button className="lp-btn lp-btn-primary" style={{ padding: '14px 30px', fontSize: '1rem' }} onClick={onLaunchDashboard}>
              Get Started <ArrowRight size={18} />
            </button>
            <button className="lp-btn lp-btn-secondary" style={{ padding: '14px 26px', fontSize: '1rem' }} onClick={() => scrollToSection('features')}>
              Explore Features
            </button>
          </div>

          <div className="lp-hero-trust">
            <div className="lp-trust-item">
              <span className="lp-trust-dot"></span>
              <span>4 Real ML Algorithms</span>
            </div>
            <div className="lp-trust-item">
              <span className="lp-trust-dot"></span>
              <span>80/20 Test Partition</span>
            </div>
            <div className="lp-trust-item">
              <span className="lp-trust-dot"></span>
              <span>Early Warning System</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Visual / Dashboard Mockup */}
        <div className="lp-hero-visual">
          <div className="lp-visual-glow"></div>

          {/* Floating Pill Top Right */}
          <div className="lp-floating-badge lp-float-top-right">
            <BrainCircuit size={18} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>BEST CLASSIFIER</div>
              <div style={{ color: '#ffffff', fontWeight: 800 }}>SVM: 91.7% Accuracy</div>
            </div>
          </div>

          {/* Floating Pill Bottom Left */}
          <div className="lp-floating-badge lp-float-bottom-left">
            <AlertTriangle size={18} color="#f59e0b" />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>EARLY WARNING SYSTEM</div>
              <div style={{ color: '#ffffff', fontWeight: 800 }}>Vulnerability Detection Active</div>
            </div>
          </div>

          {/* Main Mockup Card */}
          <div className="lp-mockup-card">
            <div className="lp-mockup-header">
              <div className="lp-mockup-dots">
                <span className="lp-dot-red"></span>
                <span className="lp-dot-yellow"></span>
                <span className="lp-dot-green"></span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                STUDENT PERFORMANCE ENGINE • LIVE INFERENCE
              </div>
              <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Validated</span>
            </div>

            {/* Quick Stats Grid */}
            <div className="lp-mockup-statgrid">
              <div className="lp-stat-box">
                <div className="lp-stat-label">COHORT MONITORED</div>
                <div className="lp-stat-val">600 Students</div>
                <div className="lp-stat-sub">Active Semester Records</div>
              </div>
              <div className="lp-stat-box">
                <div className="lp-stat-label">AVERAGE ATTENDANCE</div>
                <div className="lp-stat-val">74.2%</div>
                <div className="lp-stat-sub">Threshold: 75% Required</div>
              </div>
            </div>

            {/* Live Student Prediction Preview */}
            <div className="lp-prediction-preview-box">
              <div className="lp-preview-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="#38bdf8" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                    Student Prediction Sample
                  </span>
                </div>
                <span className="badge badge-blue">Real-time Inference</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '12px', background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '8px' }}>
                <div>Attendance: <strong style={{ color: '#38bdf8' }}>84.0%</strong></div>
                <div>Study Hours: <strong style={{ color: '#38bdf8' }}>4.5h/day</strong></div>
                <div>Previous Marks: <strong style={{ color: '#38bdf8' }}>78/100</strong></div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>OUTCOME</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>PASS (Grade A)</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>CONFIDENCE SCORE</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#60a5fa' }}>96.4%</div>
                </div>
              </div>
            </div>

            {/* Mini Footer / Action preview */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
              <span>Risk Severity: <strong style={{ color: '#10b981' }}>Low Risk / Safe</strong></span>
              <span style={{ color: '#38bdf8' }}>Automated Intervention Ready →</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="lp-features-section" id="features">
        <div className="lp-section-header">
          <div className="lp-pill">
            <Cpu size={14} color="#60a5fa" /> Comprehensive Platform Features
          </div>
          <h2 className="lp-section-title">Everything Educators Need to Drive Academic Outcomes</h2>
          <p className="lp-section-desc">
            From raw spreadsheet data ingestion to advanced non-linear machine learning prediction, our platform delivers actionable institutional intelligence.
          </p>
        </div>

        <div className="lp-features-grid">
          {/* Feature 1 */}
          <div className="lp-feature-card">
            <div className="lp-feature-icon" style={{ background: 'rgba(37, 99, 235, 0.2)', color: '#38bdf8' }}>
              <Sparkles size={26} />
            </div>
            <h3>Student Performance Prediction</h3>
            <p>
              Instantly predict Pass/Fail results or letter grades (A–F) based on attendance, daily study hours, internal assessments, and previous marks with calibrated confidence scores.
            </p>
            <button className="lp-feature-link" onClick={() => onNavigateTab ? onNavigateTab('predict') : onLaunchDashboard()}>
              Try Predictor <ArrowUpRight size={15} />
            </button>
          </div>

          {/* Feature 2 */}
          <div className="lp-feature-card">
            <div className="lp-feature-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
              <AlertTriangle size={26} />
            </div>
            <h3>At-Risk Student Identification</h3>
            <p>
              Early Warning System that detects vulnerable students with severe attendance deficits (&lt;75%) or study hours deficits, generating tailored teacher intervention plans.
            </p>
            <button className="lp-feature-link" onClick={() => onNavigateTab ? onNavigateTab('at-risk') : onLaunchDashboard()}>
              View Early Warning <ArrowUpRight size={15} />
            </button>
          </div>

          {/* Feature 3 */}
          <div className="lp-feature-card">
            <div className="lp-feature-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
              <BarChart3 size={26} />
            </div>
            <h3>Academic Data Analysis (EDA)</h3>
            <p>
              Explore bivariate scatter plots (*Study Hours vs Marks*, *Attendance vs Marks*), Pearson correlation heatmaps, and attendance bracket histograms across cohorts.
            </p>
            <button className="lp-feature-link" onClick={() => onNavigateTab ? onNavigateTab('eda') : onLaunchDashboard()}>
              Explore Analytics <ArrowUpRight size={15} />
            </button>
          </div>

          {/* Feature 4 */}
          <div className="lp-feature-card">
            <div className="lp-feature-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc' }}>
              <BrainCircuit size={26} />
            </div>
            <h3>ML Model Comparison</h3>
            <p>
              Train and compare Logistic Regression, Decision Tree, Naive Bayes, and SVM on verified 80/20 train/test splits. Benchmark accuracy, precision, recall, and F1-scores.
            </p>
            <button className="lp-feature-link" onClick={() => onNavigateTab ? onNavigateTab('models') : onLaunchDashboard()}>
              Compare Algorithms <ArrowUpRight size={15} />
            </button>
          </div>

          {/* Feature 5 */}
          <div className="lp-feature-card">
            <div className="lp-feature-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
              <Layers size={26} />
            </div>
            <h3>Performance Visualization</h3>
            <p>
              Interactive confusion matrices, pass/fail distribution doughnuts, and normalized cohort comparisons provide full visual clarity for academic presentations.
            </p>
            <button className="lp-feature-link" onClick={() => onNavigateTab ? onNavigateTab('dashboard') : onLaunchDashboard()}>
              View Visualizations <ArrowUpRight size={15} />
            </button>
          </div>

          {/* Feature 6 */}
          <div className="lp-feature-card">
            <div className="lp-feature-icon" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>
              <FileText size={26} />
            </div>
            <h3>Report Generation & Export</h3>
            <p>
              Generate formal academic PDF reports using ReportLab with embedded charts, executive summaries, model audits, and at-risk rosters ready for institutional accreditation.
            </p>
            <button className="lp-feature-link" onClick={() => onNavigateTab ? onNavigateTab('reports') : onLaunchDashboard()}>
              Generate Reports <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (WORKFLOW) */}
      <section className="lp-workflow-section" id="workflow">
        <div className="lp-workflow-container">
          <div className="lp-section-header">
            <div className="lp-pill">
              <TrendingUp size={14} color="#60a5fa" /> System Methodology
            </div>
            <h2 className="lp-section-title">How It Works: End-to-End Pipeline</h2>
            <p className="lp-section-desc">
              A robust 6-step machine learning workflow designed for institutional deployment and academic demonstration.
            </p>
          </div>

          <div className="lp-workflow-grid">
            <div className="lp-workflow-step">
              <div className="lp-step-num">01</div>
              <div className="lp-step-content">
                <h4>Upload Student Dataset</h4>
                <p>Accepts institutional CSV and Excel (.xlsx, .xls) files or preloaded datasets with flexible target column mapping.</p>
              </div>
            </div>

            <div className="lp-workflow-step">
              <div className="lp-step-num">02</div>
              <div className="lp-step-content">
                <h4>Data Preprocessing</h4>
                <p>Automated median/mode missing value imputation, duplicate removal, feature scaling via StandardScaler, and label encoding.</p>
              </div>
            </div>

            <div className="lp-workflow-step">
              <div className="lp-step-num">03</div>
              <div className="lp-step-content">
                <h4>Exploratory Data Analysis</h4>
                <p>Calculates central tendencies, Pearson correlation matrices, bivariate trendlines, and bracket distributions.</p>
              </div>
            </div>

            <div className="lp-workflow-step">
              <div className="lp-step-num">04</div>
              <div className="lp-step-content">
                <h4>Machine Learning Training</h4>
                <p>Splits data into 80% train / 20% test partitions to train Logistic Regression, Decision Tree, Naive Bayes, and SVM.</p>
              </div>
            </div>

            <div className="lp-workflow-step">
              <div className="lp-step-num">05</div>
              <div className="lp-step-content">
                <h4>Student Performance Prediction</h4>
                <p>Interactive single & batch inference calculating confidence percentages, vulnerability flags, and prescribed teacher actions.</p>
              </div>
            </div>

            <div className="lp-workflow-step">
              <div className="lp-step-num">06</div>
              <div className="lp-step-content">
                <h4>Result Visualization & Reports</h4>
                <p>Confusion matrix inspection, at-risk rosters, and automated publication-ready academic PDF report generation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MACHINE LEARNING ALGORITHMS */}
      <section className="lp-algo-section" id="algorithms">
        <div className="lp-section-header">
          <div className="lp-pill">
            <BrainCircuit size={14} color="#60a5fa" /> Algorithms & Machine Learning
          </div>
          <h2 className="lp-section-title">Trained on Verified Supervised Algorithms</h2>
          <p className="lp-section-desc">
            We evaluate multiple distinct algorithmic families on genuine test sets to determine the best-performing classifier without synthetic inflation.
          </p>
        </div>

        <div className="lp-algo-grid">
          {/* Algorithm 1: Logistic Regression */}
          <div className="lp-algo-card">
            <div>
              <div className="lp-algo-top">
                <div>
                  <div className="lp-algo-family">Linear Classifier</div>
                  <div className="lp-algo-name">Logistic Regression</div>
                </div>
                <span className="lp-algo-badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>90.0% Acc</span>
              </div>
              <p className="lp-algo-desc">
                Models probability of student outcomes using a sigmoid function. Highly interpretable with clear feature coefficient weights.
              </p>
              <ul className="lp-algo-points">
                <li><CheckCircle2 size={14} color="#10b981" /> L2 Regularized Optimization</li>
                <li><CheckCircle2 size={14} color="#10b981" /> Clear Feature Weight Coefficients</li>
                <li><CheckCircle2 size={14} color="#10b981" /> Rapid Convergence</li>
              </ul>
            </div>
            <button className="lp-btn lp-btn-secondary" style={{ width: '100%', fontSize: '0.82rem' }} onClick={() => onNavigateTab ? onNavigateTab('models') : onLaunchDashboard()}>
              Inspect Model Details
            </button>
          </div>

          {/* Algorithm 2: Decision Tree */}
          <div className="lp-algo-card">
            <div>
              <div className="lp-algo-top">
                <div>
                  <div className="lp-algo-family">Tree-Based Classifier</div>
                  <div className="lp-algo-name">Decision Tree</div>
                </div>
                <span className="lp-algo-badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>85.8% Acc</span>
              </div>
              <p className="lp-algo-desc">
                Non-parametric recursive splitting model capable of capturing complex non-linear thresholds like statutory attendance rules.
              </p>
              <ul className="lp-algo-points">
                <li><CheckCircle2 size={14} color="#10b981" /> Gini Impurity Criterion</li>
                <li><CheckCircle2 size={14} color="#10b981" /> Intrinsic Feature Importance</li>
                <li><CheckCircle2 size={14} color="#10b981" /> Handles Non-Linear Thresholds</li>
              </ul>
            </div>
            <button className="lp-btn lp-btn-secondary" style={{ width: '100%', fontSize: '0.82rem' }} onClick={() => onNavigateTab ? onNavigateTab('models') : onLaunchDashboard()}>
              Inspect Model Details
            </button>
          </div>

          {/* Algorithm 3: Naive Bayes */}
          <div className="lp-algo-card">
            <div>
              <div className="lp-algo-top">
                <div>
                  <div className="lp-algo-family">Probabilistic Classifier</div>
                  <div className="lp-algo-name">Naive Bayes</div>
                </div>
                <span className="lp-algo-badge" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee' }}>89.2% Acc</span>
              </div>
              <p className="lp-algo-desc">
                Gaussian probabilistic classifier applying Bayes' theorem with conditional feature independence assumptions.
              </p>
              <ul className="lp-algo-points">
                <li><CheckCircle2 size={14} color="#10b981" /> Gaussian Likelihood Estimation</li>
                <li><CheckCircle2 size={14} color="#10b981" /> High Efficiency & Scalability</li>
                <li><CheckCircle2 size={14} color="#10b981" /> Strong Baseline Classifier</li>
              </ul>
            </div>
            <button className="lp-btn lp-btn-secondary" style={{ width: '100%', fontSize: '0.82rem' }} onClick={() => onNavigateTab ? onNavigateTab('models') : onLaunchDashboard()}>
              Inspect Model Details
            </button>
          </div>

          {/* Algorithm 4: SVM */}
          <div className="lp-algo-card" style={{ border: '1px solid rgba(59, 130, 246, 0.4)', background: 'linear-gradient(180deg, rgba(30, 58, 138, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%)' }}>
            <div>
              <div className="lp-algo-top">
                <div>
                  <div className="lp-algo-family" style={{ color: '#38bdf8' }}>★ Best Classifier</div>
                  <div className="lp-algo-name">SVM (RBF Kernel)</div>
                </div>
                <span className="lp-algo-badge" style={{ background: 'rgba(16, 185, 129, 0.25)', color: '#34d399' }}>91.7% Acc</span>
              </div>
              <p className="lp-algo-desc">
                Maps feature vectors into infinite-dimensional Hilbert space using Radial Basis Function for optimal maximum-margin separation.
              </p>
              <ul className="lp-algo-points">
                <li><CheckCircle2 size={14} color="#10b981" /> Radial Basis Function (RBF)</li>
                <li><CheckCircle2 size={14} color="#10b981" /> Peak 91.69% F1-Score</li>
                <li><CheckCircle2 size={14} color="#10b981" /> Calibrated Class Probabilities</li>
              </ul>
            </div>
            <button className="lp-btn lp-btn-primary" style={{ width: '100%', fontSize: '0.82rem' }} onClick={() => onNavigateTab ? onNavigateTab('models') : onLaunchDashboard()}>
              Inspect Best Model
            </button>
          </div>
        </div>
      </section>

      {/* 6. ABOUT SECTION */}
      <section className="lp-about-section" id="about">
        <div className="lp-about-box">
          <div className="lp-about-content">
            <div className="lp-pill">
              <BookOpen size={14} color="#60a5fa" /> Educational Analytics Purpose
            </div>
            <h3>Empowering Educators Through Proactive Machine Learning</h3>
            <p>
              Traditional academic evaluations are inherently retrospective: faculty often discover a student's distress only after semester final examination grades are published. By that point, preventive intervention is impossible.
            </p>
            <p>
              The <strong>Student Performance Prediction System</strong> combines historical academic records with modern supervised machine learning to identify vulnerable students weeks before examinations occur. By analyzing the interplay of attendance, self-study commitment, assignment timeliness, and internal tests, educators can transition from reactive grading to proactive academic rescue.
            </p>
            <button className="lp-btn lp-btn-primary" onClick={onLaunchDashboard}>
              Launch Academic Dashboard <ArrowRight size={16} />
            </button>
          </div>

          <div className="lp-about-stats">
            <div className="lp-about-stat-item">
              <h5>Early</h5>
              <p>Warning detection deployed before mid-term evaluations</p>
            </div>
            <div className="lp-about-stat-item">
              <h5>4.5h</h5>
              <p>Average daily study hours correlated with honors grades</p>
            </div>
            <div className="lp-about-stat-item">
              <h5>75%</h5>
              <p>Statutory attendance threshold rigorously monitored</p>
            </div>
            <div className="lp-about-stat-item">
              <h5>100%</h5>
              <p>Transparent evaluation with zero fabricated metric inflation</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION SECTION */}
      <section className="lp-cta-section">
        <div className="lp-cta-card">
          <div className="lp-cta-glow"></div>
          <h2>Turn Academic Data into Meaningful Insights.</h2>
          <p>
            Start exploring student performance through intelligent data analysis, verified machine learning predictions, and automated institutional reporting.
          </p>
          <button className="lp-btn lp-cta-btn" onClick={onLaunchDashboard}>
            Launch Dashboard <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-container">
          <div className="lp-footer-top">
            {/* Col 1 */}
            <div>
              <div className="lp-brand">
                <div className="lp-logo-badge" style={{ width: '38px', height: '38px' }}>
                  <GraduationCap size={20} />
                </div>
                <div className="lp-brand-info">
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Student Performance Prediction</h3>
                </div>
              </div>
              <p className="lp-footer-desc">
                An intelligent educational analytics platform utilizing Machine Learning to predict academic outcomes, identify vulnerable students early, and optimize institutional interventions.
              </p>
              <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 600 }}>
                "Analyze Student Performance. Predict Academic Success."
              </div>
            </div>

            {/* Col 2 */}
            <div className="lp-footer-col">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Home</a></li>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
                <li><a href="#workflow" onClick={(e) => { e.preventDefault(); scrollToSection('workflow'); }}>How It Works</a></li>
                <li><a href="#algorithms" onClick={(e) => { e.preventDefault(); scrollToSection('algorithms'); }}>ML Models</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About Project</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="lp-footer-col">
              <h4>System Modules</h4>
              <ul>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); onNavigateTab ? onNavigateTab('dashboard') : onLaunchDashboard(); }}>Dashboard</a></li>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); onNavigateTab ? onNavigateTab('predict') : onLaunchDashboard(); }}>Student Predictor</a></li>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); onNavigateTab ? onNavigateTab('at-risk') : onLaunchDashboard(); }}>At-Risk Identification</a></li>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); onNavigateTab ? onNavigateTab('eda') : onLaunchDashboard(); }}>Exploratory Analytics</a></li>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); onNavigateTab ? onNavigateTab('reports') : onLaunchDashboard(); }}>Academic PDF Reports</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="lp-footer-col">
              <h4>Technologies Used</h4>
              <div className="lp-tech-tags">
                <span className="lp-tech-tag">Python 3.11</span>
                <span className="lp-tech-tag">FastAPI</span>
                <span className="lp-tech-tag">Scikit-learn</span>
                <span className="lp-tech-tag">React.js 19</span>
                <span className="lp-tech-tag">Vite</span>
                <span className="lp-tech-tag">Chart.js</span>
                <span className="lp-tech-tag">ReportLab PDF</span>
                <span className="lp-tech-tag">Pandas & NumPy</span>
                <span className="lp-tech-tag">Supabase</span>
              </div>
            </div>
          </div>

          <div className="lp-footer-bottom">
            <div>
              © 2026 Student Performance Prediction System. Minor Academic Project in Computer Science and Engineering.
            </div>
            <div>
              Designed & Developed for Data-Driven Educational Analytics
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
