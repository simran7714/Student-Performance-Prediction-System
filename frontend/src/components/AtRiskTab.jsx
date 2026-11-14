import React, { useState } from 'react';
import {
  AlertTriangle,
  UserX,
  Search,
  Filter,
  Download,
  Lightbulb,
  CheckCircle,
  Eye,
  X
} from 'lucide-react';
import { getCsvReportUrl, triggerBrowserCSVDownload } from '../api';

export default function AtRiskTab({ atRiskData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const students = atRiskData?.students || [];
  const totalAnalyzed = atRiskData?.total_analyzed || students.length;
  const totalAtRisk = atRiskData?.total_at_risk || students.length;
  const riskPercentage = totalAnalyzed > 0 ? ((totalAtRisk / totalAnalyzed) * 100).toFixed(1) : 0;

  // Filter students based on search and severity
  const filteredStudents = students.filter((s) => {
    const nameOrId = `${s.Student_ID || ''} ${s.Name || ''}`.toLowerCase();
    const matchesSearch = nameOrId.includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (severityFilter === 'ALL') return true;
    if (severityFilter === 'HIGH') return String(s.Risk_Level).toLowerCase().includes('high') || String(s.Risk_Level).toLowerCase().includes('critical');
    if (severityFilter === 'MEDIUM') return String(s.Risk_Level).toLowerCase().includes('medium') || String(s.Risk_Level).toLowerCase().includes('moderate');
    return true;
  });

  const handleExportCSV = (e) => {
    e.preventDefault();
    if (filteredStudents && filteredStudents.length > 0) {
      triggerBrowserCSVDownload(filteredStudents, 'at_risk_students_roster.csv');
    } else {
      window.open(getCsvReportUrl(), '_blank');
    }
  };

  return (
    <div>
      {/* Overview Banner */}
      <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
        <div className="card-header">
          <div>
            <div className="card-title" style={{ color: '#b91c1c' }}>
              <AlertTriangle size={22} color="#dc2626" /> Early Warning System: Academically Vulnerable Cohort
            </div>
            <div className="card-subtitle">
              Early identification enables institutional advisors and faculty to deploy timely interventions before semester finals.
            </div>
          </div>

          <button onClick={handleExportCSV} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <Download size={14} /> Export At-Risk CSV
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '12px' }}>
          <div style={{ background: '#fef2f2', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #fecaca' }}>
            <div style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 600 }}>IDENTIFIED AT-RISK STUDENTS</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#dc2626' }}>{totalAtRisk}</div>
            <div style={{ fontSize: '0.75rem', color: '#b91c1c' }}>{riskPercentage}% of monitored student body</div>
          </div>

          <div style={{ background: '#fffbeb', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #fde68a' }}>
            <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>ATTENDANCE DEFICIT &lt; 75%</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706' }}>
              {students.filter(s => s.Attendance < 75).length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#b45309' }}>Primary non-compliance indicator</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>STUDY DEFICIT &lt; 2.5 HRS</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b' }}>
              {students.filter(s => s.Study_Hours < 2.5).length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Require time-management mentorship</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="#64748b" />
            <input
              type="text"
              className="form-input"
              style={{ width: '100%' }}
              placeholder="Search by Student ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="#64748b" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Severity:</span>
            <select
              className="form-select"
              style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="ALL">All At-Risk ({students.length})</option>
              <option value="HIGH">High / Critical Risk</option>
              <option value="MEDIUM">Medium / Moderate Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* At-Risk Students Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <UserX size={18} color="#dc2626" /> Vulnerable Students Roster
            </div>
            <div className="card-subtitle">Showing {filteredStudents.length} students requiring academic support</div>
          </div>
          <span className="badge badge-red">{filteredStudents.length} Students</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Attendance %</th>
                <th>Study Hours</th>
                <th>Prev Marks</th>
                <th>Internal</th>
                <th>Predicted Result</th>
                <th>Risk Severity</th>
                <th>Primary Vulnerabilities</th>
                <th>Intervention</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s, idx) => {
                  const isCritical = String(s.Risk_Level).toLowerCase().includes('high') || String(s.Risk_Level).toLowerCase().includes('critical');
                  return (
                    <tr key={idx} style={{ background: isCritical ? '#fff8f8' : 'white' }}>
                      <td style={{ fontWeight: 700, color: '#1e3a8a' }}>
                        {s.Student_ID || `STU${idx + 1000}`}
                      </td>
                      <td>{s.Name || 'Anonymous Student'}</td>
                      <td style={{ color: s.Attendance < 75 ? '#dc2626' : 'inherit', fontWeight: s.Attendance < 75 ? 700 : 400 }}>
                        {s.Attendance}% {s.Attendance < 75 ? '⚠️' : ''}
                      </td>
                      <td style={{ color: s.Study_Hours < 2.5 ? '#dc2626' : 'inherit', fontWeight: s.Study_Hours < 2.5 ? 700 : 400 }}>
                        {s.Study_Hours}h/day
                      </td>
                      <td>{s.Previous_Marks}</td>
                      <td>{s.Internal_Marks}</td>
                      <td>
                        <span className={`badge ${String(s.Predicted_Result).toLowerCase() === 'pass' ? 'badge-green' : 'badge-red'}`}>
                          {s.Predicted_Result}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isCritical ? 'badge-red' : 'badge-amber'}`}>
                          {s.Risk_Level}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.78rem', maxWidth: '280px', whiteSpace: 'normal', color: '#475569' }}>
                        {s.Primary_Risk_Factors || 'Attendance / Study Deficit'}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline"
                          style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                          onClick={() => setSelectedStudent(s)}
                        >
                          <Eye size={12} /> Plan
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No students matching the current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Student Intervention Modal */}
      {selectedStudent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-xl)',
            padding: '28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  Intervention Plan: {selectedStudent.Name || selectedStudent.Student_ID}
                </h3>
                <span className="badge badge-red" style={{ marginTop: '4px' }}>
                  {selectedStudent.Risk_Level}
                </span>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div><strong>Attendance:</strong> <span style={{ color: selectedStudent.Attendance < 75 ? '#dc2626' : 'inherit', fontWeight: 700 }}>{selectedStudent.Attendance}%</span></div>
                <div><strong>Study Hours:</strong> <span style={{ color: selectedStudent.Study_Hours < 2.5 ? '#dc2626' : 'inherit', fontWeight: 700 }}>{selectedStudent.Study_Hours} hrs/day</span></div>
                <div><strong>Previous Exam:</strong> {selectedStudent.Previous_Marks}/100</div>
                <div><strong>Internal Marks:</strong> {selectedStudent.Internal_Marks}/25</div>
                <div><strong>Predicted Status:</strong> <span style={{ fontWeight: 700, color: '#dc2626' }}>{selectedStudent.Predicted_Result}</span></div>
                <div><strong>Confidence:</strong> {selectedStudent['Confidence_%'] || 88.5}%</div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px', color: '#991b1b' }}>
                Primary Academic Vulnerabilities:
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#334155' }}>
                {selectedStudent.Primary_Risk_Factors || 'Low attendance rate below 75% and insufficient revision hours.'}
              </p>
            </div>

            <div style={{ background: '#eff6ff', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e40af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lightbulb size={16} /> Prescribed Teacher Remedial Action Plan:
              </h4>
              <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: '#1e3a8a' }}>
                {selectedStudent.Attendance < 75 && (
                  <li style={{ marginBottom: '6px' }}>
                    <strong>Mandatory Attendance Counseling:</strong> Summon student and parent/guardian for a review contract to reach the 75% examination threshold.
                  </li>
                )}
                {selectedStudent.Study_Hours < 2.5 && (
                  <li style={{ marginBottom: '6px' }}>
                    <strong>Supervised Study Sessions:</strong> Enroll student in structured 2-hour daily study tables in the department library.
                  </li>
                )}
                {selectedStudent.Previous_Marks < 50 && (
                  <li style={{ marginBottom: '6px' }}>
                    <strong>Peer Tutoring:</strong> Assign a high-achieving peer mentor for one-on-one prerequisite coaching twice weekly.
                  </li>
                )}
                <li style={{ marginBottom: '4px' }}>
                  <strong>Progress Check:</strong> Schedule bi-weekly diagnostic check-in with academic advisor.
                </li>
              </ul>
            </div>

            <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setSelectedStudent(null)}>
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
