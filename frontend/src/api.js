import {
  getSampleCohort,
  computeEDAClient,
  computeModelsClient,
  predictSingleClient,
  parseCSVClient,
  downloadCSVClient
} from './clientEngine';

// API Base configuration
const ENV_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
const API_BASE = ENV_URL ? ENV_URL.replace(/\/+$/, '') + '/api' : 'http://127.0.0.1:8000/api';

// Internal cached state for resilient standalone / Vercel execution
let activeCohortType = 'pass_fail';
let activeCohortStudents = getSampleCohort('pass_fail');
let activeEDA = computeEDAClient(activeCohortStudents);
let activeModels = computeModelsClient(0.2);

export async function checkHealth() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("Backend offline");
    return await res.json();
  } catch (err) {
    // Graceful fallback on Vercel or when Python backend is offline
    return {
      status: "healthy (client-engine)",
      active_dataset: `student_performance_${activeCohortType}.csv`,
      is_trained: true,
      best_model: activeModels.best_model
    };
  }
}

export async function getEDA() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE}/eda`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("Fetch failed");
    return await res.json();
  } catch (err) {
    return activeEDA;
  }
}

export async function uploadDataset(file, targetColumn = "") {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (targetColumn) {
      formData.append("target_column", targetColumn);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${API_BASE}/dataset/upload`, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error("Backend upload failed");
    return await res.json();
  } catch (err) {
    // Client-side parser for Vercel deployment
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const { headers, rows } = parseCSVClient(text);

          const targetCol = targetColumn || headers[headers.length - 1];
          activeCohortStudents = rows.map((r, idx) => ({
            ...r,
            Student_ID: r.Student_ID || `STU${idx + 1000}`,
            Final_Result: r[targetCol] || (r.Attendance >= 60 ? 'Pass' : 'Fail')
          }));

          activeEDA = computeEDAClient(activeCohortStudents);
          activeModels = computeModelsClient(0.2);

          const summary = {
            initial_rows: rows.length,
            cleaned_rows: rows.length,
            missing_values_handled: 0,
            duplicates_removed: 0,
            target_column: targetCol,
            feature_columns: headers.filter(h => h !== targetCol && !h.toLowerCase().includes('id') && !h.toLowerCase().includes('name')),
            class_distribution: activeEDA.target_distribution.labels.reduce((acc, lbl, idx) => {
              acc[lbl] = activeEDA.target_distribution.counts[idx];
              return acc;
            }, {})
          };

          resolve({
            status: "success",
            filename: file.name,
            preprocessing_summary: summary,
            preview: rows.slice(0, 15),
            models_summary: activeModels
          });
        } catch (parseErr) {
          reject(new Error("Unable to parse CSV file: " + parseErr.message));
        }
      };
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsText(file);
    });
  }
}

export async function loadSample(sampleType = "pass_fail") {
  try {
    const formData = new FormData();
    formData.append("sample_type", sampleType);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE}/dataset/load-sample`, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error("Backend sample load failed");
    return await res.json();
  } catch (err) {
    // Client-side fallback
    activeCohortType = sampleType;
    activeCohortStudents = getSampleCohort(sampleType);
    activeEDA = computeEDAClient(activeCohortStudents);
    activeModels = computeModelsClient(0.2);

    const targetCol = sampleType === 'grades' ? 'Grade' : (sampleType === 'categories' ? 'Performance_Category' : 'Final_Result');

    const summary = {
      initial_rows: 600,
      cleaned_rows: 600,
      missing_values_handled: 0,
      duplicates_removed: 0,
      target_column: 'Final_Result',
      feature_columns: ["Study_Hours", "Attendance", "Previous_Marks", "Assignments", "Internal_Marks"],
      class_distribution: activeEDA.target_distribution.labels.reduce((acc, lbl, idx) => {
        acc[lbl] = activeEDA.target_distribution.counts[idx];
        return acc;
      }, {})
    };

    return {
      status: "success",
      filename: `student_performance_${sampleType}.csv`,
      sample_type: sampleType,
      preprocessing_summary: summary,
      preview: activeCohortStudents.slice(0, 15),
      models_summary: activeModels
    };
  }
}

export async function getModelSummary() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE}/model/summary`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("Fetch failed");
    return await res.json();
  } catch (err) {
    return activeModels;
  }
}

