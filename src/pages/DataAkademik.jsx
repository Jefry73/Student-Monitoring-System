import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Row, Col } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChartCard from "../components/ChartCard";
import IPKTrendChart from "../components/IPKTrendChart";
import { ipkTrends } from "../data/sampleData";
import { getUserSession } from "../utils/auth";

const DataAkademik = () => {
  const navigate = useNavigate();
  const user = getUserSession();
  const [semester, setSemester] = useState("all");

  useEffect(() => {
    // Proteksi: hanya admin yang bisa akses
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const records = [
    { nim: "2021001", semester: 5, matkul: "Pemrograman Web", nilai: "A", sks: 3 },
    { nim: "2021002", semester: 5, matkul: "Basis Data", nilai: "A-", sks: 3 },
    { nim: "2021003", semester: 4, matkul: "Struktur Data", nilai: "B+", sks: 4 },
    { nim: "2021004", semester: 6, matkul: "Artificial Intelligence", nilai: "A", sks: 3 },
    { nim: "2021005", semester: 3, matkul: "Algoritma", nilai: "C+", sks: 4 },
    { nim: "2021006", semester: 5, matkul: "Jaringan Komputer", nilai: "B", sks: 3 },
  ].filter((item) => semester === "all" || String(item.semester) === semester);

  return (
    <div className="app-container">
      <Sidebar collapsed={false} />
      <div className="flex-grow-1">
        <Navbar />
        <Container fluid className="content-wrapper">
          <h3 className="mb-4">Data Akademik</h3>

          <Row className="g-4 mb-4">
            <Col lg={8}>
              <IPKTrendChart ipkTrends={ipkTrends} />
            </Col>
            <Col lg={4}>
              <ChartCard title="Filter Data">
                <Form.Group className="mb-3">
                  <Form.Label>Semester</Form.Label>
                  <Form.Select value={semester} onChange={(e) => setSemester(e.target.value)}>
                    <option value="all">Semua Semester</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                  </Form.Select>
                </Form.Group>
                
                <div className="mt-4">
                  <h6>Statistik</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Total Record:</span>
                    <strong>{records.length}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Rata-rata IPK:</span>
                    <strong>3.18</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Total SKS:</span>
                    <strong>{records.reduce((sum, r) => sum + r.sks, 0)}</strong>
                  </div>
                </div>
              </ChartCard>
            </Col>
          </Row>

          <ChartCard title="Riwayat Nilai Akademik">
            <div className="small text-muted mb-3">
              Ringkasan performa akademik mahasiswa berdasarkan semester dan mata kuliah.
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>NIM</th>
                    <th>Semester</th>
                    <th>Mata Kuliah</th>
                    <th>SKS</th>
                    <th>Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={index}>
                      <td>{record.nim}</td>
                      <td>Semester {record.semester}</td>
                      <td>{record.matkul}</td>
                      <td>{record.sks}</td>
                      <td><strong>{record.nilai}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {records.length === 0 && (
              <div className="text-center py-4 text-muted">
                Tidak ada data untuk semester yang dipilih.
              </div>
            )}
          </ChartCard>
        </Container>
      </div>
    </div>
  );
};
export default DataAkademik;