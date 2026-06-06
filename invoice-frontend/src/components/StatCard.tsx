import './css/StatCard.css';

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="stat-card">
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value">{value}</span>
    </div>
  );
}


interface StatCardProps {
  label: string;
  value: string | number;
}
