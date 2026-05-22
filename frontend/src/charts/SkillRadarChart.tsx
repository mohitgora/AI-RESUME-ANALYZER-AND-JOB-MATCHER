import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from 'recharts';

interface SkillRadarChartProps {
  data: { subject: string; score: number; fullMark: number }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 border border-white/20 text-sm">
        <p className="font-semibold text-slate-200">{payload[0].payload.subject}</p>
        <p className="text-brand-400 font-bold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={240}>
    <RadarChart cx="50%" cy="50%" outerRadius={80} data={data}>
      <PolarGrid stroke="rgba(255,255,255,0.08)" />
      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
      <Radar
        name="Score"
        dataKey="score"
        stroke="#3b82f6"
        fill="#3b82f6"
        fillOpacity={0.2}
        strokeWidth={2}
      />
      <Tooltip content={<CustomTooltip />} />
    </RadarChart>
  </ResponsiveContainer>
);

export default SkillRadarChart;
