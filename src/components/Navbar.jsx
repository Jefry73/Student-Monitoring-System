import { Navbar, Nav, NavDropdown, Badge } from "react-bootstrap";
import { Bell, PersonCircle } from "react-bootstrap-icons";
import { getUserSession, clearUserSession } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const AppNavbar = () => {
  const user = getUserSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUserSession();
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="navbar-custom px-3 py-2">
      <Navbar.Brand href={user?.role === 'admin' ? '/admin' : '/dosen'}>
        Academic Monitor
      </Navbar.Brand>
      
      <Nav className="ms-auto align-items-center gap-3">
        <div className="position-relative">
          <Bell size={20} />
          <Badge bg="danger" pill style={{ position: 'absolute', top: -8, right: -8, fontSize: '0.65rem' }}>
            3
          </Badge>
        </div>
        
        <NavDropdown 
          title={
            <span>
              <PersonCircle className="me-2" />
              {user?.name || 'User'}
            </span>
          } 
          align="end"
        >
          <NavDropdown.Item disabled>
            <small className="text-muted">
              {user?.role === 'admin' ? 'Administrator' : 'Dosen Wali'}
            </small>
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
          <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout} className="text-danger">
            Logout
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
};
export default AppNavbar;