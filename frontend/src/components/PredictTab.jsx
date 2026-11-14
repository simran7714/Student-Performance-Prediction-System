import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Award,
  UploadCloud,
  FileSpreadsheet,
  Download,
  Lightbulb,
  Clock,
  BookOpen,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { predictSingleStudent, predictBatchStudents, getSampleDownloadUrl } from '../api';

export default function PredictTab({ modelsData }) {
  const [activeMode, setActiveMode] = useState('single'); // 'single' or 'batch'

  // Single prediction state
  const [formData, setFormData] = useState({
    Study_Hours: 4.5,
    Attendance: 82.0,
    Previous_Marks: 68.0,
    Assignments: 18.0,
    Internal_Marks: 17.5,
    model_name: modelsData?.best_model || 'Logistic Regression'
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [singleError, setSingleError] = useState(null);

  // Batch prediction state
  const [batchFile, setBatchFile] = useState(null);
  const [batchModel, setBatchModel] = useState(modelsData?.best_model || 'Logistic Regression');
  const [batchResults, setBatchResults] = useState(null);
  const [isBatchLoading, setIsBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState(null);

  const modelOptions = modelsData?.models ? Object.keys(modelsData.models) : [
    'Logistic Regression',
    'Decision Tree',
    'Naive Bayes',
    'Support Vector Machine (SVM)'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleSinglePredict = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setSingleError(null);
      const res = await predictSingleStudent(formData, formData.model_name);
      setPredictionResult(res);
    } catch (err) {
      setSingleError(err.message || 'Prediction failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBatchPredict = async (e) => {
    e.preventDefault();
    if (!batchFile) {
      setBatchError('Please select a CSV or Excel file for batch prediction.');
      return;
    }

    try {
      setIsBatchLoading(true);
      setBatchError(null);
      const res = await predictBatchStudents(batchFile, batchModel);
      setBatchResults(res);
    } catch (err) {
      setBatchError(err.message || 'Batch prediction failed');
    } finally {
      setIsBatchLoading(false);
    }
  };

  return (
    <div>
      {/* Header with Mode Toggle */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
          <div>
            <div className="card-title">
              <Sparkles size={20} color="#2563eb" /> Academic Performance Predictor
            </div>
            <div className="card-subtitle">
              Evaluate real-time student outcomes and identify vulnerabilities with algorithmic explainability
            </div>
          </div>

          <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: 'var(--radius-md)', gap: '4px' }}>
            <button
              className={`btn ${activeMode === 'single' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 14px', fontSize: '0.82rem', border: 'none' }}
              onClick={() => setActiveMode('single')}
            >
              Single Student
            </button>
            <button
              className={`btn ${activeMode === 'batch' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 14px', fontSize: '0.82rem', border: 'none' }}
              onClick={() => setActiveMode('batch')}
            >
              Batch Prediction (CSV)
            </button>
          </div>
        </div>
      </div>

      {/* SINGLE STUDENT PREDICTION MODE */}
      {activeMode === 'single' && (
        <div className="grid-2">
          {/* Prediction Input Form */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  <Sliders size={18} color="#2563eb" /> Student Academic Profile
                </div>
                <div className="card-subtitle">Enter student behavioral and examination parameters</div>
              </div>
            </div>

            {singleError && (
              <div className="alert alert-danger">
                <AlertCircle size={16} />
                <span>{singleError}</span>
              </div>
            )}

            <form onSubmit={handleSinglePredict}>
              {/* Study Hours Slider & Input */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">
                  <span>Daily Study Hours (0 - 12 hrs)</span>
                  <span style={{ fontWeight: 700, color: '#2563eb' }}>{formData.Study_Hours} hrs/day</span>
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={formData.Study_Hours}
                    onChange={(e) => handleInputChange('Study_Hours', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="12"
                    step="0.1"
                    className="form-input"
                    style={{ width: '80px', padding: '6px 10px' }}
                    value={formData.Study_Hours}
                    onChange={(e) => handleInputChange('Study_Hours', e.target.value)}
                  />
                </div>
                <span className="form-hint">Average self-study time outside lecture periods</span>
              </div>

              {/* Attendance Slider & Input */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">
                  <span>Attendance Percentage (0 - 100%)</span>
                  <span style={{ fontWeight: 700, color: formData.Attendance < 75 ? '#dc2626' : '#059669' }}>
                    {formData.Attendance}% {formData.Attendance < 75 ? '(Below 75% Threshold)' : ''}
                  </span>
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.Attendance}
                    onChange={(e) => handleInputChange('Attendance', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    className="form-input"
                    style={{ width: '80px', padding: '6px 10px' }}
                    value={formData.Attendance}
                    onChange={(e) => handleInputChange('Attendance', e.target.value)}
                  />
                </div>
              </div>

              {/* Previous Exam Marks */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">
                  <span>Previous Semester / Exam Marks (0 - 100)</span>
                  <span style={{ fontWeight: 700 }}>{formData.Previous_Marks}/100</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  className="form-input"
                  value={formData.Previous_Marks}
                  onChange={(e) => handleInputChange('Previous_Marks', e.target.value)}
                  required
                />
              </div>

              {/* Assignment & Internal Marks in 2-col */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Assignment Marks</span>
                    <span style={{ fontWeight: 700 }}>{formData.Assignments}/25</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    step="0.5"
                    className="form-input"
                    value={formData.Assignments}
                    onChange={(e) => handleInputChange('Assignments', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Internal Marks</span>
                    <span style={{ fontWeight: 700 }}>{formData.Internal_Marks}/25</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    step="0.5"
                    className="form-input"
                    value={formData.Internal_Marks}
                    onChange={(e) => handleInputChange('Internal_Marks', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Model Selection Dropdown */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">
                  <span>Classifier Model</span>
                  <span className="form-hint">Default: Best Model</span>
                </label>
                <select
                  className="form-select"
                  value={formData.model_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, model_name: e.target.value }))}
                >
                  {modelOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt} {opt === modelsData?.best_model ? '(Recommended - Highest Accuracy)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={isSubmitting}>
                {isSubmitting ? <span className="spinner" style={{ width: '18px', height: '18px' }}></span> : <Sparkles size={16} />}
                Generate Performance Prediction
              </button>
            </form>
          </div>

          {/* Prediction Result & Risk Analysis Card */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  <Award size={18} color="#059669" /> Prediction Output & Risk Assessment
                </div>
                <div className="card-subtitle">Algorithmic inference and actionable recommendations</div>
              </div>
            </div>

            {predictionResult ? (
              <div>
                {/* Primary Outcome Banner */}
                {(() => {
                  const pred = predictionResult.predicted_result;
                  const isFail = ['fail', 'f', 'low'].includes(pred.toLowerCase());
                  return (
                    <div style={{
                      background: isFail ? '#fef2f2' : '#ecfdf5',
                      border: `1px solid ${isFail ? '#fecaca' : '#a7f3d0'}`,
                      borderRadius: 'var(--radius-lg)',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '20px'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: isFail ? '#991b1b' : '#065f46', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          PREDICTED ACADEMIC CLASSIFICATION
                        </div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 800, color: isFail ? '#dc2626' : '#059669', lineHeight: 1.1 }}>
                          {pred}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Model: <strong>{predictionResult.model_used}</strong>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CONFIDENCE SCORE</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563eb' }}>
                          {predictionResult.confidence_percentage}%
                        </div>
                        <span className={`badge ${isFail ? 'badge-red' : 'badge-green'}`}>
                          {predictionResult.risk_assessment?.risk_level}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Probability Distribution */}
                {predictionResult.probability_breakdown && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                      PROBABILITY BY CLASS:
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {Object.entries(predictionResult.probability_breakdown).map(([cls, pct]) => (
                        <div key={cls} style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.82rem' }}>
                          <strong>{cls}:</strong> {pct}%
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contributing Vulnerabilities */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <AlertTriangle size={16} color="#f59e0b" /> Contributing Academic Factors:
                  </div>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    {predictionResult.risk_assessment?.contributing_factors?.map((fact, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{fact}</li>
                    ))}
                  </ul>
                </div>

                {/* Prescribed Teacher Interventions */}
                <div style={{ background: '#eff6ff', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e40af', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Lightbulb size={16} color="#2563eb" /> Prescribed Teacher Interventions & Action Plan:
                  </div>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: '#1e3a8a' }}>
                    {predictionResult.risk_assessment?.teacher_recommendations?.map((rec, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <Clock size={40} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
                <h4>Awaiting Input Parameters</h4>
                <p style={{ fontSize: '0.85rem', maxWidth: '360px', margin: '6px auto 0' }}>
                  Adjust the student academic indicators on the left and click "Generate Performance Prediction" to calculate immediate outcomes.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BATCH PREDICTION MODE */}
      {activeMode === 'batch' && (
        <div>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  <FileSpreadsheet size={20} color="#2563eb" /> Batch Student Prediction
                </div>
                <div className="card-subtitle">
                  Upload an unlabeled CSV or Excel roster to predict results and flag at-risk students en masse
                </div>
              </div>

              <a href={getSampleDownloadUrl('unlabeled_students_batch.csv')} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px' }} download>
                <Download size={14} /> Download Batch Test Template
              </a>
            </div>

            {batchError && (
              <div className="alert alert-danger">
                <AlertCircle size={16} />
                <span>{batchError}</span>
              </div>
            )}

            <form onSubmit={handleBatchPredict} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div className="form-group" style={{ flex: 1, minWidth: '240px' }}>
                <label className="form-label">Select Unlabeled Roster File (CSV / Excel)</label>
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  className="form-input"
                  onChange={(e) => setBatchFile(e.target.files[0])}
                />
              </div>

              <div className="form-group" style={{ width: '240px' }}>
                <label className="form-label">Classification Model</label>
                <select
                  className="form-select"
                  value={batchModel}
                  onChange={(e) => setBatchModel(e.target.value)}
                >
                  {modelOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }} disabled={isBatchLoading || !batchFile}>
                {isBatchLoading ? <span className="spinner" style={{ width: '16px', height: '16px' }}></span> : <UploadCloud size={16} />}
                Process Batch Predictions
              </button>
            </form>

            {batchResults && (
              <div>
                {/* Batch KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>STUDENTS EVALUATED</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{batchResults.total_students}</div>
                  </div>
                  <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 600 }}>PREDICTED PASSING</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>{batchResults.safe_count}</div>
                  </div>
                  <div style={{ background: '#fef2f2', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #fecaca' }}>
                    <div style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 600 }}>FLAGGED AT-RISK</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626' }}>{batchResults.at_risk_count}</div>
                  </div>
                </div>

                {/* Batch Table */}
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Student ID / Name</th>
                        <th>Attendance %</th>
                        <th>Study Hours</th>
                        <th>Prev Marks</th>
                        <th>Predicted Result</th>
                        <th>Confidence</th>
                        <th>Risk Assessment</th>
                        <th>Primary Contributing Vulnerabilities</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchResults.results?.map((row, idx) => {
                        const isAtRisk = row.Is_At_Risk;
                        return (
                          <tr key={idx} style={{ background: isAtRisk ? '#fff5f5' : 'white' }}>
                            <td style={{ fontWeight: 700 }}>
                              {row.Student_ID || row.Name || `Student ${idx + 1}`}
                            </td>
                            <td>{row.Attendance}%</td>
                            <td>{row.Study_Hours}h</td>
                            <td>{row.Previous_Marks}</td>
                            <td>
                              <span className={`badge ${String(row.Predicted_Result).toLowerCase() === 'pass' ? 'badge-green' : 'badge-red'}`}>
                                {row.Predicted_Result}
                              </span>
                            </td>
                            <td>{row['Confidence_%']}%</td>
                            <td>
                              <span className={`badge ${isAtRisk ? 'badge-red' : 'badge-green'}`}>
                                {row.Risk_Level}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.78rem', color: isAtRisk ? '#991b1b' : 'var(--text-muted)' }}>
                              {row.Primary_Risk_Factors || 'None'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
