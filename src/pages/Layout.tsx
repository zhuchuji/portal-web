import React, { useState } from 'react';
import {
  HomeOutlined,
  FileImageOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Button, theme } from 'antd';

import Menu from './Menu';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: colorBgContainer }} >
        <Menu />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            overflow: 'auto',
            background: colorBgContainer,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;