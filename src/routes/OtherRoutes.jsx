import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectRouter from './ProtectRouter';
// render - other pages
const OtherSamplePage = Loadable(lazy(() => import('views/SamplePage')));

// ==============================|| OTHER ROUTING ||============================== //

const OtherRoutes = {
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
          path: 'other',
          children: [
            {
              path: 'sample-page',
              element: <OtherSamplePage />
            }
          ]
        }
      ]
    }
  ]
};

export default OtherRoutes;
