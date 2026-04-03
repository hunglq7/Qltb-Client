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
const ThongsoMayxuc = Loadable(lazy(() => import('views/mayxuc/CapnhatThongsoMayxuc')));
const CapnhatMayxuc = Loadable(lazy(() => import('views/mayxuc/Capnhatmayxuc')));

//render - Tời điện

const DanhmucToidien = Loadable(lazy(() => import('views/toidien/Danhmuctoidien')));
const ThongsoToidien = Loadable(lazy(() => import('views/toidien/Thongsotoidien')));
const CapnhatToidien = Loadable(lazy(() => import('views/toidien/Capnhattoidien')));

//Render- Bơm nước
const DanhmucBomnuoc = Loadable(lazy(() => import('views/bomnuoc/Danhmucbomnuoc')));
const ThongsoBomnuoc = Loadable(lazy(() => import('views/bomnuoc/Thongsobomnuoc')));
const TonghopBomnuoc = Loadable(lazy(() => import('views/bomnuoc/Tonghopbomnuoc')));

//Render - Quạt gió
const DanhmucQuatgio = Loadable(lazy(() => import('views/quatgio/Danhmucquatgio')));
const ThongsoQuatgio = Loadable(lazy(() => import('views/quatgio/Thongsoquatgio')));
const TonghopQuatgio = Loadable(lazy(() => import('views/quatgio/Tonghopquatgio')));
//Render - Giacot
const DanhmucGiacot = Loadable(lazy(() => import('views/giacot/Danhmucgiacot')));
const CapnhatGiacot = Loadable(lazy(() => import('views/giacot/Capnhatgiacot')));
//Render-Role
const Danhmucrole = Loadable(lazy(() => import('views/role/Danhmucrole')));
const Capnhatrole = Loadable(lazy(() => import('views/role/Tonghoprole')));
//Render - Biến áp
const Danhmucbienap = Loadable(lazy(() => import('views/bienap/Danhmucbienap')));
const Capnhatbienap = Loadable(lazy(() => import('views/bienap/Capnhatbienap')));
//Render - Khoan Ba Lang
const Danhmuckhoanbalang = Loadable(lazy(() => import('views/khoanbalang/Danhmuckhoanbalang')));
const Capnhatkhoanbalang = Loadable(lazy(() => import('views/khoanbalang/Capnhatkhoanbalang')));
//Render - Neo
const Danhmucneo = Loadable(lazy(() => import('views/neo/Danhmucneo')));
const Capnhatneo = Loadable(lazy(() => import('views/neo/Capnhatneo')));
//Render-AptomatKhoidongtu
const Danhmucaptomatkhoidongtu = Loadable(lazy(() => import('views/aptomatkhoidongtu/Danhmucaptomatkhoidongtu')));
const Capnhataptomatkhoidongtu = Loadable(lazy(() => import('views/aptomatkhoidongtu/Capnhataptomatkhoidongtu')));
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
            }
          ]
        },
        {
          path: 'bomnuoc',
          children: [
            {
              path: 'danhmucbomnuoc',
              element: <DanhmucBomnuoc />
            },
            {
              path: 'thongsobomnuoc',
              element: <ThongsoBomnuoc />
            },
            {
              path: 'tonghopbomnuoc',
              element: <TonghopBomnuoc />
            }
          ]
        },
        {
          path: 'quatgio',
          children: [
            {
              path: 'danhmucquatgio',
              element: <DanhmucQuatgio />
            },
            {
              path: 'thongsoquatgio',
              element: <ThongsoQuatgio />
            },
            {
              path: 'tonghopquatgio',
              element: <TonghopQuatgio />
            }
          ]
        },
        {
          path: 'giacot',
          children: [
            {
              path: 'danhmucgiacot',
              element: <DanhmucGiacot />
            },
            {
              path: 'capnhatgiacot',
              element: <CapnhatGiacot />
            }
          ]
        },
        {
          path: 'role',
          children: [
            {
              path: 'danhmucrole',
              element: <Danhmucrole />
            },
            {
              path: 'capnhatrole',
              element: <Capnhatrole />
            }
          ]
        },
        {
          path: 'bienap',
          children: [
            {
              path: 'danhmucbienap',
              element: <Danhmucbienap />
            },
            {
              path: 'capnhatbienap',
              element: <Capnhatbienap />
            }
          ]
        },
        {
          path: 'khoanbalang',
          children: [
            {
              path: 'danhmuckhoanbalang',
              element: <Danhmuckhoanbalang />
            },
            {
              path: 'capnhatkhoanbalang',
              element: <Capnhatkhoanbalang />
            }
          ]
        },
        {
          path: 'neo',
          children: [
            {
              path: 'danhmucneo',
              element: <Danhmucneo />
            },
            {
              path: 'capnhatneo',
              element: <Capnhatneo />
            }
          ]
        },
        {
          path: 'aptomatkhoidongtu',
          children: [
            {
              path: 'danhmucaptomatkhoidongtu',
              element: <Danhmucaptomatkhoidongtu />
            },
            {
              path: 'capnhataptomatkhoidongtu',
              element: <Capnhataptomatkhoidongtu />
            }
          ]
        }
      ]
    }
  ]
};

export default CapnhatthietbiRouters;
