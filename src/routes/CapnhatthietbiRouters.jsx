import { lazy } from 'react';

// project-imports
import DashboardLayout from 'layout/Dashboard';
import Loadable from 'components/Loadable';
import ProtectRouter from './ProtectRouter';
// render - máy cào
const DanhmucMaycao = Loadable(lazy(() => import('views/maycao/DanhmucMaycao')));
const ThongsoMaycao = Loadable(lazy(() => import('views/maycao/Capnhatthongsomaycao')));
const CapnhatMaycao = Loadable(lazy(() => import('views/maycao/Capnhatmaycao')));
// render - máy xúc
const DanhmucMayxuc = Loadable(lazy(() => import('views/mayxuc/DanhmucMayxuc')));
const ThongsoMayxuc = Loadable(lazy(() => import('views/mayxuc/CapnhatThongSoMayxuc')));
const CapnhatMayxuc = Loadable(lazy(() => import('views/mayxuc/Capnhatmayxuc')));
// ==============================|| CHART & MAP ROUTING ||============================== //

const CapnhatthietbiRouters = {
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
          path: 'maycao',
          children: [
            {
              path: 'danhmucmaycao',
              element: <DanhmucMaycao />
            },
            {
              path: 'capnhatthongsomaycao',
              element: <ThongsoMaycao />
            },
            {
              path: 'capnhatmaycao',
              element: <CapnhatMaycao />
            }
          ]
        },
        {
          path: 'mayxuc',
          children: [
            {
              path: 'danhmucmayxuc',
              element: <DanhmucMayxuc />
            },
            {
              path: 'capnhatthongsomayxuc',
              element: <ThongsoMayxuc />
            },
            {
              path: 'capnhatmayxuc',
              element: <CapnhatMayxuc />
            }
          ]
        }
      ]
    }
  ]
};

export default CapnhatthietbiRouters;
