import { PatientData } from '../types';
import { DATASET_URL } from '../constants';

export const fetchDataset = async (): Promise<PatientData[]> => {
  try {
    const response = await fetch(DATASET_URL);
    const text = await response.text();
    const rows = text.split('\n').map(row => row.trim()).filter(row => row.length > 0);
    
    // Headers: age,sex,cp,trestbps,chol,fbs,restecg,thalach,exang,oldpeak,slope,ca,thal,target
    const headers = rows[0].split(',');
    
    const data: PatientData[] = rows.slice(1).map((row): PatientData | null => {
      const values = row.split(',').map(Number);
      // Handle potential parsing errors or empty lines
      if (values.length !== headers.length) return null;

      return {
        age: values[0],
        sex: values[1],
        cp: values[2],
        trestbps: values[3],
        chol: values[4],
        fbs: values[5],
        restecg: values[6],
        thalach: values[7],
        exang: values[8],
        oldpeak: values[9],
        slope: values[10],
        ca: values[11],
        thal: values[12],
        target: values[13]
      };
    }).filter((item): item is PatientData => item !== null);

    return data;
  } catch (error) {
    console.error("Failed to load dataset:", error);
    return [];
  }
};