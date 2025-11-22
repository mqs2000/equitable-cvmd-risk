// Approximate logistic regression coefficients derived from UCI Heart Disease dataset
// These are for educational simulation to run client-side without a heavy Python backend.
export const MODEL_COEFFICIENTS = {
  intercept: -3.5,
  age: 0.03,
  sex: 1.2, // Historical bias: Being male often increases risk score in this dataset
  cp: 0.8,
  trestbps: 0.015,
  chol: 0.005,
  fbs: 0.1,
  restecg: 0.3,
  thalach: -0.02, // Higher max heart rate is usually better (negative risk)
  exang: 0.9,
  oldpeak: 0.5,
  slope: 0.4,
  ca: 0.8,
  thal: 0.7
};

export const DATASET_URL = 'https://raw.githubusercontent.com/ageron/data/main/heart.csv';

export const DEFAULT_PATIENT = {
  age: 55,
  sex: 1,
  cp: 1,
  trestbps: 130,
  chol: 240,
  fbs: 0,
  restecg: 1,
  thalach: 150,
  exang: 0,
  oldpeak: 1.0,
  slope: 1,
  ca: 0,
  thal: 2
};
