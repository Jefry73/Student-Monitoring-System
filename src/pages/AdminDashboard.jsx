import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import StudentTable from "../components/StudentTable";
import RiskDistributionChart from "../components/RiskDistributionChart";
import IPKTrendChart from "../components/IPKTrendChart";
import { students as initialStudents, ipkTrends, calculateRiskLevel } from "../data/sampleData";
import { People, ExclamationTriangle, GraphUp, Check2Circle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { getUserSession } from "../utils/auth";
import { useEffect, useMemo, useState } from "react";
const AdminDashboard = () => {
const navigate = useNavigate();
const user = getUserSession();
const [students, setStudents] = useState(initialStudents);
const [showModal, setShowModal] = useState(false);
const [formData, setFormData] = useState({
  name: "",
  nim: "",
  year: 1,
  curricular1stSemGrade: "",
  curricular2ndSemGrade: "",
  sks: "",
  attendance: "",
});
useEffect(() => {
    // Proteksi: hanya admin yang bisa akses
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
}, [user?.id, user?.role, navigate]);
const avgIPK = (
students.reduce(
  (sum, s) => sum + (s.curricular1stSemGrade + s.curricular2ndSemGrade) / 2 / 5,
  0
) / students.length
).toFixed(2);
const risky = students.filter((s) => s.riskLevel !== "rendah").length;
const attendance = (students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(0);
const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
const sortedStudents = useMemo(() => {
  const sorted = [...students];
  if (!sortConfig?.key) return sorted;
  sorted.sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue === bValue) return 0;
    const order = sortConfig.direction === "asc" ? 1 : -1;
    if (typeof aValue === "string") return aValue.localeCompare(bValue) * order;
    return (aValue > bValue ? 1 : -1) * order;
  });
  return sorted;
}, [students, sortConfig]);
const handleSort = (key) => {
  setSortConfig((current) => {
    if (current.key === key) {
      return { key, direction: current.direction === "asc" ? "desc" : "asc" };
    }
    return { key, direction: "asc" };
  });
};

const handleFormChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: name === "year" ? parseInt(value) : value
  }));
};

const handleAddStudent = () => {
  setShowModal(true);
};

