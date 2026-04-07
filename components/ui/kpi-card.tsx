export function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
