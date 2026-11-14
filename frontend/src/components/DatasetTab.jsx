import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Database,
  Download,
  Filter,
  RefreshCw,
  Info
} from 'lucide-react';
import { uploadDataset, loadSample, getSampleDownloadUrl } from '../api';

export default function DatasetTab({
  activeDataset,
  prepSummary,
  previewData,
  onDatasetUpdated,
  isLoading,
  setIsLoading
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetColInput, setTargetColInput] = useState('');
  const [sampleType, setSampleType] = useState('pass_fail');
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage({ type: 'danger', text: 'Please select a CSV or Excel file to upload.' });
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);
      const res = await uploadDataset(selectedFile, targetColInput);
      setMessage({ type: 'success', text: `Successfully uploaded and validated ${res.filename} (${res.preprocessing_summary.cleaned_rows} records). ML models trained!` });
      onDatasetUpdated(res);
      setSelectedFile(null);
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Dataset upload failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = async (type) => {
    try {
      setIsLoading(true);
      setSampleType(type);
      setMessage(null);
      const res = await loadSample(type);
      setMessage({ type: 'success', text: `Loaded sample dataset: ${res.filename} with ${res.preprocessing_summary.cleaned_rows} student records.` });
      onDatasetUpdated(res);
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to load sample dataset' });
    } finally {
      setIsLoading(false);
    }
  };

  const previewCols = previewData && previewData.length > 0 ? Object.keys(previewData[0]) : [];

  return (
    <div>
      {/* Notifications */}
      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Upload and Sample Selectors Grid */}
      <div className="grid-2">
        {/* Upload Custom Dataset Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <UploadCloud size={20} color="#2563eb" /> Upload Academic Dataset
              </div>
              <div className="card-subtitle">Support for CSV and Excel (.xlsx, .xls) institutional records</div>
            </div>
            <span className="badge badge-blue">Upload</span>
          </div>

          <form onSubmit={handleUpload}>
            <div style={{
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '28px 20px',
              textAlign: 'center',
              background: '#f8fafc',
              cursor: 'pointer',
              marginBottom: '16px'
            }}>
              <FileSpreadsheet size={40} color="#64748b" style={{ margin: '0 auto 8px' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                {selectedFile ? selectedFile.name : 'Choose a file or drag & drop here'}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Accepted formats: .csv, .xlsx, .xls (Up to 10MB)
              </p>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
                style={{ marginTop: '12px', fontSize: '0.85rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">
                Target Column (Optional)
                <span className="form-hint">Auto-detected if left empty</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Final_Result, Grade, Status"
                value={targetColInput}
                onChange={(e) => setTargetColInput(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading || !selectedFile}>
              {isLoading ? <span className="spinner" style={{ width: '18px', height: '18px' }}></span> : <UploadCloud size={16} />}
              Upload, Validate & Train Models
            </button>
          </form>
        </div>

        {/* Preloaded Sample Datasets Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Database size={20} color="#059669" /> Preloaded Academic Datasets
              </div>
              <div className="card-subtitle">Quickly test with realistic academic records</div>
            </div>
            <span className="badge badge-green">Instant Testing</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Switch between binary Pass/Fail targets, 5-scale letter grades, or 3-tier academic capability categories:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            <button
              className={`btn ${activeDataset?.includes('pass_fail') ? 'btn-primary' : 'btn-outline'}`}
              style={{ justifyContent: 'space-between', padding: '12px 16px' }}
              onClick={() => handleLoadSample('pass_fail')}
              disabled={isLoading}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700 }}>1. Binary Dataset (Pass / Fail)</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>600 students • Features: Study Hours, Attendance, Internal, Assignments</div>
              </div>
              <span className="badge badge-green">Pass/Fail</span>
            </button>

            <button
              className={`btn ${activeDataset?.includes('grades') ? 'btn-primary' : 'btn-outline'}`}
              style={{ justifyContent: 'space-between', padding: '12px 16px' }}
              onClick={() => handleLoadSample('grades')}
              disabled={isLoading}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700 }}>2. Multi-Class Letter Grades (A, B, C, D, F)</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>600 students • 5 distinct performance tiers</div>
              </div>
              <span className="badge badge-blue">Grades</span>
            </button>

            <button
              className={`btn ${activeDataset?.includes('categories') ? 'btn-primary' : 'btn-outline'}`}
              style={{ justifyContent: 'space-between', padding: '12px 16px' }}
              onClick={() => handleLoadSample('categories')}
              disabled={isLoading}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700 }}>3. Performance Categories (High / Medium / Low)</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>600 students • Strategic institutional intervention bands</div>
              </div>
              <span className="badge badge-amber">Tiers</span>
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Download sample templates for offline editing:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href={getSampleDownloadUrl('student_performance_pass_fail.csv')} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '6px 10px' }} download>
                <Download size={13} /> Pass/Fail CSV
              </a>
              <a href={getSampleDownloadUrl('unlabeled_students_batch.csv')} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '6px 10px' }} download>
                <Download size={13} /> Batch Test CSV
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Preprocessing Summary Audit */}
      {prepSummary && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <CheckCircle2 size={20} color="#10b981" /> Preprocessing & Validation Audit
              </div>
              <div className="card-subtitle">Automated data cleaning, missing value imputation, and feature extraction</div>
            </div>
            <span className="badge badge-green">Validated</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>INITIAL ROWS</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{prepSummary.initial_rows}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CLEANED RECORDS</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>{prepSummary.cleaned_rows}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>MISSING VALUES IMPUTED</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{prepSummary.missing_values_handled}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DUPLICATES REMOVED</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{prepSummary.duplicates_removed}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TARGET COLUMN</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb' }}>{prepSummary.target_column}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Features Used for Machine Learning:</span>
            {prepSummary.feature_columns?.map((feat) => (
              <span key={feat} className="badge badge-blue">
                {feat}
              </span>
            ))}
            {prepSummary.id_columns?.length > 0 && (
              <>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-light)', marginLeft: '12px' }}>Excluded IDs:</span>
                {prepSummary.id_columns.map(id => (
                  <span key={id} className="badge badge-gray">{id}</span>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Dataset Preview Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <FileSpreadsheet size={18} color="#2563eb" /> Dataset Preview (First 15 Records)
            </div>
            <div className="card-subtitle">Active Dataset: <strong>{activeDataset || 'None'}</strong></div>
          </div>
          <span className="badge badge-gray">{prepSummary?.cleaned_rows || 0} Total Records</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                {previewCols.map((col) => (
                  <th key={col} style={{
                    color: col === prepSummary?.target_column ? '#2563eb' : 'inherit',
                    background: col === prepSummary?.target_column ? '#eff6ff' : '#f8fafc'
                  }}>
                    {col} {col === prepSummary?.target_column && '(Target)'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData && previewData.length > 0 ? (
                previewData.map((row, idx) => (
                  <tr key={idx}>
                    {previewCols.map((col) => {
                      const val = row[col];
                      const isTarget = col === prepSummary?.target_column;
                      const isFail = String(val).toLowerCase() === 'fail' || String(val).toLowerCase() === 'f';
                      return (
                        <td key={col} style={{ fontWeight: isTarget ? 700 : 400 }}>
                          {isTarget ? (
                            <span className={`badge ${isFail ? 'badge-red' : 'badge-green'}`}>
                              {val}
                            </span>
                          ) : (
                            val !== null && val !== undefined ? String(val) : '—'
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={previewCols.length || 6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No dataset loaded yet. Please upload a dataset or select a sample above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
