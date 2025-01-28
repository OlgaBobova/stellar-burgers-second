import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader/preloader';
import {
  selectUser,
  selectIsAuthChecked,
  selectIsAuthenticated
} from '../../services/slices/UserInfoSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthChecked) {
    // Пока идет чек-аут пользователя, показываем прелоадер
    return <Preloader />;
  }

  if (isAuthenticated && onlyUnAuth) {
    // Если пользователь аутентифицирован и находится на странице, доступной только неаутентифицированным пользователям
    return <Navigate to='/' />;
  }

  if (!onlyUnAuth && !user) {
    // Если пользователь не аутентифицирован и пытается получить доступ к защищенной странице
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    // Если пользователь аутентифицирован и находится на странице, доступной только неаутентифицированным пользователям
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
