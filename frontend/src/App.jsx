import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ContactModal from './components/ContactModal';
import OrderModal from './components/OrderModal';
import ToastContainer from './components/ToastContainer';
import PwaUpdatePrompt from './components/PwaUpdatePrompt';
import ProtectedRoute from './components/ProtectedRoute';
import usePageTitle from './hooks/usePageTitle';
import Storefront from './pages/Storefront';
import AdminLogin from './pages/AdminLogin';
import AdminForgotPassword from './pages/AdminForgotPassword';
import AdminResetPassword from './pages/AdminResetPassword';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isPublicAdminPage = [
    '/admin/login',
    '/admin/forgot-password',
    '/admin/reset-password',
  ].includes(location.pathname);
  usePageTitle();

  return (
    <>
      {(!isAdminRoute || isPublicAdminPage) && <Navbar />}
      {!isAdminRoute && <ContactModal />}
      {!isAdminRoute && <OrderModal />}
      <ToastContainer />
      <PwaUpdatePrompt />
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
