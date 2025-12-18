import { Navigate } from 'react-router-dom';
function ProtectRouter({ children }) {
  const isLogin = localStorage.getItem('accessToken');
  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
export default ProtectRouter;
