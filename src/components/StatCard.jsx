import { Card } from "react-bootstrap";
const StatCard = ({ icon, title, value, trend, subtitle }) => (
<Card className="stat-card">
<Card.Body>
<div className="d-flex justify-content-between">
<div><small>{title}</small><h4>{value}</h4></div>
{icon && <div className="fs-4">{icon}</div>}
</div>
{trend !== undefined && trend !== null && (
  <div className={`mt-2 ${trend >= 0 ? "text-success" : "text-danger"}`}>
    {trend > 0 ? '+' : ''}{trend}%
  </div>
)}
{subtitle && <div className="mt-2 text-muted" style={{ fontSize: '0.85rem' }}>{subtitle}</div>}
</Card.Body>
</Card>
);
export default StatCard;