import React, { useEffect, useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import './Home.scss';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import App from '@/renderer/App';
import MoneyCal from '@/routes/moneyCal/moneyCal';
import ProjectReim from '@/routes/projectReim/projectReim';
import ProjectCost from '@/routes/projectCost/projectCost';
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('工资计算', 'moneyCal', <DesktopOutlined />),
  getItem('项目报销', 'projectReim', <DesktopOutlined />),
  getItem('项目成本', 'projectCost', <DesktopOutlined />),
  // getItem('User', 'sub1', <UserOutlined />, [
  //   getItem('Tom', '3'),
  //   getItem('Bill', '4'),
  //   getItem('Alex', '5'),
  // ]),
];

const Home: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState('moneyCal');
  const nav = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(()=>{
    nav('moneyCal')
  },[])

  const onClick: MenuProps['onClick'] = (e) => {
    // history.push(e.key);
    nav(e.key);
    setCurrent(e.key);
  };

  return (
    <>
      <Header style={{ padding: 0, background: colorBgContainer }}>
        真是服了你个老六
      </Header>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <Menu
            theme="dark"
            mode="inline"
            items={items}
            onClick={onClick}
            forceSubMenuRender={true}
            defaultSelectedKeys={[current]}
          />
        </Sider>
        <Layout>
          <Content style={{ margin: '0 16px' }}>
            <App />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            老六出品 ©{new Date().getFullYear()} Created by oldsix
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default Home;
