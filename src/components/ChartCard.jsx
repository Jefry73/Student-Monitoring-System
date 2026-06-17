import { Card } from "react-bootstrap";
const ChartCard = ({ title, children }) => (
<Card className="chart-card h-100">
<Card.Header className="bg-white border-0 pb-0">
<h5 className="mb-0">{title}</h5>
</Card.Header>
<Card.Body>{children}</Card.Body>
</Card>
);
export default ChartCard;