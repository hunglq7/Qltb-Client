import { lazy } from 'react';

// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
//protectRouter
import ProtectRouter from './ProtectRouter';
// render - forms element pages
const FormBasic = Loadable(lazy(() => import('views/forms/form-element/FormBasic')));

// ==============================|| FORMS ROUTING ||============================== //

const FormsRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <ProtectRouter>
          <DashboardLayout />
        </ProtectRouter>
      ),
      children: [
        {
          path: 'forms',
          children: [
            {
              path: 'form-elements',
              children: [{ path: 'basic', element: <FormBasic /> }]
            }
          ]
        }
      ]
    }
  ]
};

export default FormsRoutes;
