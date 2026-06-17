import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { setUserSession } from "../utils/auth";
import { dosenWali } from "../data/sampleData";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validasi sederhana
    if (!username || !password) {
      setError("Username dan password harus diisi");
      return;
    }

    // Simulasi login
    let userData = {};
    
    if (role === "admin") {
      userData = {
        id: 'admin-1',
        name: 'Administrator',
        role: 'admin',
        username: username
      };
      setUserSession(userData);
      navigate("/admin");
    } else {
      // Untuk dosen, ambil data dari dosenWali
      const dosen = dosenWali[0]; // Simulasi: login sebagai dosen pertama
      userData = {
        id: dosen.id,
        nip: dosen.nip,
        name: dosen.name,
        role: 'dosen',
        username: username
      };
      setUserSession(userData);
      navigate("/dosen");
    }
  };

  return (
    <div style={{ 
  minHeight: "100vh", 
  background: "linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)",
  display: "flex",
  alignItems: "center"
}}>

      <Container>
        <Row className="justify-content-center">
          <Col md={5} lg={4}>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h3 className="fw-bold">Academic Monitor</h3>
                  <p className="text-muted small">Sistem Monitoring Performa Akademik</p>
                </div>
                
                {error && <Alert variant="danger" className="py-2">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                      type="text"
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Masukkan username" 
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password" 
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Login Sebagai</Form.Label>
                    <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="admin">Administrator (Prodi)</option>
                      <option value="dosen">Dosen Wali</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <Button type="submit" className="w-100" variant="primary" size="lg">
                    Login
                  </Button>
                </Form>
                
                <div className="mt-3 text-center">
                  <small className="text-muted">
                    Demo: Gunakan username dan password apa saja
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;