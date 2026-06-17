import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import StudentTable from "../components/StudentTable";
import RiskDistributionChart from "../components/RiskDistributionChart";
import IPKTrendChart from "../components/IPKTrendChart";
import { students, ipkTrends } from "../data/sampleData";
import { People, ExclamationTriangle, GraphUp, Check2Circle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { getUserSession } from "../utils/auth";
import { useEffect } from "react";
const AdminDashboard = () => {
const navigate = useNavigate();
const user = getUserSession();
useEffect(() => {
    // Proteksi: hanya admin yang bisa akses
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
}, [user, navigate]);
const avgIPK = (students.reduce((sum, s) => sum + s.ipk, 0) / students.length).toFixed(2);
const risky = students.filter((s) => s.riskLevel !== "rendah").length;
const attendance = (students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(0);
return (
<div className="app-container">
<Sidebar collapsed={false} />
<div className="flex-grow-1">
<Navbar />
<Container fluid className="content-wrapper">
<Row className="g-3 mb-4">
<Col md={6} lg={3}><StatCard icon={<People />} title="Total Mahasiswa" value={students.length} trend={8.2} /></Col>
<Col md={6} lg={3}><StatCard icon={<ExclamationTriangle />} title="At Risk" value={risky} trend={-2.1} /></Col>
<Col md={6} lg={3}><StatCard icon={<GraphUp />} title="Rata-rata IPK" value={avgIPK} trend={4.5} /></Col>
<Col md={6} lg={3}><StatCard icon={<Check2Circle />} title="Attendance" value={`${attendance}%`} trend={1.8} /></Col>
</Row>
<Row className="g-4 mb-4">
<Col lg={6}><RiskDistributionChart students={students} /></Col>
<Col lg={6}><IPKTrendChart ipkTrends={ipkTrends} /></Col>
</Row>
<Row>
<Col>
<ChartCard title="Data Mahasiswa">
<StudentTable students={students} onSort={() => {}} />
</ChartCard>
</Col>
</Row>
</Container>
</div>
</div>
);
};
export default AdminDashboard;