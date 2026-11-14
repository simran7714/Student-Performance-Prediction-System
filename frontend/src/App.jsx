import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardTab from './components/DashboardTab';
import DatasetTab from './components/DatasetTab';
import EDATab from './components/EDATab';
import ModelTrainingTab from './components/ModelTrainingTab';
import PredictTab from './components/PredictTab';
import AtRiskTab from './components/AtRiskTab';
import ReportsTab from './components/ReportsTab';

import {
  checkHealth,
  getEDA,
  getModelSummary,
  getAtRiskStudents,
  loadSample
} from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isHealthy, setIsHealthy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDataset, setActiveDataset] = useState('student_performance_pass_fail.csv');

  const [prepSummary, setPrepSummary] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [edaData, setEdaData] = useState(null);
  const [modelsData, setModelsData] = useState(null);
  const [atRiskData, setAtRiskData] = useState(null);

  // Initial load on component mount
  useEffect(() => {
    async function initSystem() {
      setIsLoading(true);
      try {
        const health = await checkHealth();
        setIsHealthy(true);
        setActiveDataset(health.active_dataset);

        // Fetch EDA
        const eda = await getEDA();
        setEdaData(eda);

        // Fetch Models
        const models = await getModelSummary();
        setModelsData(models);

        // Fetch At-Risk
        const atRisk = await getAtRiskStudents();
        setAtRiskData(atRisk);

        // If prep summary not loaded yet, load default sample metadata
        if (!prepSummary) {
          const sample = await loadSample('pass_fail');
          setPrepSummary(sample.preprocessing_summary);
          setPreviewData(sample.preview);
        }
      } catch (err) {
        console.warn('Backend initialization note:', err.message);
        // Fallback: try loading sample pass_fail
        try {
          const sample = await loadSample('pass_fail');
          setIsHealthy(true);
          setActiveDataset(sample.filename);
          setPrepSummary(sample.preprocessing_summary);
          setPreviewData(sample.preview);
          setModelsData(sample.models_summary);

          const eda = await getEDA();
          setEdaData(eda);

          const atRisk = await getAtRiskStudents();
          setAtRiskData(atRisk);
        } catch (sampleErr) {
          console.error('Sample initialization error:', sampleErr);
        }
      } finally {
        setIsLoading(false);
      }
    }

    initSystem();
  }, []);

  const handleDatasetUpdated = (res) => {
    setActiveDataset(res.filename);
    setPrepSummary(res.preprocessing_summary);
    setPreviewData(res.preview);
    if (res.models_summary) {
      setModelsData(res.models_summary);
    }

    // Refresh EDA and At-risk lists
    getEDA().then(setEdaData).catch(console.error);
    getAtRiskStudents().then(setAtRiskData).catch(console.error);
  };

  const handleModelsRetrained = (newModelsSummary) => {
    setModelsData(newModelsSummary);
    getAtRiskStudents().then(setAtRiskData).catch(console.error);
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeDataset={activeDataset}
        bestModel={modelsData?.best_model}
        isHealthy={isHealthy}
      />

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardTab
            edaData={edaData}
            modelsData={modelsData}
            prepSummary={prepSummary}
            atRiskData={atRiskData}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'dataset' && (
          <DatasetTab
            activeDataset={activeDataset}
            prepSummary={prepSummary}
            previewData={previewData}
            onDatasetUpdated={handleDatasetUpdated}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}

        {activeTab === 'eda' && (
          <EDATab
            edaData={edaData}
            prepSummary={prepSummary}
          />
        )}

        {activeTab === 'models' && (
          <ModelTrainingTab
            modelsData={modelsData}
            onModelsRetrained={handleModelsRetrained}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}

        {activeTab === 'predict' && (
          <PredictTab
            modelsData={modelsData}
          />
        )}

        {activeTab === 'at-risk' && (
          <AtRiskTab
            atRiskData={atRiskData}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsTab
            activeDataset={activeDataset}
            prepSummary={prepSummary}
            modelsData={modelsData}
            edaData={edaData}
            atRiskData={atRiskData}
          />
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '24px 32px',
        borderTop: '1px solid var(--border)',
        background: 'white',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
          Student Performance Prediction System Using Machine Learning
        </div>
        <div>
          "Analyze Student Performance. Predict Academic Success." • Minor Academic Project in Computer Science and Engineering
        </div>
      </footer>
    </div>
  );
}
