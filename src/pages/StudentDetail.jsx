import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge, Alert } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RiskBadge from "../components/RiskBadge";
import ChartCard from "../components/ChartCard";
import { students, getMahasiswaByDosen } from "../data/sampleData";
import { getUserSession } from "../utils/auth";
import { useEffect, useState } from "react";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUserSession();
  const [student, setStudent] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const studentData = students.find((s) => s.id === parseInt(id));
    
    if (!studentData) {
      navigate(user.role === 'admin' ? '/admin' : '/dosen');
      return;
    }

    // Jika dosen, cek apakah mahasiswa ini adalah bimbingannya
    if (user.role === 'dosen') {
      const mahasiswaBimbingan = getMahasiswaByDosen(user.id);
      const isBimbingan = mahasiswaBimbingan.some(m => m.id === studentData.id);
      
      if (!isBimbingan) {
        setHasAccess(false);
        return;
      }
    }

    setStudent(studentData);
    setHasAccess(true);
  }, [id, user, navigate]);

  if (!hasAccess && user?.role === 'dosen') {
    return (
      <div className="app-container">
        <Sidebar collapsed={false} />
        <div className="flex-grow-1">
          <Navbar />
          <Container fluid className="content-wrapper">
            <Alert variant="danger">
              <Alert.Heading>Akses Ditolak</Alert.Heading>
              <p>Anda tidak memiliki akses untuk melihat detail mahasiswa ini. Anda hanya dapat melihat mahasiswa bimbingan Anda.</p>
              <Button variant="outline-danger" onClick={() => navigate('/dosen')}>
                Kembali ke Dashboard
              </Button>
            </Alert>
          </Container>
        </div>
      </div>
    );
  }

  if (!student) {
    return <div>Loading...</div>;
  }

  const backUrl = user?.role === 'admin' ? '/admin' : '/dosen';

  return (
    <div className="app-container">
      <Sidebar collapsed={false} />
      <div className="flex-grow-1">
        <Navbar />
        <Container fluid className="content-wrapper">
          <Button 
            variant="outline-secondary" 
            size="sm" 
            className="mb-3"
            onClick={() => navigate(backUrl)}
          >
            <ArrowLeft className="me-2" />
            Kembali
          </Button>

          <Row className="g-4">
            <Col lg={4}>
              <Card className="student-card">
                <Card.Body>
                  <div className="text-center mb-3">
                    <div 
                      className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                      style={{ width: 80, height: 80, fontSize: '2rem' }}
                    >
                      {student.name.charAt(0)}
                    </div>
                  </div>
                  
                  <h4 className="text-center mb-1">{student.name}</h4>
                  <p className="text-center text-muted mb-3">{student.nim}</p>
                  
                  <div className="d-flex justify-content-center mb-4">
                    <RiskBadge level={student.riskLevel} />
                  </div>

                  <hr />

                  <div className="mb-3">
                    <small className="text-muted d-block">Semester</small>
                    <strong>Semester {student.semester}</strong>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">IPK</small>
                    <strong className="fs-4">{student.ipk}</strong>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">Total SKS</small>
                    <strong>{student.sks} SKS</strong>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">Kehadiran</small>
                    <div className="d-flex align-items-center">
                      <div className="progress flex-grow-1 me-2" style={{ height: 8 }}>
                        <div 
                          className="progress-bar bg-success" 
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                      <strong>{student.attendance}%</strong>
                    </div>
                  </div>

                  <div>
                    <small className="text-muted d-block">Update Terakhir</small>
                    <strong>{new Date(student.lastUpdate).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}</strong>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={8}>
              <ChartCard title="Riwayat Akademik">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Semester</th>
                        <th>Mata Kuliah</th>
                        <th>SKS</th>
                        <th>Nilai</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>5</td>
                        <td>Pemrograman Web</td>
                        <td>3</td>
                        <td><Badge bg="success">A</Badge></td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td>Basis Data Lanjut</td>
                        <td>3</td>
                        <td><Badge bg="success">A-</Badge></td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>Struktur Data</td>
                        <td>4</td>
                        <td><Badge bg="info">B+</Badge></td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>Algoritma</td>
                        <td>3</td>
                        <td><Badge bg="success">A</Badge></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </ChartCard>

              <ChartCard title="Catatan & Rekomendasi" className="mt-4">
                <div className="mb-3">
                  <h6>Status Akademik</h6>
                  <p className="text-muted">
                    {student.riskLevel === 'rendah' && 'Mahasiswa menunjukkan performa akademik yang baik. Pertahankan konsistensi belajar.'}
                    {student.riskLevel === 'sedang' && 'Mahasiswa perlu perhatian khusus. Disarankan untuk konseling akademik.'}
                    {student.riskLevel === 'tinggi' && 'Mahasiswa berisiko tinggi. Perlu intervensi segera dari dosen wali dan program studi.'}
                  </p>
                </div>

                <div>
                  <h6>Rekomendasi Tindakan</h6>
                  <ul className="text-muted">
                    {student.riskLevel === 'rendah' && (
                      <>
                        <li>Pertahankan kehadiran di atas 90%</li>
                        <li>Ikuti kegiatan pengembangan soft skill</li>
                        <li>Pertimbangkan untuk mengambil mata kuliah pilihan</li>
                      </>
                    )}
                    {student.riskLevel === 'sedang' && (
                      <>
                        <li>Jadwalkan konseling akademik rutin</li>
                        <li>Monitor kehadiran dan partisipasi kelas</li>
                        <li>Berikan bimbingan belajar tambahan</li>
                      </>
                    )}
                    {student.riskLevel === 'tinggi' && (
                      <>
                        <li>Segera lakukan konseling intensif</li>
                        <li>Evaluasi beban SKS semester depan</li>
                        <li>Koordinasi dengan orang tua/wali</li>
                        <li>Pertimbangkan program remedial</li>
                      </>
                    )}
                  </ul>
                </div>
              </ChartCard>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
export default StudentDetail;