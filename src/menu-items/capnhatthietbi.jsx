// ==============================|| MENU ITEMS - CHARTS & MAPS ||============================== //
import { SearchOutlined } from '@ant-design/icons';
import { icons } from 'antd/es/image/PreviewGroup';
const capNhatThiebi = {
  id: 'capnhatthietbi',
  title: 'Cập nhật thiết bị',
  type: 'group',
  children: [
    {
      id: 'maycao',
      title: 'Máy cào',
      type: 'collapse',
      icon: <i className="ti ti-device-imac-pause" />,
      children: [
        {
          id: 'danhmuc',
          title: 'Danh mục máy cào',
          type: 'item',
          url: '/maycao/danhmucmaycao'
        },
        {
          id: 'thongso',
          title: 'Thông số máy cào',
          type: 'item',
          url: '/maycao/capnhatthongsomaycao'
        },
        {
          id: 'capnhatmaycao',
          title: 'Cập nhật máy cào',
          type: 'item',
          url: '/maycao/capnhatmaycao'
        }
      ]
    },
    {
      id: 'mayxuc',
      title: 'Máy xúc',
      type: 'collapse',
      icon: <i className="ph ph-table" />,
      children: [
        {
          id: 'danhmuc',
          title: 'Danh mục máy xúc',
          type: 'item',
          url: '/mayxuc/danhmucmayxuc'
        },
        {
          id: 'thosomayxuc',
          title: 'Thông số máy xúc',
          type: 'item',
          url: '/mayxuc/capnhatthongsomayxuc'
        },
        {
          id: 'capnhatmayxuc',
          title: 'Cập nhật máy xúc',
          type: 'item',
          url: '/mayxuc/capnhatmayxuc'
        }
      ]
    },
    {
      id: 'toidien',
      title: 'Tời điện',
      type: 'collapse',
      icon: <i className="ph ph-tree-structure" />,
      children: [
        {
          id: 'danhmuc',
          title: 'Danh mục tời điện',
          type: 'item',
          url: '/toidien/danhmuctoidien'
        },
        {
          id: 'thongso',
          title: 'Thông số  tời điện',
          type: 'item',
          url: '/toidien/thongsotoidien'
        },
        {
          id: 'capnhat',
          title: 'Cập nhật  tời điện',
          type: 'item',
          url: '/toidien/capnhattoidien'
        }
      ]
    },
    {
      id: 'bomnuoc',
      title: 'Bơm nước',
      type: 'collapse',
      icon: <i className="ph ph-tree-structure" />,
      children: [
        {
          id: 'danhmucbomnuoc',
          title: 'Danh mục bơm nước',
          type: 'item',
          url: '/bomnuoc/danhmucbomnuoc'
        },
        {
          id: 'thongsobomnuoc',
          title: 'Thông số bơm nước',
          type: 'item',
          url: '/bomnuoc/thongsobomnuoc'
        },
        {
          id: 'capnhatbomnuoc',
          title: 'Cập nhật bơm nước',
          type: 'item',
          url: '/bomnuoc/capnhatbomnuoc'
        }
      ]
    }
  ]
};

export default capNhatThiebi;
