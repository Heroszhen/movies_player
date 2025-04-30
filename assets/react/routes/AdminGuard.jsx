import { Outlet, Navigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';

const AdminGuard = () => {
  const { user } = useUserStore();
  return (user === null || !user.roles.includes('USER_ADMIN')) && [null, ''].includes(localStorage.getItem('token')) ? (
    <Navigate to="/" />
  ) : (
    <Outlet />
  );
};
export default AdminGuard;
