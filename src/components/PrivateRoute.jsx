import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../Hooks/useAuthStatus';
import ProfileLoading from '../skeleton/ProfileLoading';

const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();
  // console.log(loggedIn);
  if (checkingStatus) {
    return <ProfileLoading />;
  }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
