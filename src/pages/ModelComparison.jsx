import { useState, useEffect } from "react";
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
  const [selectedModel, setSelectedModel] = useState("Random Forest");

  useEffect(() => {
    // Proteksi: hanya admin yang bisa akses
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const currentMatrix = confusionMatrices[selectedModel];
  const labels = ["Rendah", "Sedang", "Tinggi"];

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
            <Form.Select 
              style={{ width: 'auto' }}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="Random Forest">Random Forest</option>
              <option value="SVM">Support Vector Machine</option>
              <option value="Neural Network">Neural Network</option>
            </Form.Select>
          </div>

          <Row className="g-4 mb-4">
            {modelMetrics.map((model) => (
              <Col md={4} key={model.model}>
                <Card className={`stat-card ${selectedModel === model.model ? 'border-primary' : ''}`}>
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
              <ChartCard title={`Confusion Matrix - ${selectedModel}`}>
                <ConfusionMatrix matrix={currentMatrix} labels={labels} />
              </ChartCard>
            </Col>
            <Col lg={6}>
              <FeatureImportance featureImportance={featureImportance} />
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <ChartCard title="Interpretasi Model">
                <div className="p-3">
                  <h6>Model Terpilih: {selectedModel}</h6>
                  <p className="text-muted mb-3">
                    {selectedModel === "Random Forest" && "Random Forest menunjukkan performa terbaik dengan accuracy 91% dan keseimbangan yang baik antara precision dan recall."}
                    {selectedModel === "SVM" && "Support Vector Machine memberikan hasil yang stabil dengan accuracy 87%, cocok untuk dataset dengan dimensi tinggi."}
                    {selectedModel === "Neural Network" && "Neural Network mencapai accuracy tertinggi 93%, sangat efektif untuk pattern recognition kompleks."}
                  </p>
                  
                  <h6>Rekomendasi</h6>
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