// src/App.tsx
import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { DashboardOutlined, BarChartOutlined, ApartmentOutlined, UserOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';

// Import components
import DashboardOverview from './components/DashboardOverview';
import RiskAssessment from './components/RiskAssessment';
import WorkflowManagement from './components/WorkflowManagement';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div className="logo">
            {!collapsed && <Title level={4} style={{ color: 'white', margin: '16px' }}>Credit Risk</Title>}
          </div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<BarChartOutlined />}>
              <Link to="/risk-assessment">Risk Assessment</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<ApartmentOutlined />}>
              <Link to="/workflow">Workflow Management</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0, background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 24px' }}>
              <UserOutlined style={{ fontSize: '18px', marginRight: '8px' }} />
              <span>Credit Risk Officer</span>
            </div>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/risk-assessment" element={<RiskAssessment />} />
                <Route path="/workflow" element={<WorkflowManagement />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Credit Risk Analytics Dashboard ©{new Date().getFullYear()}</Footer>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;