import { Badge } from "react-bootstrap";
import { getRiskBadgeVariant } from "../utils/helpers";
const RiskBadge = ({ level }) => (
<Badge bg={getRiskBadgeVariant(level)} className="summary-chip">{level}</Badge>
);
export default RiskBadge;