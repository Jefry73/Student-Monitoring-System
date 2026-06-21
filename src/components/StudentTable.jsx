import { Table, Button } from "react-bootstrap";
import RiskBadge from "./RiskBadge";
const StudentTable = ({ students, onSort = () => {}, sortConfig, onDetail = () => {} }) => {
  const getSortIcon = (column) => {
    if (!sortConfig || sortConfig.key !== column) return "";
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th style={{ cursor: "pointer" }} onClick={() => onSort("name")}>Nama{getSortIcon("name")}</th>
          <th style={{ cursor: "pointer" }} onClick={() => onSort("nim")}>NIM{getSortIcon("nim")}</th>
          <th style={{ cursor: "pointer" }} onClick={() => onSort("year")}>Tahun{getSortIcon("year")}</th>
          <th style={{ cursor: "pointer" }} onClick={() => onSort("curricular1stSemGrade")}>Grade Sem 1{getSortIcon("curricular1stSemGrade")}</th>
          <th style={{ cursor: "pointer" }} onClick={() => onSort("curricular2ndSemGrade")}>Grade Sem 2{getSortIcon("curricular2ndSemGrade")}</th>
          <th style={{ cursor: "pointer" }} onClick={() => onSort("riskLevel")}>Risiko{getSortIcon("riskLevel")}</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr key={s.id}>
            <td>{s.name}</td>
            <td>{s.nim}</td>
            <td>{s.year}</td>
            <td>{(s.curricular1stSemGrade / 5).toFixed(2)}</td>
            <td>{(s.curricular2ndSemGrade / 5).toFixed(2)}</td>
            <td><RiskBadge level={s.riskLevel} /></td>
            <td>
              <Button 
                size="sm" 
                variant="outline-primary"
                onClick={() => onDetail(s.id)}
              >
                Detail
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export default StudentTable;