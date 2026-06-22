import { Container, Row, Col, Form, InputGroup, Alert } from "react-bootstrap";
import { Search, PersonCircle } from "react-bootstrap-icons";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import StudentCard from "../components/StudentCard";
import { getMahasiswaByDosen } from "../data/sampleData";
import { getUserSession } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const DosenDashboard = () => {
  const navigate = useNavigate();
  const user = getUserSession();
  const [mahasiswaBimbingan, setMahasiswaBimbingan] = useState([]);

  useEffect(() => {
    // Proteksi: hanya dosen yang bisa akses
    if (!user || user.role !== 'dosen') {
      navigate('/');
      return;
    }

    const mahasiswa = getMahasiswaByDosen(user.id);
    setMahasiswaBimbingan(mahasiswa);
  }, [user?.id, user?.role, navigate]);

  const total = mahasiswaBimbingan.length;
  const atRisk = mahasiswaBimbingan.filter(s => s.riskLevel === 'tinggi').length;
  const needAttention = mahasiswaBimbingan.filter(s => s.riskLevel === 'sedang').length;

  return (
    <div className="app-container">
      <Sidebar collapsed={false} />
      <div className="flex-grow-1">
        <Navbar />
        <Container fluid className="content-wrapper">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <div>
              <h3 className="mb-1">Dashboard Dosen Wali</h3>
              <p className="text-muted mb-0">
                Selamat datang, <strong>{user?.name}</strong>. Anda membimbing {total} mahasiswa.
              </p>
            </div>
            <div style={{ minWidth: 280 }}>
              <InputGroup>
                <InputGroup.Text><Search /></InputGroup.Text>
                <Form.Control placeholder="Cari mahasiswa bimbingan..." />
              </InputGroup>
            </div>
          </div>

          {mahasiswaBimbingan.length === 0 && (
            <Alert variant="info">
              <PersonCircle className="me-2" />
              Anda belum memiliki mahasiswa bimbingan yang terdaftar.
            </Alert>
          )}

          <Row className="g-3 mb-4">
            <Col md={4}>
              <StatCard 
                title="Total Mahasiswa Bimbingan" 
                value={total} 
                subtitle="Mahasiswa aktif"
              />
            </Col>
            <Col md={4}>
              <StatCard 
                title="Perlu Perhatian (Sedang)" 
                value={needAttention} 
                subtitle={`${total > 0 ? Math.round((needAttention/total)*100) : 0}% dari total bimbingan`}
              />
            </Col>
            <Col md={4}>
              <StatCard 
                title="Berisiko Tinggi" 
                value={atRisk} 
                subtitle={`${total > 0 ? Math.round((atRisk/total)*100) : 0}% dari total bimbingan`}
              />
            </Col>
          </Row>

          <h5 className="mb-3">Mahasiswa Bimbingan Saya</h5>
          <Row className="g-4">
            {mahasiswaBimbingan.map((student) => (
              <Col md={6} lg={4} key={student.id}>
                <StudentCard 
                  student={student} 
                  onView={() => navigate(`/student/${student.id}`)} 
                />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
};
export default DosenDashboard;