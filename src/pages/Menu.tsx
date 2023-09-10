import { Menu } from "antd";
import { HomeOutlined, FileImageOutlined } from "@ant-design/icons";
import { NavLink, useLocation } from "react-router-dom";
import routes from "../config/route";

const SidebarMenu = () => {
  const location = useLocation();

  return (
    <Menu
      theme="light"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={[
        {
          key: routes.Home,
          icon: <HomeOutlined />,
          label: <NavLink to={routes.Home}>首页</NavLink>,
        },
        {
          key: routes.ChangeBackground,
          icon: <FileImageOutlined />,
          label: <NavLink to={routes.ChangeBackground}>换背景</NavLink>,
        },
        {
          key: routes.GeneratePoster,
          icon: <FileImageOutlined />,
          label: <NavLink to={routes.GeneratePoster}>海报生成</NavLink>,
        },
      ]}
    />
  );
};

export default SidebarMenu;
