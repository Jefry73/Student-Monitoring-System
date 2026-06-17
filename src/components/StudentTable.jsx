import { Table } from "react-bootstrap";
import RiskBadge from "./RiskBadge";
const StudentTable = ({ students, onSort }) => (
<Table responsive hover>
<thead><tr>
<th onClick={() => onSort("name")}>Nama</th>
<th>NIM</th><th>IPK</th><th>Semester</th><th>Risiko</th>
</tr></thead>
<tbody>
{students.map((s) => (<tr key={s.id}><td>{s.name}</td><td>{s.nim}</td><td>{s.ipk}</td><td>{s.semester}</td><td><RiskBadge level={s.riskLevel} /></td></tr>))}
</tbody>
</Table>
);
export default StudentTable;