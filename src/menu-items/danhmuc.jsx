// ==============================|| MENU ITEMS - CHARTS & MAPS ||============================== //

const danhmuc = {
  id: 'capnhatdanhmuc',
  title: 'Cập nhật danh mục',
  type: 'group',
  children: [
    {
      id: 'danhmuc',
      title: 'Danh mục',
      type: 'collapse',
      icon: <i className="ti ti-device-imac-pause" />,
      children: [
        {
          id: 'danhmucdonvi',
          title: 'Đơn vị',
          type: 'item',
          url: '/donvi/danhmucdonvi'
        },
        {
          id: 'danhmucchucvu',
          title: 'Chức vụ',
          type: 'item',
          url: '/chucvu/danhmucchucvu'
        },
        {
          id: 'danhmucloai',
          title: 'Loại thiết bị',
          type: 'item',
          url: '/loai/danhmucloai'
        }
      ]
    }
  ]
};

export default danhmuc;
