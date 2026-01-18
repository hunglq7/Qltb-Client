import { Children, lazy } from 'react';

// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import ProtectRouter from './ProtectRouter';
//=========Render Danh mục đơn vị==========
const DanhmucDonvi = Loadable(lazy(() => import('views/donvi/Danhmucdonvi')));
const DanhmucRouters = {
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
          path: 'donvi',
          children: [
            {
              path: 'danhmucdonvi',
              element: <DanhmucDonvi />
            }
          ]
        }
      ]
    }
  ]
};

export default DanhmucRouters;
