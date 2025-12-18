import React from 'react';
import { Link } from 'react-router-dom';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Stack from 'react-bootstrap/Stack';
import { useNavigate } from 'react-router-dom';
// project-imports
import MainCard from 'components/MainCard';
import SimpleBarScroll from 'components/third-party/SimpleBar';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// assets
import Img1 from 'assets/images/user/avatar-1.png';
import Img2 from 'assets/images/user/avatar-2.png';
import Img3 from 'assets/images/user/avatar-3.png';
import Img4 from 'assets/images/user/avatar-4.png';
import Img5 from 'assets/images/user/avatar-5.png';
//service
import { authService } from '../../services/auth/authService';
const notifications = [
  {
    id: 1,
    avatar: Img1,
    time: '2 min ago',
    title: 'UI/UX Design',
    description: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    date: 'Today'
  },
  {
    id: 2,
    avatar: Img2,
    time: '1 hour ago',
    title: 'Message',
    description: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    date: 'Today'
  },
  {
    id: 3,
    avatar: Img3,
    time: '2 hour ago',
    title: 'Forms',
    description: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    date: 'Yesterday'
  },
  {
    id: 4,
    avatar: Img4,
    time: '12 hour ago',
    title: 'Challenge invitation',
    description: 'Jonny aber invites you to join the challenge',
    actions: true,
    date: 'Yesterday'
  },
  {
    id: 5,
    avatar: Img5,
    time: '5 hour ago',
    title: 'Security',
    description: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    date: 'Yesterday'
  }
];

// =============================|| MAIN LAYOUT - HEADER ||============================== //

export default function Header() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;
  const naVigate = useNavigate();
  const onLogOut = async () => {
    await authService.logout();
    naVigate('/login');
  };
  return (
    <header className="pc-header">
      <div className="header-wrapper">
        <div className="me-auto pc-mob-drp">
          <Nav className="list-unstyled">
            <Nav.Item className="pc-h-item pc-sidebar-collapse">
              <Nav.Link
                as={Link}
                to="#"
                className="pc-head-link ms-0"
                id="sidebar-hide"
                onClick={() => {
                  handlerDrawerOpen(!drawerOpen);
                }}
              >
                <i className="ph ph-list" />
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="pc-h-item pc-sidebar-popup">
              <Nav.Link as={Link} to="#" className="pc-head-link ms-0" id="mobile-collapse" onClick={() => handlerDrawerOpen(!drawerOpen)}>
                <i className="ph ph-list" />
              </Nav.Link>
            </Nav.Item>

            <Dropdown className="pc-h-item dropdown">
              <Dropdown.Toggle variant="link" className="pc-head-link arrow-none m-0 trig-drp-search" id="dropdown-search">
                <i className="ph ph-magnifying-glass" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="pc-h-dropdown drp-search">
                <Form className="px-3 py-2">
                  <Form.Control type="search" placeholder="Search here. . ." className="border-0 shadow-none" />
                </Form>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
        <div className="ms-auto">
          <Nav className="list-unstyled">
            <Dropdown className="pc-h-item" align="end">
              <Dropdown.Toggle
                className="pc-head-link arrow-none me-0"
                variant="link"
                id="user-profile-dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="ph ph-user-circle" />
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-user-profile pc-h-dropdown p-0 overflow-hidden">
                <Dropdown.Header className="bg-primary">
                  <Stack direction="horizontal" gap={3} className="my-2">
                    <div className="flex-shrink-0">
                      <Image src={Img1} alt="user-avatar" className="user-avatar wid-35" roundedCircle />
                    </div>
                    <Stack gap={1}>
                      <h6 className="text-white mb-0">Phòng CV 🖖</h6>
                      <span className="text-white text-opacity-75">codien@thanmongduong.vn</span>
                    </Stack>
                  </Stack>
                </Dropdown.Header>

                <div className="dropdown-body">
                  <div className="profile-notification-scroll position-relative" style={{ maxHeight: 'calc(100vh - 225px)' }}>
                    <Dropdown.Item as={Link} to="#" className="justify-content-start">
                      <i className="ph ph-gear me-2" />
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="#" className="justify-content-start">
                      <i className="ph ph-share-network me-2" />
                      Share
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="#" className="justify-content-start">
                      <i className="ph ph-lock-key me-2" />
                      Change Password
                    </Dropdown.Item>
                    <div className="d-grid my-2">
                      <Button onClick={onLogOut}>
                        <i className="ph ph-sign-out align-middle me-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </div>
    </header>
  );
}
