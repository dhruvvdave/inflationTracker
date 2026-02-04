'use client';

import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface LineChartProps {
  data: { date: string; personal: number; national: number }[];
}

export default function LineChart({ data }: LineChartProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <ResponsiveContainer width="100%" height={320}>
        <RechartsLineChart data={data}>
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8' }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getFullYear()}`;
            }}
          />
          <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '0.5rem',
              color: '#f1f5f9',
            }}
          />
          <Legend wrapperStyle={{ color: '#f1f5f9' }} />
          <Line
            type="monotone"
            dataKey="personal"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="national"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
