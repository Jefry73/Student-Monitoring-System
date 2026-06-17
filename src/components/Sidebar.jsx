import { Nav } from "react-bootstrap";
import { House, People, GraphUp, ClipboardData, PersonCircle } from "react-bootstrap-icons";
import { getUserSession } from "../utils/auth";

const Sidebar = ({ collapsed }) => {
  const user = getUserSession();
  const isAdmin = user?.role === 'admin';

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="p-3 border-bottom">
        <h5 className="text-white mb-0">{isAdmin ? 'Admin Panel' : 'Dosen Wali'}</h5>
        <small className="text-white-50">{user?.name || 'User'}</small>
      </div>
      
      <Nav className="flex-column p-3">
        {isAdmin ? (
          // Menu untuk Admin
          <>
            <Nav.Link href="/admin" className="text-white mb-2">
              <House className="me-2" /> Dashboard
            </Nav.Link>
            <Nav.Link href="/data-mahasiswa" className="text-white mb-2">
              <People className="me-2" /> Data Mahasiswa
            </Nav.Link>
            <Nav.Link href="/data-akademik" className="text-white mb-2">
              <ClipboardData className="me-2" /> Data Akademik
            </Nav.Link>
            <Nav.Link href="/models" className="text-white mb-2">
              <GraphUp className="me-2" /> Model Comparison
            </Nav.Link>
          </>
        ) : (
          // Menu untuk Dosen Wali (lebih sederhana)
          <>
            <Nav.Link href="/dosen" className="text-white mb-2">
              <House className="me-2" /> Dashboard
            </Nav.Link>
          </>
        )}
      </Nav>
    </aside>
  );
};
export default Sidebar;