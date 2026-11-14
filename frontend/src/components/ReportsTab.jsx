import React from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Award,
  AlertTriangle,
  BookOpen,
  Calendar,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { getPdfReportUrl, getCsvReportUrl, getSampleDownloadUrl } from '../api';

export default function ReportsTab({
  activeDataset,
  prepSummary,
  modelsData,
  edaData,
  atRiskData
}) {
  const handlePrint = () => {
    window.print();
  };

  const totalStudents = edaData?.total_records || prepSummary?.cleaned_rows || 0;
  const bestModelName = modelsData?.best_model || 'Logistic Regression';
  const bestModelMetrics = modelsData?.best_model_metrics || modelsData?.models?.[bestModelName];
  const atRiskCount = atRiskData?.total_at_risk || 0;

  return (
    <div>
      {/* Report Download Action Card */}
      <div className="card" style={{ background: 'linear-gradient(to right, #ffffff, #f0fdf4)', borderLeft: '4px solid #10b981' }}>
        <div className="card-header">
          <div>
            <div className="card-title">
              <FileText size={20} color="#059669" /> Academic Report Generation & Exports
            </div>
            <div className="card-subtitle">
              Export formal institutional documentation, compliance audits, and analytical tables
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-outline" onClick={handlePrint}>
              <Printer size={16} /> Print View
            </button>
            <a href={getCsvReportUrl()} className="btn btn-outline" download>
              <Download size={16} /> Export CSV
            </a>
            <a href={getPdfReportUrl()} className="btn btn-primary" style={{ background: '#059669' }} target="_blank" rel="noreferrer">
              <Download size={16} /> Download Academic PDF Report
            </a>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          The generated PDF report includes the formal Minor Academic Project header, executive summary, complete data preprocessing audit, four-model benchmark comparison table, confusion matrices, and the full at-risk student intervention roster.
        </p>
      </div>

      {/* On-Screen Institutional Academic Report Document Preview */}
      <div className="card" style={{ padding: '36px', boxShadow: 'var(--shadow-md)', border: '1px solid #cbd5e1' }}>
        {/* Document Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #1e3a8a', paddingBottom: '20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
            Minor Academic Project in Computer Science and Engineering
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Student Performance Prediction System
          </h2>
          <div style={{ fontSize: '1rem', fontStyle: 'italic', color: '#3b82f6', marginBottom: '12px' }}>
            "Analyze Student Performance. Predict Academic Success."
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span><strong>Target Variable:</strong> {prepSummary?.target_column || 'Final_Result'}</span>
            <span>•</span>
            <span><strong>Cohort Records:</strong> {totalStudents} Students</span>
            <span>•</span>
            <span><strong>Best Classifier:</strong> {bestModelName} ({bestModelMetrics?.accuracy_percentage}%)</span>
          </div>
        </div>

        {/* Section 1: Executive Overview */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '8px' }}>
            1. Executive Summary
          </h3>
          <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: '#334155' }}>
            This study evaluated {totalStudents} student academic profiles to predict semester academic outcomes and identify vulnerable students prior to final assessments. Machine learning classifiers were trained on normalized features including daily study hours, class attendance percentages, previous exam marks, internal assessments, and homework assignments. The optimal model identified is <strong>{bestModelName}</strong>, achieving a test accuracy of <strong>{bestModelMetrics?.accuracy_percentage}%</strong> and an F1-Score of <strong>{bestModelMetrics?.f1_score_percentage}%</strong>.
          </p>
        </div>

        {/* Section 2: Model Benchmark Table */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '10px' }}>
            2. Machine Learning Algorithm Comparison
          </h3>
          <div className="table-container">
            <table className="custom-table" style={{ fontSize: '0.82rem' }}>
              <thead>
                <tr>
                  <th>Algorithm</th>
                  <th>Classifier Family</th>
                  <th>Accuracy</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1-Score</th>
                </tr>
              </thead>
              <tbody>
                {modelsData?.models && Object.entries(modelsData.models).map(([name, m]) => (
                  <tr key={name} style={{ background: name === bestModelName ? '#f0fdf4' : 'white' }}>
                    <td style={{ fontWeight: 700 }}>
                      {name} {name === bestModelName && '★ (Best Model)'}
                    </td>
                    <td>{m.type}</td>
                    <td style={{ fontWeight: 700 }}>{m.accuracy_percentage}%</td>
                    <td>{m.precision_percentage}%</td>
                    <td>{m.recall_percentage}%</td>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>{m.f1_score_percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Early Warning & Vulnerable Cohort */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#dc2626', marginBottom: '8px' }}>
            3. Early Warning Assessment & At-Risk Summary
          </h3>
          <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: '#334155', marginBottom: '12px' }}>
            A total of <strong>{atRiskCount} students</strong> ({totalStudents > 0 ? ((atRiskCount / totalStudents) * 100).toFixed(1) : 0}% of the cohort) have been classified as academically vulnerable. The primary contributing indicators were attendance deficit below 75% and daily self-study hours below 2.5 hours.
          </p>
        </div>

        {/* Section 4: Prescribed Institutional Recommendations */}
        <div style={{ marginBottom: '24px', background: '#f8fafc', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
            4. Recommended Corrective & Preventive Institutional Actions
          </h3>
          <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: '#334155' }}>
            <li style={{ marginBottom: '6px' }}>
              <strong>Early Attendance Interventions:</strong> Automated SMS and email notifications triggered when student attendance drops below 80%.
            </li>
            <li style={{ marginBottom: '6px' }}>
              <strong>Departmental Mentorship:</strong> Pair students in the bottom 25th percentile of internal marks with top-performing peer mentors.
            </li>
            <li style={{ marginBottom: '6px' }}>
              <strong>Structured Remedial Modules:</strong> Schedule weekly tutorial problem-solving sessions for critical subjects before mid-term evaluations.
            </li>
            <li style={{ marginBottom: '6px' }}>
              <strong>Study Habits Coaching:</strong> Provide workshops on active recall, spaced repetition, and time-management techniques.
            </li>
          </ul>
        </div>

        {/* Section 5: Limitations and Future Scope (Parts 12 & 13) */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.82rem', color: '#64748b' }}>
          <div>
            <strong style={{ color: '#0f172a' }}>System Limitations (Part 12):</strong>
            <p style={{ marginTop: '4px' }}>
              Predictions depend on the accuracy and quality of historical records. Unmeasured psychological, socioeconomic, and health factors also influence performance. Machine learning predictions are designed to support, not replace, faculty evaluation.
            </p>
          </div>
          <div>
            <strong style={{ color: '#0f172a' }}>Future Enhancements (Part 13):</strong>
            <p style={{ marginTop: '4px' }}>
              Integration with Canvas/Moodle LMS, mobile push notifications, generative AI personalized study paths, and continuous automated weekly model retraining.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
