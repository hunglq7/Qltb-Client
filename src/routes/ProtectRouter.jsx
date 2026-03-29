import { useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { authService } from '../services/auth/authService';

const AUTO_LOGOUT_MINUTES = 5; // Thời gian không hoạt động (phút)
const AUTO_LOGOUT_MS = AUTO_LOGOUT_MINUTES * 60 * 1000;

function ProtectRouter({ children }) {
  const navigate = useNavigate();
  const isLogin = localStorage.getItem('accessToken');

  const updateLastActivity = useCallback(() => {
    if (isLogin) {
      localStorage.setItem('lastActivity', Date.now().toString());
    }
  }, [isLogin]);

  const doLogout = useCallback(() => {
    authService.logout();
    message.info('Đã đăng xuất do không hoạt động trong thời gian dài.');
    navigate('/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!isLogin) return;

    updateLastActivity();

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, updateLastActivity));

    const interval = setInterval(() => {
      const last = Number(localStorage.getItem('lastActivity'));
      if (!last) {
        doLogout();
        return;
      }
      if (Date.now() - last > AUTO_LOGOUT_MS) {
        doLogout();
      }
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
      events.forEach((event) => window.removeEventListener(event, updateLastActivity));
    };
  }, [isLogin, updateLastActivity, doLogout]);

  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectRouter;
