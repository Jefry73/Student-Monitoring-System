import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, InputGroup, Button } from "react-bootstrap";
import { Search, Download } from "react-bootstrap-icons";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RiskBadge from "../components/RiskBadge";
import { students } from "../data/sampleData";
import { getUserSession } from "../utils/auth";

const DataMahasiswa = () => {
  const navigate = useNavigate();
  const user = getUserSession();
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState("semua");

  useEffect(() => {
    // Proteksi: hanya admin yang bisa akses
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const filtered = students.filter((s) => 
    (risk === "semua" || s.riskLevel === risk) &&
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="app-container">
      <Sidebar collapsed={false} />
      <div className="flex-grow-1">
        <Navbar />
        <Container fluid className="content-wrapper">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">Data Mahasiswa</h3>
            <Button variant="outline-primary">
              <Download className="me-2" />
              Export Excel
            </Button>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-8">
              <InputGroup>
                <InputGroup.Text><Search /></InputGroup.Text>
                <Form.Control 
                  placeholder="Cari nama atau NIM mahasiswa..." 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                />
              </InputGroup>
            </div>
            <div className="col-md-4">
              <Form.Select value={risk} onChange={(e) => setRisk(e.target.value)}>
                <option value="semua">Semua Risiko</option>
                <option value="rendah">Risiko Rendah</option>
                <option value="sedang">Risiko Sedang</option>
                <option value="tinggi">Risiko Tinggi</option>
              </Form.Select>
            </div>
          </div>

          <div className="bg-white rounded-3 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 py-3">Nama</th>
                    <th>NIM</th>
                    <th>Semester</th>
                    <th>IPK</th>
                    <th>SKS</th>
                    <th>Kehadiran</th>
                    <th>Risiko</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student) => (
                    <tr key={student.id}>
                      <td className="px-4">{student.name}</td>
                      <td>{student.nim}</td>
                      <td>{student.semester}</td>
                      <td><strong>{student.ipk}</strong></td>
                      <td>{student.sks}</td>
                      <td>{student.attendance}%</td>
                      <td><RiskBadge level={student.riskLevel} /></td>
                      <td>
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          onClick={() => navigate(`/student/${student.id}`)}
                        >
                          Detail
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filtered.length === 0 && (
              <div className="text-center py-5 text-muted">
                <p>Tidak ada data mahasiswa yang sesuai dengan filter.</p>
              </div>
            )}
          </div>

          <div className="mt-3 text-muted small">
            Menampilkan {filtered.length} dari {students.length} mahasiswa
          </div>
        </Container>
      </div>
    </div>
  );
};

export default DataMahasiswa;