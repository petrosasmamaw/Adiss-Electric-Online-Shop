import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import ControlManager from '../components/admin/ControlManager';
import ItemsManager from '../components/admin/ItemsManager';
import OrdersManager from '../components/admin/OrdersManager';

export default function AdminDashboard() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard/control" replace />} />
        <Route path="dashboard/control" element={<ControlManager />} />
        <Route path="dashboard" element={<ItemsManager />} />
        <Route path="dashboard/orders" element={<OrdersManager />} />
      </Route>
    </Routes>
  );
}
