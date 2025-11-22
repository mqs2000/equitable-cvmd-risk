import React from 'react';
import { PatientData } from '../types';

export default function DatasetView({ data }: { data: PatientData[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Dataset Explorer</h2>
          <span className="text-sm text-slate-500 font-mono bg-slate-800 px-3 py-1 rounded">
            {data.length} Records Loaded
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs text-slate-200 uppercase bg-slate-800">
              <tr>
                <th className="px-6 py-3">Age</th>
                <th className="px-6 py-3">Sex</th>
                <th className="px-6 py-3">BP</th>
                <th className="px-6 py-3">Chol</th>
                <th className="px-6 py-3">F.Sugar</th>
                <th className="px-6 py-3">Max HR</th>
                <th className="px-6 py-3">Angina</th>
                <th className="px-6 py-3 text-right">Target</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 20).map((row, index) => (
                <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-white">{row.age}</td>
                  <td className="px-6 py-4">{row.sex === 1 ? 'M' : 'F'}</td>
                  <td className="px-6 py-4">{row.trestbps}</td>
                  <td className="px-6 py-4">{row.chol}</td>
                  <td className="px-6 py-4">{row.fbs === 1 ? '>120' : '<120'}</td>
                  <td className="px-6 py-4">{row.thalach}</td>
                  <td className="px-6 py-4">{row.exang === 1 ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 rounded text-xs ${row.target === 1 ? 'bg-red-500/20 text-red-400' : 'bg-teal-500/20 text-teal-400'}`}>
                      {row.target === 1 ? 'Disease' : 'No Disease'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-slate-500 text-xs mt-4 italic">Showing first 20 rows of the loaded dataset</p>
      </div>
    </div>
  );
}
