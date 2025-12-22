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
      icon: <i className="ph ph-chart-donut" />,
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
      icon: <i className="ph ph-map-trifold" />,
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
    }
  ]
};

export default capNhatThiebi;
