import "./css/Badge.css";

interface BadgeProps {
  status: string;
}

export default function Badge({ status }: BadgeProps) {
  return (
    <span className={`badge badge--${status.toLowerCase()}`}>
      {status}
    </span>
  );
}