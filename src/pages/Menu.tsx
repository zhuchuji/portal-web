import { Menu } from 'antd';
import {
  HomeOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

const SidebarMenu = () => (
  <Menu
    theme="light"
    mode="inline"
    defaultSelectedKeys={['1']}
    items={[
      {
        key: '1',
        icon: <HomeOutlined />,
        label: <NavLink to="/">首页</NavLink>,
      },
      {
        key: '2',
        icon: <FileImageOutlined />,
        label: <NavLink to="/change-background">换背景</NavLink>,
      }
    ]}
  />
);

export default SidebarMenu;