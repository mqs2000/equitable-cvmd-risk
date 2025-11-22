import { PatientData, FairnessReport, Metrics } from '../types';
import { MODEL_COEFFICIENTS } from '../constants';

// 1. Inference Logic (Simulating Logistic Regression)
export const predictRisk = (patient: PatientData): number => {
  let logOdds = MODEL_COEFFICIENTS.intercept;
  logOdds += patient.age * MODEL_COEFFICIENTS.age;
  logOdds += patient.sex * MODEL_COEFFICIENTS.sex;
  logOdds += patient.cp * MODEL_COEFFICIENTS.cp;
  logOdds += patient.trestbps * MODEL_COEFFICIENTS.trestbps;
  logOdds += patient.chol * MODEL_COEFFICIENTS.chol;
  logOdds += patient.fbs * MODEL_COEFFICIENTS.fbs;
  logOdds += patient.restecg * MODEL_COEFFICIENTS.restecg;
  logOdds += patient.thalach * MODEL_COEFFICIENTS.thalach;
  logOdds += patient.exang * MODEL_COEFFICIENTS.exang;
  logOdds += patient.oldpeak * MODEL_COEFFICIENTS.oldpeak;
  logOdds += patient.slope * MODEL_COEFFICIENTS.slope;
  logOdds += patient.ca * MODEL_COEFFICIENTS.ca;
  logOdds += patient.thal * MODEL_COEFFICIENTS.thal;

  // Sigmoid function
  const probability = 1 / (1 + Math.exp(-logOdds));
  return probability;
};

// 2. Local Explainability
export const explainPrediction = (patient: PatientData) => {
  const contributions = [
    { name: 'Age', val: patient.age * MODEL_COEFFICIENTS.age },
    { name: 'Sex', val: patient.sex * MODEL_COEFFICIENTS.sex },
    { name: 'Chest Pain', val: patient.cp * MODEL_COEFFICIENTS.cp },
    { name: 'Resting BP', val: patient.trestbps * MODEL_COEFFICIENTS.trestbps },
    { name: 'Cholesterol', val: patient.chol * MODEL_COEFFICIENTS.chol },
    { name: 'Max Heart Rate', val: patient.thalach * MODEL_COEFFICIENTS.thalach },
    { name: 'Exercise Angina', val: patient.exang * MODEL_COEFFICIENTS.exang },
    { name: 'ST Depression', val: patient.oldpeak * MODEL_COEFFICIENTS.oldpeak },
    { name: 'Vessels', val: patient.ca * MODEL_COEFFICIENTS.ca },
  ];

  // Sort by absolute impact
  return contributions.sort((a, b) => Math.abs(b.val) - Math.abs(a.val));
};

// 3. Fairness Analysis
const calculateMetrics = (data: PatientData[]): Metrics => {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  
  data.forEach(p => {
    const prob = predictRisk(p);
    const pred = prob > 0.5 ? 1 : 0;
    const actual = p.target!;

    if (pred === 1 && actual === 1) tp++;
    if (pred === 1 && actual === 0) fp++;
    if (pred === 0 && actual === 0) tn++;
    if (pred === 0 && actual === 1) fn++;
  });

  const total = tp + fp + tn + fn;
  if (total === 0) return { accuracy: 0, recall: 0, precision: 0, specificity: 0, count: 0 };

  return {
    accuracy: (tp + tn) / total,
    recall: (tp + fn) > 0 ? tp / (tp + fn) : 0,
    precision: (tp + fp) > 0 ? tp / (tp + fp) : 0,
    specificity: (tn + fp) > 0 ? tn / (tn + fp) : 0,
    count: total
  };
};

export const generateFairnessReport = (dataset: PatientData[]): FairnessReport => {
  const maleData = dataset.filter(p => p.sex === 1);
  const femaleData = dataset.filter(p => p.sex === 0);

  const overall = calculateMetrics(dataset);
  const maleMetrics = calculateMetrics(maleData);
  const femaleMetrics = calculateMetrics(femaleData);

  return {
    overall,
    male: maleMetrics,
    female: femaleMetrics,
    disparity: {
      recallGap: maleMetrics.recall - femaleMetrics.recall,
      accuracyGap: maleMetrics.accuracy - femaleMetrics.accuracy
    }
  };
};
