import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getUserSession } from './utils/auth';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import DosenDashboard from './pages/DosenDashboard';
import StudentDetail from './pages/StudentDetail';
import ModelComparison from './pages/ModelComparison';
import DataMahasiswa from './pages/DataMahasiswa';
import DataAkademik from './pages/DataAkademik';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = getUserSession();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dosen'} replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/data-mahasiswa" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DataMahasiswa />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/data-akademik" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DataAkademik />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/models" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ModelComparison />
            </ProtectedRoute>
          } 
        />
        
        {/* Dosen Routes */}
        <Route 
          path="/dosen" 
          element={
            <ProtectedRoute allowedRoles={['dosen']}>
              <DosenDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Shared Routes (Admin & Dosen) */}
        <Route 
          path="/student/:id" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'dosen']}>
              <StudentDetail />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
export default App;