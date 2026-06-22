import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RiskBadge from "../components/RiskBadge";
import ChartCard from "../components/ChartCard";
import { students, getMahasiswaByDosen } from "../data/sampleData";
import { getUserSession } from "../utils/auth";
import { predictStudent } from "../utils/onnxPredictor";
import { useEffect, useState } from "react";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUserSession();
  const [student, setStudent] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [predictionError, setPredictionError] = useState(null);

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

    // Load predictions
    loadPredictions(studentData);
  }, [id, user?.id, user?.role, navigate]);

  const loadPredictions = async (studentData) => {
    setLoadingPredictions(true);
    setPredictionError(null);
    try {
      const result = await predictStudent(studentData);
      setPredictions(result);
    } catch (error) {
      console.error('Failed to load predictions:', error);
      setPredictionError('Gagal memuat prediksi model. Pastikan file ONNX tersedia.');
    } finally {
      setLoadingPredictions(false);
    }
  };

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
                  
                  <p className="text-center mb-3">Status Risiko Akademik</p>
                  <div className="d-flex justify-content-center mb-2">
                    <RiskBadge level={student.riskLevel} />
                  </div>
                  <br></br>

                  <hr />

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <small className="text-muted d-block">Tahun</small>
                      <strong>{student.year}</strong>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Jenis Kelamin</small>
                      <strong>{student.gender === 1 ? 'Laki-laki' : 'Perempuan'}</strong>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Status Pengungsi</small>
                      <strong>{student.displaced ? 'Ya' : 'Tidak'}</strong>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Biaya Kuliah</small>
                      <strong>{student.tuitionFeesUpToDate ? 'Lunas' : 'Belum Lunas'}</strong>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Beasiswa</small>
                      <strong>{student.scholarshipHolder ? 'Ya' : 'Tidak'}</strong>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Usia Masuk</small>
                      <strong>{student.ageAtEnrollment} tahun</strong>
                    </div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">Grade Semester 1</small>
                    <strong className="fs-5">{(student.curricular1stSemGrade / 5).toFixed(2)}</strong>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block">Grade Semester 2</small>
                    <strong className="fs-5">{(student.curricular2ndSemGrade / 5).toFixed(2)}</strong>
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
              {predictionError && (
                <Alert variant="danger" className="mb-4">
                  <Alert.Heading>⚠️ Gagal Memuat Prediksi Model</Alert.Heading>
                  <p className="mb-2">{predictionError}</p>
                  <small className="text-muted">
                    <p className="mb-1">Kemungkinan penyebab:</p>
                    <ul className="ps-3 mb-0">
                      <li>File model ONNX tidak ditemukan di folder public/models</li>
                      <li>Browser belum support WebAssembly</li>
                      <li>ONNX Runtime library belum diload dengan benar</li>
                    </ul>
                  </small>
                  <Button 
                    size="sm" 
                    variant="outline-danger" 
                    className="mt-2"
                    onClick={() => window.location.reload()}
                  >
                    Muat Ulang Halaman
                  </Button>
                </Alert>
              )}

              {loadingPredictions && (
                <Card className="mb-4">
                  <Card.Body className="text-center py-5">
                    <Spinner animation="border" variant="primary" className="me-2" />
                    <p className="text-muted">Memuat prediksi model...</p>
                  </Card.Body>
                </Card>
              )}

              {predictions && !loadingPredictions && (
                <>
                  {predictions.usedMockModels && (
                    <Alert variant="info" className="mb-3">
                      <Alert.Heading>ℹ️ Menggunakan Prediksi Mock</Alert.Heading>
                      <small>Model ONNX tidak tersedia. Menampilkan prediksi berdasarkan heuristic sederhana.</small>
                    </Alert>
                  )}

                  <Row className="g-4">
                    <Col xs={12}>
                      <ChartCard title="Prediksi Model Machine Learning" className="h-100">
                        <div className="row g-3">
                          {/* MLP Model */}
                          <div className="col-md-6">
                            <div className="card border-0 bg-light">
                              <div className="card-body">
                                <h6 className="card-title mb-3">
                                  🧠 Neural Network (MLP)
                                </h6>
                                <div className="mb-2">
                                  <small className="text-muted">Prediksi:</small>
                                  <div>
                                    <Badge 
                                      bg={predictions.mlp.prediction === 'Dropout' ? 'danger' : 'success'}
                                    >
                                      {predictions.mlp.prediction}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="mb-2">
                                  <small className="text-muted">Probabilitas Dropout:</small>
                                  <strong className="d-block">
                                    {(predictions.mlp.probability * 100).toFixed(1)}%
                                  </strong>
                                </div>
                                <div className="progress" style={{ height: 6 }}>
                                  <div 
                                    className="progress-bar bg-danger" 
                                    style={{ width: `${predictions.mlp.probability * 100}%` }}
                                  />
                                </div>
                                <small className="text-muted d-block mt-2">
                                  Risk: <RiskBadge level={predictions.mlp.riskLevel} />
                                </small>
                              </div>
                            </div>
                          </div>

                          {/* Random Forest Model */}
                          <div className="col-md-6">
                            <div className="card border-0 bg-light">
                              <div className="card-body">
                                <h6 className="card-title mb-3">
                                  🌲 Random Forest
                                </h6>
                                <div className="mb-2">
                                  <small className="text-muted">Prediksi:</small>
                                  <div>
                                    <Badge 
                                      bg={predictions.randomForest.prediction === 'Dropout' ? 'danger' : 'success'}
                                    >
                                      {predictions.randomForest.prediction}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="mb-2">
                                  <small className="text-muted">Probabilitas Dropout:</small>
                                  <strong className="d-block">
                                    {(predictions.randomForest.probability * 100).toFixed(1)}%
                                  </strong>
                                </div>
                                <div className="progress" style={{ height: 6 }}>
                                  <div 
                                    className="progress-bar bg-danger" 
                                    style={{ width: `${predictions.randomForest.probability * 100}%` }}
                                  />
                                </div>
                                <small className="text-muted d-block mt-2">
                                  Risk: <RiskBadge level={predictions.randomForest.riskLevel} />
                                </small>
                              </div>
                            </div>
                          </div>

                          {/* SVM Model */}
                          <div className="col-md-6">
                            <div className="card border-0 bg-light">
                              <div className="card-body">
                                <h6 className="card-title mb-3">
                                  🎯 Support Vector Machine
                                </h6>
                                <div className="mb-2">
                                  <small className="text-muted">Prediksi:</small>
                                  <div>
                                    <Badge 
                                      bg={predictions.svm.prediction === 'Dropout' ? 'danger' : 'success'}
                                    >
                                      {predictions.svm.prediction}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="mb-2">
                                  <small className="text-muted">Probabilitas Dropout:</small>
                                  <strong className="d-block">
                                    {(predictions.svm.probability * 100).toFixed(1)}%
                                  </strong>
                                </div>
                                <div className="progress" style={{ height: 6 }}>
                                  <div 
                                    className="progress-bar bg-danger" 
                                    style={{ width: `${predictions.svm.probability * 100}%` }}
                                  />
                                </div>
                                <small className="text-muted d-block mt-2">
                                  Risk: <RiskBadge level={predictions.svm.riskLevel} />
                                </small>
                              </div>
                            </div>
                          </div>

                          {/* Ensemble Prediction */}
                          <div className="col-md-6">
                            <div className="card border-0 bg-primary bg-opacity-10">
                              <div className="card-body">
                                <h6 className="card-title mb-3">
                                  📊 Ensemble (Rata-rata)
                                </h6>
                                <div className="mb-2">
                                  <small className="text-muted">Avg Probabilitas Dropout:</small>
                                  <strong className="d-block" style={{ fontSize: '1.25rem' }}>
                                    {(predictions.ensemble.avgDropoutProb * 100).toFixed(1)}%
                                  </strong>
                                </div>
                                <div className="progress" style={{ height: 8 }}>
                                  <div 
                                    className="progress-bar bg-primary" 
                                    style={{ width: `${predictions.ensemble.avgDropoutProb * 100}%` }}
                                  />
                                </div>
                                <small className="text-muted d-block mt-2">
                                  Consensus: <RiskBadge level={predictions.ensemble.riskLevel} />
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </ChartCard>
                    </Col>

                    <Col xs={12}>
                      <ChartCard title="Catatan & Rekomendasi" className="h-100">
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
                </>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
export default StudentDetail;