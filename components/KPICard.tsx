interface KPICardProps {
  label: string;
  value: number | null;
  format?: (value: number) => string;
}

export default function KPICard({ label, value, format }: KPICardProps) {
  const displayValue = value === null ? '—' : format ? format(value) : value.toString();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <div className="text-slate-400 text-sm mb-2">{label}</div>
      <div className="text-slate-50 text-3xl font-bold">{displayValue}</div>
    </div>
  );
}
