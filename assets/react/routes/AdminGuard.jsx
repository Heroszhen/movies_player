import { Outlet, Navigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';

const AdminGuard = () => {
  const { user } = useUserStore();
  return user === null || !user.roles.includes('ROLE_ADMIN') || [null, ''].includes(localStorage.getItem('token')) ? (
    <Navigate to="/404" replace />
  ) : (
    <Outlet />
  );
};
export default AdminGuard;
