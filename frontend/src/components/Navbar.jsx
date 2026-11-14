import React from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  Database,
  BarChart3,
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  FileText,
  Home
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, activeDataset, bestModel, isHealthy }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'dataset', label: 'Dataset Management', icon: Database },
    { id: 'eda', label: 'Data Analysis (EDA)', icon: BarChart3 },
    { id: 'models', label: 'Model Training', icon: BrainCircuit },
    { id: 'predict', label: 'Student Predictor', icon: Sparkles },
    { id: 'at-risk', label: 'At-Risk Identification', icon: AlertTriangle },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-section" onClick={() => setActiveTab('landing')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-badge">
            <GraduationCap size={26} strokeWidth={2.2} />
          </div>
          <div className="brand-titles">
            <h1>Student Performance Prediction System</h1>
            <div className="brand-tagline">"Analyze Student Performance. Predict Academic Success."</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setActiveTab('landing')}
          >
            <Home size={14} /> Back to Landing Page
          </button>

          {bestModel && (
            <div className="nav-status-badge" style={{ background: '#eff6ff', borderColor: '#bfdbfe', color: '#1d4ed8' }}>
              <BrainCircuit size={14} />
              <span>Best Model: <strong>{bestModel}</strong></span>
            </div>
          )}

          <div className="nav-status-badge">
            <span className="status-dot" style={{ background: isHealthy ? '#10b981' : '#ef4444' }}></span>
            <span>Dataset: <strong>{activeDataset || 'None'}</strong></span>
          </div>
        </div>
      </div>

      <nav className="tabs-bar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={17} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
