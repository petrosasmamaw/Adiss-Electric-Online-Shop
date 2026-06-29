import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = localStorage.getItem('ae_admin_token');

  if (!isAuthenticated && !token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
