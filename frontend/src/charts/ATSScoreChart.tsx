import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

interface ATSScoreChartProps {
  data: { name: string; score: number }[];
}

const getColor = (v: number) => {
  if (v >= 80) return '#22c55e';
  if (v >= 60) return '#eab308';
  return '#ef4444';
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 border border-white/20 text-sm">
        <p className="font-semibold text-slate-200">{label}</p>
        <p style={{ color: getColor(payload[0].value) }} className="font-bold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const ATSScoreChart: React.FC<ATSScoreChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
      <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
      <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={48}>
        {data.map((entry, index) => (
          <Cell key={index} fill={getColor(entry.score)} fillOpacity={0.9} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export default ATSScoreChart;
