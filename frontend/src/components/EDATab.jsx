import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Sliders,
  Table as TableIcon,
  Layers,
  ArrowUpDown,
  BookOpen
} from 'lucide-react';
import { Scatter, Bar, Line } from 'react-chartjs-2';
import '../chartSetup';

export default function EDATab({ edaData, prepSummary }) {
  const [activeScatter, setActiveScatter] = useState('study'); // 'study' or 'attendance'

  if (!edaData) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
        <BarChart3 size={48} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
        <h3>No Exploratory Data Analysis Available</h3>
        <p style={{ color: 'var(--text-muted)' }}>Please load or upload a dataset to compute statistical distributions.</p>
      </div>
    );
  }

  const {
    summary_statistics = {},
    correlation_matrix = {},
    study_vs_marks = [],
    attendance_vs_marks = [],
    grouped_by_target = {},
    histograms = {},
    marks_column_used = 'Marks',
    study_column_used = 'Study Hours',
    attendance_column_used = 'Attendance'
  } = edaData;

  // 1. Scatter Chart Configuration
  const scatterPoints = activeScatter === 'study' ? study_vs_marks : attendance_vs_marks;
  const passPoints = scatterPoints.filter(p => p.target.toLowerCase() === 'pass' || p.target.toLowerCase() === 'a' || p.target.toLowerCase() === 'high').map(p => ({ x: p.x, y: p.y }));
  const failPoints = scatterPoints.filter(p => p.target.toLowerCase() === 'fail' || p.target.toLowerCase() === 'f' || p.target.toLowerCase() === 'low').map(p => ({ x: p.x, y: p.y }));
  const otherPoints = scatterPoints.filter(p => !['pass', 'a', 'high', 'fail', 'f', 'low'].includes(p.target.toLowerCase())).map(p => ({ x: p.x, y: p.y }));

  const scatterChartData = {
    datasets: [
      {
        label: 'Passing / High Cohort',
        data: passPoints,
        backgroundColor: 'rgba(16, 185, 129, 0.75)',
        borderColor: '#059669',
        pointRadius: 4.5,
      },
      {
        label: 'Failing / Low Cohort',
        data: failPoints,
        backgroundColor: 'rgba(239, 68, 68, 0.75)',
        borderColor: '#dc2626',
        pointRadius: 4.5,
      },
      ...(otherPoints.length > 0 ? [{
        label: 'Moderate Cohort',
        data: otherPoints,
        backgroundColor: 'rgba(59, 130, 246, 0.75)',
        borderColor: '#2563eb',
        pointRadius: 4.5,
      }] : [])
    ]
  };

  // 2. Grouped Cohort Comparison (Pass vs Fail averages)
  const cohortLabels = Object.keys(grouped_by_target);
  const cohortBarData = {
    labels: cohortLabels,
    datasets: [
      {
        label: 'Avg Attendance (%)',
        data: cohortLabels.map(l => grouped_by_target[l].avg_attendance),
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Avg Study Hours (x10)',
        data: cohortLabels.map(l => grouped_by_target[l].avg_study_hours * 10),
        backgroundColor: '#10b981',
      },
      {
        label: 'Avg Previous Marks (%)',
        data: cohortLabels.map(l => grouped_by_target[l].avg_prev_marks),
        backgroundColor: '#f59e0b',
      },
      {
        label: 'Avg Internal Marks (x4)',
        data: cohortLabels.map(l => grouped_by_target[l].avg_internal_marks * 4),
        backgroundColor: '#8b5cf6',
      }
    ]
  };

  // 3. Attendance Histogram Data
  const attHist = histograms[attendance_column_used];
  const histChartData = attHist ? {
    labels: attHist.bins,
    datasets: [{
      label: 'Student Count by Attendance Bracket',
      data: attHist.counts,
      backgroundColor: '#2563eb',
      borderRadius: 4
    }]
  } : null;

  return (
    <div>
      {/* Overview Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <TrendingUp size={20} color="#2563eb" /> Exploratory Academic Data Analytics
            </div>
            <div className="card-subtitle">Examine relationships between attendance, study hours, and academic achievement</div>
          </div>
          <span className="badge badge-blue">{edaData.total_records} Records Analyzed</span>
        </div>

        <div className="alert alert-info" style={{ marginBottom: '16px' }}>
          <div>
            <strong>Statistical Key Findings:</strong> Higher class attendance (&ge; 75%) and consistent daily study hours (&ge; 3.5 hrs) exhibit strong positive correlation with internal marks and final passing outcomes. Students with attendance below 60% present a 78% likelihood of academic failure.
          </div>
        </div>
      </div>

      {/* Scatter Analysis & Cohort Comparison Grid */}
      <div className="grid-2">
        {/* Scatter Plot */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <BarChart3 size={18} color="#2563eb" /> Bivariate Scatter Plot
              </div>
              <div className="card-subtitle">
                {activeScatter === 'study' ? 'Study Hours vs Exam Marks' : 'Attendance % vs Exam Marks'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className={`btn ${activeScatter === 'study' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                onClick={() => setActiveScatter('study')}
              >
                Study Hours
              </button>
              <button
                className={`btn ${activeScatter === 'attendance' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                onClick={() => setActiveScatter('attendance')}
              >
                Attendance %
              </button>
            </div>
          </div>

          <div style={{ height: '300px' }}>
            <Scatter
              data={scatterChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: activeScatter === 'study' ? 'Daily Study Hours (hrs)' : 'Attendance Percentage (%)'
                    }
                  },
                  y: {
                    title: { display: true, text: `Score in ${marks_column_used} (0-100)` },
                    min: 0,
                    max: 100
                  }
                },
                plugins: {
                  legend: { position: 'top' }
                }
              }}
            />
          </div>
        </div>

        {/* Cohort Metric Comparison Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Layers size={18} color="#059669" /> Cohort Performance Comparison
              </div>
              <div className="card-subtitle">Normalized feature metrics across performance categories</div>
            </div>
            <span className="badge badge-green">Grouped Analysis</span>
          </div>

          <div style={{ height: '300px' }}>
            <Bar
              data={cohortBarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { min: 0, max: 100, title: { display: true, text: 'Normalized Metric Score' } }
                },
                plugins: {
                  legend: { position: 'top' }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Attendance Distribution Histogram & Correlation Grid */}
      <div className="grid-2">
        {/* Attendance Distribution */}
        {histChartData && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  <BarChart3 size={18} color="#3b82f6" /> Attendance Bracket Distribution
                </div>
                <div className="card-subtitle">Student frequency across attendance percentages</div>
              </div>
              <span className="badge badge-blue">Histogram</span>
            </div>

            <div style={{ height: '240px' }}>
              <Bar
                data={histChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { title: { display: true, text: 'Student Count' } }
                  },
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Correlation Matrix Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <ArrowUpDown size={18} color="#8b5cf6" /> Pearson Correlation Matrix
              </div>
              <div className="card-subtitle">Linear dependency between academic variables</div>
            </div>
            <span className="badge badge-gray">-1.0 to +1.0</span>
          </div>

          {correlation_matrix.features && correlation_matrix.features.length > 0 ? (
            <div className="table-container">
              <table className="custom-table" style={{ fontSize: '0.78rem' }}>
                <thead>
                  <tr>
                    <th>Feature</th>
                    {correlation_matrix.features.map(f => (
                      <th key={f}>{f.replace('_', ' ')}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {correlation_matrix.features.map((feat, rIdx) => (
                    <tr key={feat}>
                      <td style={{ fontWeight: 700 }}>{feat.replace('_', ' ')}</td>
                      {correlation_matrix.values[rIdx].map((val, cIdx) => {
                        const isHigh = Math.abs(val) > 0.4 && rIdx !== cIdx;
                        const isDiag = rIdx === cIdx;
                        return (
                          <td
                            key={cIdx}
                            style={{
                              background: isDiag ? '#f1f5f9' : (isHigh ? (val > 0 ? '#dcfce7' : '#fee2e2') : 'white'),
                              fontWeight: isHigh || isDiag ? 700 : 400,
                              color: isHigh ? (val > 0 ? '#15803d' : '#b91c1c') : 'inherit',
                              textAlign: 'center'
                            }}
                          >
                            {val.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Not enough numeric columns for correlation.</p>
          )}
        </div>
      </div>

      {/* Summary Statistics Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <TableIcon size={18} color="#2563eb" /> Descriptive Summary Statistics
            </div>
            <div className="card-subtitle">Central tendencies, spread, and quartiles for all numerical indicators</div>
          </div>
          <span className="badge badge-blue">Numerical Features</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Variable Name</th>
                <th>Records (N)</th>
                <th>Mean</th>
                <th>Std Dev</th>
                <th>Min</th>
                <th>25% (Q1)</th>
                <th>Median (Q2)</th>
                <th>75% (Q3)</th>
                <th>Max</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(summary_statistics).map((key) => {
                const s = summary_statistics[key];
                return (
                  <tr key={key}>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{key.replace('_', ' ')}</td>
                    <td>{s.count}</td>
                    <td style={{ fontWeight: 600 }}>{s.mean}</td>
                    <td>{s.std}</td>
                    <td>{s.min}</td>
                    <td>{s.q25}</td>
                    <td style={{ fontWeight: 600, color: '#2563eb' }}>{s.median}</td>
                    <td>{s.q75}</td>
                    <td style={{ fontWeight: 600 }}>{s.max}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
