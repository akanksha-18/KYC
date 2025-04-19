// // src/App.tsx
// import React, { useState } from 'react';
// import { Layout, Menu, Typography } from 'antd';
// import { DashboardOutlined, BarChartOutlined, ApartmentOutlined, UserOutlined } from '@ant-design/icons';
// import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
// import './App.css';

// // Import components
// import DashboardOverview from './components/DashboardOverview';
// import RiskAssessment from './components/RiskAssessment';
// import WorkflowManagement from './components/WorkflowManagement';

// const { Header, Content, Footer, Sider } = Layout;
// const { Title } = Typography;

// const App: React.FC = () => {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <Router>
//       <Layout style={{ minHeight: '100vh' }}>
//         <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
//           <div className="logo">
//             {!collapsed && <Title level={4} style={{ color: 'white', margin: '16px' }}>Credit Risk</Title>}
//           </div>
//           <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
//             <Menu.Item key="1" icon={<DashboardOutlined />}>
//               <Link to="/">Dashboard</Link>
//             </Menu.Item>
//             <Menu.Item key="2" icon={<BarChartOutlined />}>
//               <Link to="/risk-assessment">Risk Assessment</Link>
//             </Menu.Item>
//             <Menu.Item key="3" icon={<ApartmentOutlined />}>
//               <Link to="/workflow">Workflow Management</Link>
//             </Menu.Item>
//           </Menu>
//         </Sider>
//         <Layout className="site-layout">
//           <Header className="site-layout-background" style={{ padding: 0, background: '#fff' }}>
//             <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 24px' }}>
//               <UserOutlined style={{ fontSize: '18px', marginRight: '8px' }} />
//               <span>Credit Risk Officer</span>
//             </div>
//           </Header>
//           <Content style={{ margin: '0 16px' }}>
//             <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
//               <Routes>
//                 <Route path="/" element={<DashboardOverview />} />
//                 <Route path="/risk-assessment" element={<RiskAssessment />} />
//                 <Route path="/workflow" element={<WorkflowManagement />} />
//               </Routes>
//             </div>
//           </Content>
//           <Footer style={{ textAlign: 'center' }}>Credit Risk Analytics Dashboard ©{new Date().getFullYear()}</Footer>
//         </Layout>
//       </Layout>
//     </Router>
//   );
// };

// export default App;

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Switch, ConfigProvider, theme } from 'antd';
import { 
  DashboardOutlined, 
  BarChartOutlined, 
  ApartmentOutlined, 
  UserOutlined,
  BulbOutlined,
  BulbFilled
} from '@ant-design/icons';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';

// Import components
import DashboardOverview from './components/DashboardOverview';
import RiskAssessment from './components/RiskAssessment';
import WorkflowManagement from './components/WorkflowManagement';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;
const { defaultAlgorithm, darkAlgorithm } = theme;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode !== null ? JSON.parse(savedMode) : false;
  });

  // Save darkMode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    // Optional: Update body background color for a more unified look
    document.body.style.backgroundColor = darkMode ? '#141414' : '#f0f2f5';
  }, [darkMode]);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Determine if the app is running on mobile
  const isMobile = window.innerWidth <= 768;

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
        components: {
          Layout: {
            bodyBg: darkMode ? '#141414' : '#f0f2f5',
            headerBg: darkMode ? '#1f1f1f' : '#fff',
            siderBg: darkMode ? '#1f1f1f' : '#001529',
            footerBg: darkMode ? '#1f1f1f' : '#f0f2f5',
          },
        },
      }}
    >
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider 
            collapsible 
            collapsed={collapsed} 
            onCollapse={setCollapsed}
            breakpoint="lg"
            collapsedWidth={isMobile ? 0 : 80}
          >
            <div className="logo">
              {!collapsed && <Title level={4} style={{ color: 'white', margin: '16px' }}>Credit Risk</Title>}
            </div>
            <Menu
  theme="dark"
  defaultSelectedKeys={['1']}
  mode="inline"
  items={[
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '2',
      icon: <BarChartOutlined />,
      label: <Link to="/risk-assessment">Risk Assessment</Link>,
    },
    {
      key: '3',
      icon: <ApartmentOutlined />,
      label: <Link to="/workflow">Workflow Management</Link>,
    },
  ]}
/>

          </Sider>
          <Layout className="site-layout">
            <Header 
              className="site-layout-header" 
              style={{ 
                padding: 0, 
                background: 'transparent',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 24px' }}>
                <UserOutlined style={{ fontSize: '18px', marginRight: '8px' }} />
                <span>Credit Risk Officer</span>
              </div>
              <div style={{ marginRight: 24, display: 'flex', alignItems: 'center' }}>
                {darkMode ? <BulbFilled style={{ marginRight: 8 }} /> : <BulbOutlined style={{ marginRight: 8 }} />}
                <Switch 
                  checked={darkMode} 
                  onChange={toggleDarkMode} 
                  checkedChildren="🌙" 
                  unCheckedChildren="☀️" 
                />
              </div>
            </Header>
            <Content style={{ margin: '16px' }}>
              <div 
                className="site-layout-content" 
                style={{ 
                  padding: isMobile ? 12 : 24, 
                  minHeight: 360,
                  background: darkMode ? '#1f1f1f' : '#fff',
                  borderRadius: 4
                }}
              >
                <Routes>
                  <Route path="/" element={<DashboardOverview darkMode={darkMode} />} />
                  <Route path="/risk-assessment" element={<RiskAssessment darkMode={darkMode} />} />
                  <Route path="/workflow" element={<WorkflowManagement darkMode={darkMode} />} />
                </Routes>
              </div>
            </Content>
            <Footer style={{ 
              textAlign: 'center',
              background: darkMode ? '#1f1f1f' : '#f0f2f5',
              color: darkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'
            }}>
              Credit Risk Analytics Dashboard ©{new Date().getFullYear()}
            </Footer>
          </Layout>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

export default App;