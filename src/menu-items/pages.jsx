// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages = {
  id: 'pages',
  title: 'Hệ thống',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Tài khoản',
      type: 'collapse',
      icon: <i className="ph ph-lock-key" />,
      children: [
        {
          id: 'login',
          title: 'Đăng nhập',
          type: 'item',
          url: '/login',
          target: true
        },
        {
          id: 'register',
          title: 'Đăng ký',
          type: 'item',
          url: '/register',
          target: true
        }
      ]
    }
  ]
};

export default pages;
