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
<<<<<<< HEAD
//render - Tời điện

const DanhmucToidien = Loadable(lazy(() => import('views/toidien/Danhmuctoidien')));
const ThongsoToidien = Loadable(lazy(() => import('views/toidien/Thongsotoidien')));
const CapnhatToidien = Loadable(lazy(() => import('views/toidien/Capnhattoidien')));
=======
>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9
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
<<<<<<< HEAD
            }
          ]
        },
        {
          path: 'toidien',
          children: [
            {
              path: 'danhmuctoidien',
              element: <DanhmucToidien />
            },
            {
              path: 'thongsotoidien',
              element: <ThongsoToidien />
            },
            {
              path: 'capnhattoidien',
              element: <CapnhatToidien />
=======
>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9
            }
          ]
        }
      ]
    }
  ]
};

export default CapnhatthietbiRouters;
