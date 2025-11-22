import React, { useState } from 'react';
import { PatientData } from '../types';
import { DEFAULT_PATIENT } from '../constants';
import { predictRisk, explainPrediction } from '../services/inference';
import { getAIExplanation } from '../services/geminiService';
import { ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function PredictionView() {
  const [form, setForm] = useState<PatientData>(DEFAULT_PATIENT);
  const [result, setResult] = useState<{ score: number; contributors: any[] } | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleChange = (field: keyof PatientData, value: number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePredict = () => {
    const score = predictRisk(form);
    const contributors = explainPrediction(form);
    setResult({ score, contributors });
    setAiExplanation(''); // Reset previous explanation
  };

  const handleAskAI = async () => {
    if (!result) return;
    setAiLoading(true);
    const explanation = await getAIExplanation(form, result.score);
    setAiExplanation(explanation);
    setAiLoading(false);
  };

  const InputGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Form */}
      <div className="lg:col-span-5 space-y-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg h-fit">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Patient Vitals</h2>
          <button 
            onClick={() => setForm(DEFAULT_PATIENT)}
            className="text-xs text-teal-400 hover:underline"
          >
            Reset Defaults
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <InputGroup label="Age">
            <input 
              type="number" 
              value={form.age} 
              onChange={(e) => handleChange('age', Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:border-teal-500 focus:outline-none transition-colors"
            />
          </InputGroup>

          <InputGroup label="Sex">
            <select 
              value={form.sex} 
              onChange={(e) => handleChange('sex', Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:border-teal-500 focus:outline-none"
            >
              <option value={1}>Male</option>
              <option value={0}>Female</option>
            </select>
          </InputGroup>

          <InputGroup label="Resting BP (mm Hg)">
            <input type="number" value={form.trestbps} onChange={e => handleChange('trestbps', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" />
          </InputGroup>

          <InputGroup label="Cholesterol (mg/dl)">
             <input type="number" value={form.chol} onChange={e => handleChange('chol', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" />
          </InputGroup>

          <InputGroup label="Max Heart Rate">
             <input type="number" value={form.thalach} onChange={e => handleChange('thalach', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" />
          </InputGroup>

          <InputGroup label="Chest Pain Type">
            <select value={form.cp} onChange={e => handleChange('cp', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white">
              <option value={0}>Typical Angina</option>
              <option value={1}>Atypical Angina</option>
              <option value={2}>Non-anginal Pain</option>
              <option value={3}>Asymptomatic</option>
            </select>
          </InputGroup>
        </div>

        <div className="pt-4">
          <button 
            onClick={handlePredict}
            className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-900/20"
          >
            Analyze Risk <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7 space-y-6">
        {!result ? (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-12 text-slate-500">
            <Sparkles size={48} className="mb-4 opacity-20" />
            <p>Enter patient data and click Analyze</p>
          </div>
        ) : (
          <>
            {/* Score Card */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-2 h-full ${result.score > 0.5 ? 'bg-red-500' : 'bg-teal-500'}`}></div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-slate-400 font-medium uppercase tracking-wider mb-1">Estimated Risk Probability</h3>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${result.score > 0.5 ? 'text-red-400' : 'text-teal-400'}`}>
                      {(result.score * 100).toFixed(1)}%
                    </span>
                    <span className="text-xl text-slate-500 font-medium">
                      {result.score > 0.5 ? 'High Risk' : 'Low Risk'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-slate-800 rounded-lg px-3 py-1 text-xs text-slate-400 inline-block">
                    Threshold: 50%
                  </div>
                </div>
              </div>
            </div>

            {/* Contributors */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-lg font-semibold text-white mb-4">Primary Risk Drivers (Local Explainability)</h4>
              <div className="space-y-3">
                {result.contributors.slice(0, 5).map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{c.name}</span>
                    <div className="flex items-center gap-3 flex-1 max-w-xs ml-4">
                      <div className="h-2 bg-slate-800 rounded-full flex-1 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${c.val > 0 ? 'bg-red-500/70' : 'bg-teal-500/70'}`}
                          style={{ width: `${Math.min(Math.abs(c.val) * 20, 100)}%` }} 
                        />
                      </div>
                      <span className="text-slate-500 w-12 text-right font-mono text-xs">
                        {c.val > 0 ? '+' : ''}{c.val.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gemini AI */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-teal-200 flex items-center gap-2">
                  <Sparkles size={18} /> AI Interpretability
                </h4>
                {!aiExplanation && !aiLoading && (
                  <button 
                    onClick={handleAskAI}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white transition-colors"
                  >
                    Explain with Gemini
                  </button>
                )}
              </div>

              {aiLoading && (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                </div>
              )}

              {aiExplanation && (
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="whitespace-pre-line text-slate-300">{aiExplanation}</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
