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
      icon: <i className="ph ph-pencil-ruler" />,
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
          url: '/bomnuoc/tonghopbomnuoc'
        }
      ]
    },
    {
      id: 'quatgio',
      title: 'Quạt gió',
      type: 'collapse',
      icon: <i className="ph ph-airplane-landing " />,
      children: [
        {
          id: 'danhmucquatgio',
          title: 'Danh mục quạt gió',
          type: 'item',
          url: '/quatgio/danhmucquatgio'
        },
        {
          id: 'thongsoquatgio',
          title: 'Thông số quạt gió',
          type: 'item',
          url: '/quatgio/thongsoquatgio'
        },
        {
          id: 'capnhatquatgio',
          title: 'Cập nhật quạt gió',
          type: 'item',
          url: '/quatgio/tonghopquatgio'
        }
      ]
    },
    {
      id: 'giacot',
      title: 'Giá cột',
      type: 'collapse',
      icon: <i className="ph ph-aperture " />,
      children: [
        {
          id: 'danhmucgiacot',
          title: 'Danh mục giá, cột',
          type: 'item',
          url: '/giacot/danhmucgiacot'
        },
        {
          id: 'capnhatgiacot',
          title: 'Cập nhật giá cột',
          type: 'item',
          url: '/giacot/capnhatgiacot'
        }
      ]
    },
    {
      id: 'danhmuc',
      title: 'Danh mục',
      type: 'collapse',
      icon: <i className="ph ph-aperture " />,
      children: [
        {
          id: 'danhmucdonvi',
          title: 'Danh mục đơn vị',
          type: 'item',
          url: '/danhmuc/danhmucdonvi'
        }
      ]
    }
  ]
};

export default capNhatThiebi;
