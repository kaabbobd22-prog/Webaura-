import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="space-y-6">
        <Outlet />
      </div>
    </div>
  );
}
