import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../utils/token';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('ae_admin_token');

  if (!isTokenValid(token)) {
    localStorage.removeItem('ae_admin_token');
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