const handleSubmitStudent = () => {
  if (!formData.name || !formData.nim) {
    alert("Nama dan NIM harus diisi");
    return;
  }
  const newId = Math.max(...students.map(s => s.id), 0) + 1;
  // Convert 0-4 scale to internal 0-20 scale
  const grade1 = (parseFloat(formData.curricular1stSemGrade) || 0) * 5;
  const grade2 = (parseFloat(formData.curricular2ndSemGrade) || 0) * 5;
  
  const newStudent = {
    id: newId,
    nim: formData.nim,
    name: formData.name,
    year: formData.year,
    curricular1stSemGrade: grade1,
    curricular2ndSemGrade: grade2,
    sks: parseInt(formData.sks) || 0,
    attendance: parseInt(formData.attendance) || 0,
    riskLevel: calculateRiskLevel(parseFloat(formData.curricular1stSemGrade) || 0, parseFloat(formData.curricular2ndSemGrade) || 0),
    displaced: 0,
    tuitionFeesUpToDate: 1,
    gender: 1,
    scholarshipHolder: 0,
    ageAtEnrollment: 18,
    lastUpdate: new Date().toISOString().split("T")[0],
  };
  
  setStudents([...students, newStudent]);
  setShowModal(false);
  setFormData({
    name: "",
    nim: "",
    year: 1,
    curricular1stSemGrade: "",
    curricular2ndSemGrade: "",
    sks: "",
    attendance: "",
  });
};
return (
<div className="app-container">
<Sidebar collapsed={false} />
<div className="flex-grow-1">
<Navbar />
<Container fluid className="content-wrapper">
<Row className="g-4 mb-4 align-items-stretch">
<Col lg={4} className="h-100">
<div className="d-grid gap-3 h-100">
<StatCard icon={<People />} title="Total Mahasiswa" value={students.length} trend={8.2} />
<StatCard icon={<ExclamationTriangle />} title="At Risk" value={risky} trend={-2.1} />
<StatCard icon={<GraphUp />} title="Rata-rata IPK" value={avgIPK} trend={4.5} />
<StatCard icon={<Check2Circle />} title="Attendance" value={`${attendance}%`} trend={1.8} />
</div>
</Col>
<Col lg={3} className="h-100"><RiskDistributionChart students={students} /></Col>
<Col lg={5} className="h-100"><IPKTrendChart ipkTrends={ipkTrends} /></Col>
</Row>
<Row>
<Col>
<div className="d-flex justify-content-between align-items-center mb-3">
<h5 className="mb-0">Data Mahasiswa</h5>
<Button size="sm" variant="primary" onClick={handleAddStudent}>
+ Tambah Mahasiswa
</Button>
</div>
<ChartCard title="Data Mahasiswa">
<StudentTable 
  students={sortedStudents} 
  onSort={handleSort} 
  sortConfig={sortConfig}
  onDetail={(id) => navigate(`/student/${id}`)}
/>
</ChartCard>
</Col>
</Row>

<Modal show={showModal} onHide={() => setShowModal(false)}>
<Modal.Header closeButton>
<Modal.Title>Tambah Mahasiswa Baru</Modal.Title>
</Modal.Header>
<Modal.Body>
<Form>
<Form.Group className="mb-3">
<Form.Label>Nama</Form.Label>
<Form.Control 
  type="text" 
  name="name" 
  value={formData.name}
  onChange={handleFormChange}
  placeholder="Masukkan nama mahasiswa"
/>
</Form.Group>
<Form.Group className="mb-3">
<Form.Label>NIM</Form.Label>
<Form.Control 
  type="text" 
  name="nim" 
  value={formData.nim}
  onChange={handleFormChange}
  placeholder="Masukkan NIM"
/>
</Form.Group>
<Form.Group className="mb-3">
<Form.Label>Tahun</Form.Label>
<Form.Select name="year" value={formData.year} onChange={handleFormChange}>
<option value={1}>Tahun 1</option>
<option value={2}>Tahun 2</option>
<option value={3}>Tahun 3</option>
<option value={4}>Tahun 4</option>
</Form.Select>
</Form.Group>
<Form.Group className="mb-3">
<Form.Label>Grade Semester 1 (0-4)</Form.Label>
<Form.Control 
  type="number" 
  name="curricular1stSemGrade" 
  value={formData.curricular1stSemGrade}
  onChange={handleFormChange}
  placeholder="0.00"
  step="0.01"
  min="0"
  max="4"
/>
</Form.Group>
<Form.Group className="mb-3">
<Form.Label>Grade Semester 2 (0-4)</Form.Label>
<Form.Control 
  type="number" 
  name="curricular2ndSemGrade" 
  value={formData.curricular2ndSemGrade}
  onChange={handleFormChange}
  placeholder="0.00"
  step="0.01"
  min="0"
  max="4"
/>
</Form.Group>
<Form.Group className="mb-3">
<Form.Label>SKS</Form.Label>
<Form.Control 
  type="number" 
  name="sks" 
  value={formData.sks}
  onChange={handleFormChange}
  placeholder="0"
/>
</Form.Group>
<Form.Group className="mb-3">
<Form.Label>Kehadiran (%)</Form.Label>
<Form.Control 
  type="number" 
  name="attendance" 
  value={formData.attendance}
  onChange={handleFormChange}
  placeholder="0"
  min="0"
  max="100"
/>
</Form.Group>
</Form>
</Modal.Body>
<Modal.Footer>
<Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
<Button variant="primary" onClick={handleSubmitStudent}>Tambah</Button>
</Modal.Footer>
</Modal>
</Container>
</div>
</div>
);
};
export default AdminDashboard;