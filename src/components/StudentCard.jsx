import { Card, Button } from "react-bootstrap";
import RiskBadge from "./RiskBadge";
const StudentCard = ({ student, onView }) => (
<Card className="student-card">
<Card.Body>
<h5>{student.name}</h5>
<p className="text-muted mb-2">NIM: {student.nim} | Tahun {student.year}</p>
<div className="d-flex justify-content-between align-items-center">
<div>
<div>Sem 1: {(student.curricular1stSemGrade / 5).toFixed(2)}</div>
<div>Sem 2: {(student.curricular2ndSemGrade / 5).toFixed(2)}</div>
</div>
<RiskBadge level={student.riskLevel} />
</div>
<Button size="sm" className="mt-3" onClick={onView}>Lihat Detail</Button>
</Card.Body>
</Card>
);
export default StudentCard;