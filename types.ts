export interface PatientData {
  age: number;
  sex: number; // 1 = male, 0 = female
  cp: number; // chest pain type (0-3)
  trestbps: number; // resting blood pressure
  chol: number; // serum cholestoral
  fbs: number; // fasting blood sugar > 120 mg/dl (1 = true; 0 = false)
  restecg: number; // resting electrocardiographic results (0-2)
  thalach: number; // maximum heart rate achieved
  exang: number; // exercise induced angina (1 = yes; 0 = no)
  oldpeak: number; // ST depression induced by exercise relative to rest
  slope: number; // the slope of the peak exercise ST segment
  ca: number; // number of major vessels (0-3) colored by flourosopy
  thal: number; // 1 = normal; 2 = fixed defect; 3 = reversable defect
  target?: number; // 1 = disease, 0 = no disease
}

export interface Metrics {
  accuracy: number;
  recall: number;
  precision: number;
  specificity: number;
  count: number;
}

export interface FairnessReport {
  overall: Metrics;
  male: Metrics;
  female: Metrics;
  disparity: {
    recallGap: number;
    accuracyGap: number;
  };
}

export enum AppTab {
  PREDICT = 'PREDICT',
  FAIRNESS = 'FAIRNESS',
  DATASET = 'DATASET',
  ABOUT = 'ABOUT'
}