export async function trainModels(testSize = 0.2) {
  try {
    const formData = new FormData();
    formData.append("test_size", testSize.toString());

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${API_BASE}/model/train`, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error("Backend train failed");
    return await res.json();
  } catch (err) {
    activeModels = computeModelsClient(testSize);
    return {
      status: "success",
      models_summary: activeModels
    };
  }
}

export async function predictSingleStudent(features, modelName = null) {
  try {
    const payload = {
      features,
      model_name: modelName,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE}/predict/single`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error("Backend prediction failed");
    return await res.json();
  } catch (err) {
    return predictSingleClient(features, modelName || activeModels.best_model);
  }
}

export async function predictBatchStudents(file, modelName = null) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (modelName) {
      formData.append("model_name", modelName);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${API_BASE}/predict/batch`, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error("Batch prediction failed");
    return await res.json();
  } catch (err) {
    // Client-side batch processor
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const { rows } = parseCSVClient(e.target.result);
          const results = rows.map(r => {
            const pred = predictSingleClient(r, modelName || activeModels.best_model);
            return {
              ...r,
              Predicted_Result: pred.predicted_result,
              "Confidence_%": pred.confidence_percentage,
              Risk_Level: pred.risk_assessment.risk_level,
              Is_At_Risk: pred.risk_assessment.is_at_risk,
              Primary_Risk_Factors: pred.risk_assessment.contributing_factors.slice(0, 2).join('; ')
            };
          });

          const atRiskCount = results.filter(r => r.Is_At_Risk).length;
          resolve({
            total_students: results.length,
            at_risk_count: atRiskCount,
            safe_count: results.length - atRiskCount,
            model_used: modelName || activeModels.best_model,
            results
          });
        } catch (batchErr) {
          reject(new Error("Unable to process batch file: " + batchErr.message));
        }
      };
      reader.onerror = () => reject(new Error("Error reading batch file"));
      reader.readAsText(file);
    });
  }
}

export async function getAtRiskStudents() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE}/at-risk/list`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("Fetch failed");
    return await res.json();
  } catch (err) {
    // Extract at risk students from active cohort
    const atRiskList = activeCohortStudents
      .filter(s => String(s.Final_Result).toLowerCase() === 'fail' || s.Attendance < 75 || s.Study_Hours < 2.5)
      .map(s => {
        const pred = predictSingleClient(s, activeModels.best_model);
        return {
          Student_ID: s.Student_ID,
          Name: s.Name,
          Attendance: s.Attendance,
          Study_Hours: s.Study_Hours,
          Previous_Marks: s.Previous_Marks,
          Internal_Marks: s.Internal_Marks,
          Predicted_Result: pred.predicted_result,
          Risk_Level: pred.risk_assessment.risk_level,
          Is_At_Risk: true,
          Primary_Risk_Factors: pred.risk_assessment.contributing_factors.slice(0, 2).join('; ')
        };
      });

    return {
      source: `student_performance_${activeCohortType}.csv`,
      total_at_risk: atRiskList.length,
      total_analyzed: activeCohortStudents.length,
      students: atRiskList
    };
  }
}

// Download URL helpers with fallback
export function getPdfReportUrl() {
  return `${API_BASE}/report/download-pdf`;
}

export function getCsvReportUrl() {
  return `${API_BASE}/report/download-csv`;
}

export function getSampleDownloadUrl(sampleFilename) {
  // Directly downloads from frontend public folder on Vercel!
  return `/sample_data/${sampleFilename}`;
}

export function triggerBrowserCSVDownload(data, filename) {
  downloadCSVClient(data, filename);
}
