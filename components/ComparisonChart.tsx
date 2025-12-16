import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const data = [
  { name: '123456', time: 0.000001, label: 'Instant', type: 'Weak' },
  { name: 'password', time: 0.000001, label: 'Instant', type: 'Weak' },
  { name: 'iloveyou', time: 0.002, label: 'Secs', type: 'Weak' },
  { name: 'Tr0ub4dor&3', time: 31536000, label: 'Years', type: 'Moderate' }, // xkcd reference
  { name: 'correct-horse-battery', time: 3153600000, label: 'Centuries', type: 'Strong' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded shadow-lg">
        <p className="text-white font-bold">{label}</p>
        <p className="text-slate-300 text-sm">Crack Time: <span className="text-emerald-400">{payload[0].payload.label}</span></p>
      </div>
    );
  }
  return null;
};

const ComparisonChart: React.FC = () => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 h-full">
      <h3 className="text-lg font-bold text-white mb-2">Weak vs. Strong: Time to Crack</h3>
      <p className="text-slate-400 text-sm mb-6">Brute force estimation for various password types.</p>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              width={100}
            />
            <Tooltip content={<CustomTooltip />} cursor={{fill: '#334155', opacity: 0.4}} />
            <Bar dataKey="time" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.type === 'Weak' ? '#f43f5e' : entry.type === 'Moderate' ? '#f59e0b' : '#10b981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-4 text-xs">
         <div className="flex items-center gap-1"><div className="w-3 h-3 bg-rose-500 rounded"></div> Weak</div>
         <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded"></div> Moderate</div>
         <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded"></div> Strong</div>
      </div>
    </div>
  );
};

export default ComparisonChart;
