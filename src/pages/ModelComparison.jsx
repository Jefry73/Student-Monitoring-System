import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChartCard from "../components/ChartCard";
import ConfusionMatrix from "../components/ConfusionMatrix";
import FeatureImportance from "../components/FeatureImportance";
import { modelMetrics, confusionMatrices, featureImportance } from "../data/sampleData";
import { getUserSession } from "../utils/auth";

const ModelComparison = () => {
  const navigate = useNavigate();
  const user = getUserSession();

  useEffect(() => {
    // Proteksi: hanya admin yang bisa akses
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const labels = ["Graduate", "Dropout"];

  return (
    <div className="app-container">
      <Sidebar collapsed={false} />
      <div className="flex-grow-1">
        <Navbar />
        <Container fluid className="content-wrapper">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="mb-1">Model Comparison</h3>
              <p className="text-muted mb-0">Bandingkan performa model Machine Learning untuk prediksi risiko akademik</p>
            </div>
            <div className="text-muted">Semua model dibandingkan dan diinterpretasikan di bawah.</div>
          </div>

          <Row className="g-4 mb-4">
            {modelMetrics.map((model) => (
              <Col md={4} key={model.model}>
                <Card className={`'border-primary' : ''}`}>
                  <Card.Body>
                    <h6 className="text-muted mb-3">{model.model}</h6>
                    <Row className="g-3">
                      <Col xs={6}>
                        <small className="text-muted d-block">Accuracy</small>
                        <strong className="fs-5">{(model.accuracy * 100).toFixed(1)}%</strong>
                      </Col>
                      <Col xs={6}>
                        <small className="text-muted d-block">Precision</small>
                        <strong className="fs-5">{(model.precision * 100).toFixed(1)}%</strong>
                      </Col>
                      <Col xs={6}>
                        <small className="text-muted d-block">Recall</small>
                        <strong className="fs-5">{(model.recall * 100).toFixed(1)}%</strong>
                      </Col>
                      <Col xs={6}>
                        <small className="text-muted d-block">F1-Score</small>
                        <strong className="fs-5">{(model.f1 * 100).toFixed(1)}%</strong>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Row className="g-4">
            <Col lg={6}>
              <ChartCard title="Confusion Matrices">
                <div className="row g-4">
                  {Object.entries(confusionMatrices).map(([modelName, matrix]) => (
                    <div className="col-12" key={modelName}>
                      <Card className="chart-card mb-3">
                        <Card.Header className="bg-white border-0 pb-0">
                          <h5 className="mb-0">{modelName}</h5>
                        </Card.Header>
                        <Card.Body>
                          <ConfusionMatrix matrix={matrix} labels={labels} />
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </Col>
            <Col lg={6}>
              <ChartCard title="Interpretasi Model">
                <div className="p-3">
                  <div className="mb-4">
                    <h6>Random Forest</h6>
                    <p className="text-muted">
                      Random Forest memberikan accuracy 84% pada test set dengan 544 graduate dan 196 dropout yang terdeteksi benar, tetapi menghasilkan lebih banyak false negative dibanding SVM.
                    </p>
                  </div>
                  <div className="mb-4">
                    <h6>Support Vector Machine</h6>
                    <p className="text-muted">
                      Support Vector Machine mencapai accuracy 86% pada test set dengan performa paling seimbang dan 203 dropout yang terdeteksi benar.
                    </p>
                  </div>
                  <div>
                    <h6>Neural Network</h6>
                    <p className="text-muted">
                      Neural Network juga mencapai accuracy 86% pada test set, dengan 568 graduate dan 189 dropout yang terdeteksi benar, menunjukkan kekuatan dalam pola non-linier.
                    </p>
                  </div>
                </div>
                <div className="p-3">
                  <h6>Rekomendasi</h6>
                  <p className="text-muted mb-3">
                    Semua model menunjukkan performa yang baik, tetapi SVM dan Neural Network memberikan deteksi dropout yang lebih seimbang pada test set. Random Forest tetap berguna sebagai baseline stabil.
                  </p>
                  <ul className="text-muted">
                    <li>Gunakan model dengan F1-Score tertinggi untuk prediksi risiko akademik</li>
                    <li>Monitor false negative untuk menghindari mahasiswa berisiko yang terlewat</li>
                    <li>Lakukan re-training model setiap semester dengan data terbaru</li>
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
export default ModelComparison;