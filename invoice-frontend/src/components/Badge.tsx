import "./css/Badge.css";

export default function Badge({ status }: BadgeProps) {
  return (
    <span className={`badge badge--${status.toLowerCase()}`}>
      {status}
    </span>
  );
}

interface BadgeProps {
  status: string;
}