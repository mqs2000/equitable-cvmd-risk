import React, { useState, useEffect } from 'react';
import { AppTab, PatientData, FairnessReport } from './types';
import { fetchDataset } from './services/dataLoader';
import { generateFairnessReport } from './services/inference';
import { DEFAULT_PATIENT } from './constants';
import PredictionView from './components/PredictionView';
import FairnessView from './components/FairnessView';
import DatasetView from './components/DatasetView';
import { Heart, Activity, Scale, Database, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.ABOUT);
  const [dataset, setDataset] = useState<PatientData[]>([]);
  const [fairnessReport, setFairnessReport] = useState<FairnessReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      const data = await fetchDataset();
      setDataset(data);
      if (data.length > 0) {
        const report = generateFairnessReport(data);
        setFairnessReport(report);
      }
      setLoading(false);
    };
    initData();
  }, []);

  const NavItem = ({ tab, icon: Icon, label }: { tab: AppTab; icon: any; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        activeTab === tab
          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-teal-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-teal-400 to-emerald-600 p-2 rounded-lg shadow-lg shadow-teal-500/20">
              <Heart className="text-white h-6 w-6" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Equitable Heart AI</h1>
              <p className="text-xs text-teal-400 font-mono">EDUCATIONAL DEMO v1.0</p>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-2">
            <NavItem tab={AppTab.ABOUT} icon={Info} label="Overview" />
            <NavItem tab={AppTab.PREDICT} icon={Activity} label="Predict Risk" />
            <NavItem tab={AppTab.FAIRNESS} icon={Scale} label="Fairness Analysis" />
            <NavItem tab={AppTab.DATASET} icon={Database} label="Dataset" />
          </nav>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 flex justify-around z-50">
         <button onClick={() => setActiveTab(AppTab.ABOUT)} className={activeTab === AppTab.ABOUT ? 'text-teal-400' : 'text-slate-500'}><Info /></button>
         <button onClick={() => setActiveTab(AppTab.PREDICT)} className={activeTab === AppTab.PREDICT ? 'text-teal-400' : 'text-slate-500'}><Activity /></button>
         <button onClick={() => setActiveTab(AppTab.FAIRNESS)} className={activeTab === AppTab.FAIRNESS ? 'text-teal-400' : 'text-slate-500'}><Scale /></button>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            <p className="text-slate-400 animate-pulse">Loading UCI Heart Disease Dataset...</p>
          </div>
        ) : (
          <>
            {activeTab === AppTab.ABOUT && (
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
                  <h2 className="text-3xl font-bold text-white mb-6">Cardiometabolic Risk & AI Equity</h2>
                  <p className="text-slate-300 leading-relaxed text-lg mb-6">
                    This project demonstrates an end-to-end Machine Learning pipeline for predicting heart disease risk, 
                    with a specific focus on **Algorithmic Fairness**.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                      <h3 className="text-teal-400 font-semibold mb-2 flex items-center gap-2"><Activity size={18}/> The Goal</h3>
                      <p className="text-sm text-slate-400">Predict the likelihood of heart disease based on clinical features like blood pressure, cholesterol, and age using a Logistic Regression model trained on public data.</p>
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                      <h3 className="text-teal-400 font-semibold mb-2 flex items-center gap-2"><Scale size={18}/> The Challenge</h3>
                      <p className="text-sm text-slate-400">Medical AI often performs differently across demographic groups. We analyze disparities in model performance between Male and Female patients to highlight the need for equity.</p>
                    </div>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                    <p className="text-amber-200 text-sm font-medium text-center">
                      ⚠️ DISCLAIMER: This application is for educational purposes only. 
                      It uses a public dataset from 1988 and is NOT a medical device. 
                      Consult a doctor for real health advice.
                    </p>
                  </div>
                  <div className="mt-8 flex justify-center">
                    <button 
                      onClick={() => setActiveTab(AppTab.PREDICT)}
                      className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg shadow-teal-900/20"
                    >
                      Start Assessment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === AppTab.PREDICT && <PredictionView />}
            
            {activeTab === AppTab.FAIRNESS && fairnessReport && (
              <FairnessView report={fairnessReport} />
            )}

            {activeTab === AppTab.DATASET && <DatasetView data={dataset} />}
          </>
        )}
      </main>
    </div>
  );
}
