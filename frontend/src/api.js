const API_BASE = "http://127.0.0.1:8000/api";

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Backend server unreachable");
  return res.json();
}

export async function getEDA() {
  const res = await fetch(`${API_BASE}/eda`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to fetch EDA data" }));
    throw new Error(err.detail || "Failed to fetch EDA data");
  }
  return res.json();
}

export async function uploadDataset(file, targetColumn = "") {
  const formData = new FormData();
  formData.append("file", file);
  if (targetColumn) {
    formData.append("target_column", targetColumn);
  }

  const res = await fetch(`${API_BASE}/dataset/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Dataset upload failed" }));
    throw new Error(err.detail || "Dataset upload failed");
  }
  return res.json();
}

export async function loadSample(sampleType = "pass_fail") {
  const formData = new FormData();
  formData.append("sample_type", sampleType);

  const res = await fetch(`${API_BASE}/dataset/load-sample`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to load sample dataset" }));
    throw new Error(err.detail || "Failed to load sample dataset");
  }
  return res.json();
}

export async function getModelSummary() {
  const res = await fetch(`${API_BASE}/model/summary`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to fetch model metrics" }));
    throw new Error(err.detail || "Failed to fetch model metrics");
  }
  return res.json();
}

export async function trainModels(testSize = 0.2) {
  const formData = new FormData();
  formData.append("test_size", testSize.toString());

  const res = await fetch(`${API_BASE}/model/train`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Model training failed" }));
    throw new Error(err.detail || "Model training failed");
  }
  return res.json();
}

export async function predictSingleStudent(features, modelName = null) {
  const payload = {
    features,
    model_name: modelName,
  };

  const res = await fetch(`${API_BASE}/predict/single`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Prediction failed" }));
    throw new Error(err.detail || "Prediction failed");
  }
  return res.json();
}

export async function predictBatchStudents(file, modelName = null) {
  const formData = new FormData();
  formData.append("file", file);
  if (modelName) {
    formData.append("model_name", modelName);
  }

  const res = await fetch(`${API_BASE}/predict/batch`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Batch prediction failed" }));
    throw new Error(err.detail || "Batch prediction failed");
  }
  return res.json();
}

export async function getAtRiskStudents() {
  const res = await fetch(`${API_BASE}/at-risk/list`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to fetch at-risk students" }));
    throw new Error(err.detail || "Failed to fetch at-risk students");
  }
  return res.json();
}

export function getPdfReportUrl() {
  return `${API_BASE}/report/download-pdf`;
}

export function getCsvReportUrl() {
  return `${API_BASE}/report/download-csv`;
}

export function getSampleDownloadUrl(sampleFilename) {
  return `${API_BASE}/samples/download/${sampleFilename}`;
}
