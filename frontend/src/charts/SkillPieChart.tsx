import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface SkillPieChartProps {
  matched: number;
  missing: number;
}

const COLORS = ['#22c55e', '#ef4444'];
const LABELS = ['Matched Skills', 'Missing Skills'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 border border-white/20 text-sm">
        <p className="font-semibold" style={{ color: payload[0].payload.fill }}>{payload[0].name}</p>
        <p className="text-slate-300">{payload[0].value} skills</p>
      </div>
    );
  }
  return null;
};

const SkillPieChart: React.FC<SkillPieChartProps> = ({ matched, missing }) => {
  const data = [
    { name: LABELS[0], value: matched },
    { name: LABELS[1], value: missing },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} fillOpacity={0.9} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SkillPieChart;
