import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AuthLayout from 'layout/Auth';

// render - login pages
const LoginPage = Loadable(lazy(() => import('views/auth/login/Login')));

// render - register pages
const RegisterPage = Loadable(lazy(() => import('views/auth/register/Register')));
// error page
const Page404 = Loadable(lazy(() => import('views/page404/Page404')));
const Page500 = Loadable(lazy(() => import('views/page500/Page500')));
// ==============================|| AUTH PAGES ROUTING ||============================== //

const PagesRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        {
          path: 'login',
          element: <LoginPage />
        },
        {
          path: 'register',
          element: <RegisterPage />
        },
        // 🔴 BẮT TẤT CẢ ĐƯỜNG DẪN SAI
        {
          path: '*',
          element: <Page404 />
        },
        {
          path: 'page500',
          element: <Page500 />
        }
      ]
    }
  ]
};

export default PagesRoutes;
