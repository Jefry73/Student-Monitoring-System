import { Card } from "react-bootstrap";
const StatCard = ({ icon, title, value, trend }) => (
<Card className="stat-card">
<Card.Body>
<div className="d-flex justify-content-between">
<div><small>{title}</small><h4>{value}</h4></div>
<div className="fs-4">{icon}</div>
</div>
<div className={`mt-2 ${trend >= 0 ? "text-success" : "text-danger"}`}>{trend}%</div>
</Card.Body>
</Card>
);
export default StatCard;