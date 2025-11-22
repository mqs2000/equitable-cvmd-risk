import React from 'react';
import { FairnessReport, Metrics } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function FairnessView({ report }: { report: FairnessReport }) {
  
  const chartData = [
    {
      name: 'Accuracy',
      Overall: (report.overall.accuracy * 100).toFixed(1),
      Male: (report.male.accuracy * 100).toFixed(1),
      Female: (report.female.accuracy * 100).toFixed(1),
    },
    {
      name: 'Recall (Sensitivity)',
      Overall: (report.overall.recall * 100).toFixed(1),
      Male: (report.male.recall * 100).toFixed(1),
      Female: (report.female.recall * 100).toFixed(1),
    },
    {
      name: 'Specificity',
      Overall: (report.overall.specificity * 100).toFixed(1),
      Male: (report.male.specificity * 100).toFixed(1),
      Female: (report.female.specificity * 100).toFixed(1),
    }
  ];

  const MetricCard = ({ title, value, sub, color }: any) => (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
      <h4 className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">{title}</h4>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Group Fairness Audit</h2>
        <p className="text-slate-400 max-w-3xl">
          A key challenge in medical AI is ensuring the model performs equally well for all demographic groups.
          Historical data often contains biases (e.g., fewer women in heart disease studies), which can lead to lower
          recall for female patients.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="Recall Gap (M - F)" 
          value={`${(report.disparity.recallGap * 100).toFixed(1)}%`}
          sub="Positive value means higher recall for Males"
          color={Math.abs(report.disparity.recallGap) > 0.05 ? 'text-amber-400' : 'text-teal-400'}
        />
        <MetricCard 
          title="Male Accuracy" 
          value={`${(report.male.accuracy * 100).toFixed(1)}%`}
          sub={`Sample size: ${report.male.count}`}
          color="text-blue-400"
        />
        <MetricCard 
          title="Female Accuracy" 
          value={`${(report.female.accuracy * 100).toFixed(1)}%`}
          sub={`Sample size: ${report.female.count}`}
          color="text-pink-400"
        />
      </div>

      {/* Charts */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-96">
        <h3 className="text-lg font-semibold text-white mb-6">Performance Comparison by Sex</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend />
            <Bar dataKey="Male" fill="#60a5fa" radius={[0, 4, 4, 0]} />
            <Bar dataKey="Female" fill="#f472b6" radius={[0, 4, 4, 0]} />
            <Bar dataKey="Overall" fill="#94a3b8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-400 shrink-0 mt-1" />
            <div>
              <h4 className="text-amber-200 font-bold mb-2">Disparity Detected</h4>
              <p className="text-sm text-amber-100/80">
                In many heart disease datasets, the Recall (ability to detect positive cases) is significantly higher for men than women.
                This means the model is more likely to "miss" a woman with heart disease (False Negative) than a man.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-teal-500/10 border border-teal-500/20 p-6 rounded-2xl">
           <div className="flex items-start gap-3">
            <CheckCircle2 className="text-teal-400 shrink-0 mt-1" />
            <div>
              <h4 className="text-teal-200 font-bold mb-2">Mitigation Strategies</h4>
              <p className="text-sm text-teal-100/80">
                To fix this, we could:
                1. Collect more representative data for women.
                2. Use "Fairness Constraints" during model training.
                3. Adjust the decision threshold specifically for the female group.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
