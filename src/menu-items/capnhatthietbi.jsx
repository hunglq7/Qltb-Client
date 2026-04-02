// ==============================|| MENU ITEMS - CHARTS & MAPS ||============================== //

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
      id: 'role',
      title: 'Role',
      type: 'collapse',
      icon: <i className="ph ph-image" />,
      children: [
        {
          id: 'danhmucrole',
          title: 'Danh mục role',
          type: 'item',
          url: '/role/danhmucrole'
        },
        {
          id: 'capnhatrole',
          title: 'Cập nhật role',
          type: 'item',
          url: '/role/capnhatrole'
        }
      ]
    },
    {
      id: 'bienap',
      title: 'Biến áp',
      type: 'collapse',
      icon: <i className="ph ph-package" />,
      children: [
        {
          id: 'danhmucbienap',
          title: 'Danh mục biến áp',
          type: 'item',
          url: '/bienap/danhmucbienap'
        },
        {
          id: 'capnhatbienap',
          title: 'Cập nhật biến áp',
          type: 'item',
          url: '/bienap/capnhatbienap'
        }
      ]
    },
    {
      id: 'khoanbalang',
      title: 'Khoan Ba Lang',
      type: 'collapse',
      icon: <i className="ph ph-folders" />,
      children: [
        {
          id: 'danhmuckhoanbalang',
          title: 'Danh mục khoan ba lang',
          type: 'item',
          url: '/khoanbalang/danhmuckhoanbalang'
        },
        {
          id: 'capnhatkhoanbalang',
          title: 'Cập nhật khoan bằng lang',
          type: 'item',
          url: '/khoanbalang/capnhatkhoanbalang'
        }
      ]
    },
    {
      id: 'neo',
      title: 'Neo, Bơm, Phun Bê Tông',
      type: 'collapse',
      icon: <i className="ph ph-folder-star" />,
      children: [
        {
          id: 'danhmucneo',
          title: 'Danh mục neo, bơm, phun bê tông',
          type: 'item',
          url: '/neo/danhmucneo'
        },
        {
          id: 'capnhatneo',
          title: 'Cập nhật neo, bơm, phun bê tông',
          type: 'item',
          url: '/neo/capnhatneo'
        }
      ]
    },
    {
      id: 'AptomatKhoidongtu',
      title: 'Aptomat, Khởi Động Từ',
      type: 'collapse',
      icon: <i className="ph ph-gear" />,
      children: [
        {
          id: 'danhmucaptomatkhoidongtu',
          title: 'Danh mục aptomat khởi động tự',
          type: 'item',
          url: '/aptomatkhoidongtu/danhmucaptomatkhoidongtu'
        },
        {
          id: 'capnhataptomatkhoidongtu',
          title: 'Cập nhật aptomat khởi động tự',
          type: 'item',
          url: '/aptomatkhoidongtu/capnhataptomatkhoidongtu'
        }
      ]
    }
  ]
};

export default capNhatThiebi;
