// import React, { useEffect, useState } from 'react';
// import { Table, Tag, Button, Select, Modal, Form, Input, notification, Card, Space, Row, Col, Alert } from 'antd';
// import { UserOutlined, ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
// import axios from 'axios';

// const { Option } = Select;

// interface Customer {
//   customerId: string;
//   name: string;
//   monthlyIncome: number;
//   monthlyExpenses: number;
//   creditScore: number;
//   outstandingLoans: number;
//   loanRepaymentHistory: number[];
//   accountBalance: number;
//   status: 'Review' | 'Approved' | 'Rejected';
// }

// interface CustomerWithRisk extends Customer {
//   riskScore: number;
//   riskCategory: string;
// }

// const WorkflowManagement: React.FC = () => {
//   const [customers, setCustomers] = useState<CustomerWithRisk[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [modalVisible, setModalVisible] = useState<boolean>(false);
//   const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithRisk | null>(null);
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [form] = Form.useForm();

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('https://kyc-2rov.onrender.com/api/customers');
//       const customersWithRisk = response.data.map((customer: Customer) => ({
//         ...customer,
//         riskScore: calculateRiskScore(customer),
//         riskCategory: getRiskCategory(calculateRiskScore(customer)),
//       }));
//       setCustomers(customersWithRisk);
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//       notification.error({
//         message: 'Error',
//         description: 'Failed to fetch customer data. Please try again later.',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateRiskScore = (customer: Customer): number => {
//     const creditScoreWeight = 0.4;
//     const repaymentHistoryWeight = 0.3;
//     const debtToIncomeWeight = 0.3;
  
//     const creditScoreFactor = Math.min(customer.creditScore / 850, 1) * 100;
    
//     const repaymentRate = customer.loanRepaymentHistory.length > 0 
//       ? (customer.loanRepaymentHistory.reduce((sum, val) => sum + val, 0) / 
//          customer.loanRepaymentHistory.length * 100)
//       : 0;
    
//     const debtToIncomeRatio = customer.outstandingLoans / (customer.monthlyIncome * 12);
//     const debtToIncomeFactor = Math.max(0, 100 - (debtToIncomeRatio * 100));
    
//     const invertedCreditScore = 100 - creditScoreFactor;
//     const invertedRepaymentRate = 100 - repaymentRate;
    
//     return Math.min(Math.max(
//       invertedCreditScore * creditScoreWeight +
//       invertedRepaymentRate * repaymentHistoryWeight +
//       debtToIncomeFactor * debtToIncomeWeight,
//       0
//     ), 100);
//   };

//   const getRiskCategory = (score: number): string => {
//     if (score < 30) return 'Low Risk';
//     if (score < 60) return 'Medium Risk';
//     return 'High Risk';
//   };

//   const handleStatusChange = (customer: CustomerWithRisk) => {
//     setSelectedCustomer(customer);
//     form.setFieldsValue({
//       status: customer.status,
//       notes: '',
//     });
//     setModalVisible(true);
//   };

//   const handleUpdateStatus = async (values: any) => {
//     if (!selectedCustomer) return;
    
//     try {
//       const updatedCustomer = {
//         ...selectedCustomer,
//         status: values.status,
//       };
      
//       await axios.put(`https://kyc-2rov.onrender.com/api/customers/${selectedCustomer.customerId}`, updatedCustomer);
      
//       // Update local state
//       setCustomers(prevCustomers => 
//         prevCustomers.map(c => 
//           c.customerId === selectedCustomer.customerId 
//             ? { ...c, status: values.status } 
//             : c
//         )
//       );
      
//       notification.success({
//         message: 'Status Updated',
//         description: `${selectedCustomer.name}'s status has been updated to ${values.status}.`,
//       });

//       // Check if we need to send an alert
//       if (selectedCustomer.riskScore > 70 && values.status === 'Approved') {
//         await sendAlert(selectedCustomer, values.notes);
//       }
      
//       setModalVisible(false);
//     } catch (error) {
//       console.error('Error updating status:', error);
//       notification.error({
//         message: 'Error',
//         description: 'Failed to update customer status. Please try again.',
//       });
//     }
//   };

//   const sendAlert = async (customer: CustomerWithRisk, notes: string) => {
//     try {
//       await axios.post('https://kyc-2rov.onrender.com/api/alerts', {
//         customerId: customer.customerId,
//         name: customer.name,
//         riskScore: customer.riskScore,
//         status: customer.status,
//         notes: notes,
//         timestamp: new Date().toISOString(),
//       });
      
//       notification.warning({
//         message: 'High Risk Alert Sent',
//         description: `An alert has been sent for high-risk customer: ${customer.name}`,
//         icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
//       });
//     } catch (error) {
//       console.error('Error sending alert:', error);
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'Approved': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
//       case 'Rejected': return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
//       default: return <ExclamationCircleOutlined style={{ color: '#1890ff' }} />;
//     }
//   };
  
//   const filteredCustomers = customers.filter(customer => 
//     statusFilter === 'all' || customer.status === statusFilter
//   );

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Approved': return 'green';
//       case 'Rejected': return 'red';
//       default: return 'blue';
//     }
//   };

//   const columns = [
//     {
//       title: 'Customer',
//       dataIndex: 'name',
//       key: 'name',
//       render: (name: string, record: CustomerWithRisk) => (
//         <span>
//           <UserOutlined /> {name} <br />
//           <small style={{ color: '#888' }}>{record.customerId}</small>
//         </span>
//       ),
//     },
//     {
//       title: 'Risk Score',
//       dataIndex: 'riskScore',
//       key: 'riskScore',
//       sorter: (a: CustomerWithRisk, b: CustomerWithRisk) => a.riskScore - b.riskScore,
//       render: (score: number) => (
//         <Tag color={score > 60 ? 'red' : score > 30 ? 'orange' : 'green'}>
//           {score.toFixed(1)}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Risk Category',
//       dataIndex: 'riskCategory',
//       key: 'riskCategory',
//       render: (category: string) => {
//         let color = 'green';
//         if (category === 'Medium Risk') color = 'orange';
//         if (category === 'High Risk') color = 'red';
//         return <Tag color={color}>{category}</Tag>;
//       },
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status: string) => (
//         <Tag color={getStatusColor(status)}>
//           {getStatusIcon(status)} {status}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_: any, record: CustomerWithRisk) => (
//         <Button 
//           type="primary" 
//           onClick={() => handleStatusChange(record)}
//         >
//           Update Status
//         </Button>
//       ),
//     },
//   ];

//   const highRiskCustomers = customers.filter(c => c.riskCategory === 'High Risk' && c.status !== 'Rejected');

//   return (
//     <div className="workflow-management">
//       <h1>Workflow Management</h1>
      
//       {/* High Risk Alerts */}
//       {highRiskCustomers.length > 0 && (
//         <Alert
//           message="High Risk Customer Alert"
//           description={`You have ${highRiskCustomers.length} high-risk customers that require attention.`}
//           type="warning"
//           showIcon
//           style={{ marginBottom: 20 }}
//         />
//       )}
      
//       {/* Status Filter */}
//       <Card style={{ marginBottom: 20 }}>
//         <Row align="middle">
//           <Col span={12}>
//             <h3>Customer Workflow</h3>
//           </Col>
//           <Col span={12} style={{ textAlign: 'right' }}>
//             <Space>
//               <span>Filter by status:</span>
//               <Select 
//                 defaultValue="all" 
//                 style={{ width: 150 }} 
//                 onChange={value => setStatusFilter(value)}
//               >
//                 <Option value="all">All Statuses</Option>
//                 <Option value="Review">Review</Option>
//                 <Option value="Approved">Approved</Option>
//                 <Option value="Rejected">Rejected</Option>
//               </Select>
//               <Button type="primary" onClick={fetchCustomers}>
//                 Refresh
//               </Button>
//             </Space>
//           </Col>
//         </Row>
//       </Card>
      
//       {/* Customer Table */}
//       <Card>
//         <Table 
//           dataSource={filteredCustomers} 
//           columns={columns} 
//           rowKey="customerId"
//           loading={loading}
//           pagination={{ pageSize: 10 }}
//         />
//       </Card>
      
//       {/* Status Update Modal */}
//       <Modal
//         title="Update Customer Status"
//         open={modalVisible}
//         onCancel={() => setModalVisible(false)}
//         footer={null}
//       >
//         <Form form={form} onFinish={handleUpdateStatus} layout="vertical">
//           <Form.Item
//             name="status"
//             label="Status"
//             rules={[{ required: true, message: 'Please select a status!' }]}
//           >
//             <Select>
//               <Option value="Review">Review</Option>
//               <Option value="Approved">Approved</Option>
//               <Option value="Rejected">Rejected</Option>
//             </Select>
//           </Form.Item>
          
//           <Form.Item name="notes" label="Notes">
//             <Input.TextArea rows={4} placeholder="Add any notes about this decision..." />
//           </Form.Item>
          
//           {selectedCustomer && selectedCustomer.riskScore > 70 && (
//             <Alert
//               message="High Risk Warning"
//               description="This customer has a high risk score. Please review carefully before approving."
//               type="warning"
//               showIcon
//               style={{ marginBottom: 16 }}
//             />
//           )}
          
//           <Form.Item>
//             <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
//               Update
//             </Button>
//             <Button onClick={() => setModalVisible(false)}>
//               Cancel
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default WorkflowManagement;

import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Select, Modal, Form, Input, notification, Card, Space, Row, Col, Alert, Typography, Drawer } from 'antd';
import { UserOutlined, ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, MenuOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';

const { Option } = Select;
const { Title } = Typography;

interface Customer {
  customerId: string;
  name: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  creditScore: number;
  outstandingLoans: number;
  loanRepaymentHistory: number[];
  accountBalance: number;
  status: 'Review' | 'Approved' | 'Rejected';
}

interface CustomerWithRisk extends Customer {
  riskScore: number;
  riskCategory: string;
}

const WorkflowManagement: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerWithRisk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithRisk | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [form] = Form.useForm();
  
  // Media query for responsive layout
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://kyc-2rov.onrender.com/api/customers');
      const customersWithRisk = response.data.map((customer: Customer) => ({
        ...customer,
        riskScore: calculateRiskScore(customer),
        riskCategory: getRiskCategory(calculateRiskScore(customer)),
      }));
      setCustomers(customersWithRisk);
    } catch (error) {
      console.error('Error fetching customers:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch customer data. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskScore = (customer: Customer): number => {
    const creditScoreWeight = 0.4;
    const repaymentHistoryWeight = 0.3;
    const debtToIncomeWeight = 0.3;
  
    const creditScoreFactor = Math.min(customer.creditScore / 850, 1) * 100;
    
    const repaymentRate = customer.loanRepaymentHistory.length > 0 
      ? (customer.loanRepaymentHistory.reduce((sum, val) => sum + val, 0) / 
         customer.loanRepaymentHistory.length * 100)
      : 0;
    
    const debtToIncomeRatio = customer.outstandingLoans / (customer.monthlyIncome * 12);
    const debtToIncomeFactor = Math.max(0, 100 - (debtToIncomeRatio * 100));
    
    const invertedCreditScore = 100 - creditScoreFactor;
    const invertedRepaymentRate = 100 - repaymentRate;
    
    return Math.min(Math.max(
      invertedCreditScore * creditScoreWeight +
      invertedRepaymentRate * repaymentHistoryWeight +
      debtToIncomeFactor * debtToIncomeWeight,
      0
    ), 100);
  };

  const getRiskCategory = (score: number): string => {
    if (score < 30) return 'Low Risk';
    if (score < 60) return 'Medium Risk';
    return 'High Risk';
  };

  const handleStatusChange = (customer: CustomerWithRisk) => {
    setSelectedCustomer(customer);
    form.setFieldsValue({
      status: customer.status,
      notes: '',
    });
    if (isMobile) {
      setDrawerVisible(true);
    } else {
      setModalVisible(true);
    }
  };

  const handleUpdateStatus = async (values: any) => {
    if (!selectedCustomer) return;
    
    try {
      const updatedCustomer = {
        ...selectedCustomer,
        status: values.status,
      };
      
      await axios.put(`https://kyc-2rov.onrender.com/api/customers/${selectedCustomer.customerId}`, updatedCustomer);
      
      // Update local state
      setCustomers(prevCustomers => 
        prevCustomers.map(c => 
          c.customerId === selectedCustomer.customerId 
            ? { ...c, status: values.status } 
            : c
        )
      );
      
      notification.success({
        message: 'Status Updated',
        description: `${selectedCustomer.name}'s status has been updated to ${values.status}.`,
      });

      // Check if we need to send an alert
      if (selectedCustomer.riskScore > 70 && values.status === 'Approved') {
        await sendAlert(selectedCustomer, values.notes);
      }
      
      setModalVisible(false);
      setDrawerVisible(false);
    } catch (error) {
      console.error('Error updating status:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update customer status. Please try again.',
      });
    }
  };

  const sendAlert = async (customer: CustomerWithRisk, notes: string) => {
    try {
      await axios.post('https://kyc-2rov.onrender.com/api/alerts', {
        customerId: customer.customerId,
        name: customer.name,
        riskScore: customer.riskScore,
        status: customer.status,
        notes: notes,
        timestamp: new Date().toISOString(),
      });
      
      notification.warning({
        message: 'High Risk Alert Sent',
        description: `An alert has been sent for high-risk customer: ${customer.name}`,
        icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    } catch (error) {
      console.error('Error sending alert:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'Rejected': return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      default: return <ExclamationCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };
  
  const filteredCustomers = customers.filter(customer => 
    statusFilter === 'all' || customer.status === statusFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'green';
      case 'Rejected': return 'red';
      default: return 'blue';
    }
  };

  // Desktop columns
  const desktopColumns = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: CustomerWithRisk) => (
        <span>
          <UserOutlined /> {name} <br />
          <small style={{ color: '#888' }}>{record.customerId}</small>
        </span>
      ),
    },
    {
      title: 'Risk Score',
      dataIndex: 'riskScore',
      key: 'riskScore',
      sorter: (a: CustomerWithRisk, b: CustomerWithRisk) => a.riskScore - b.riskScore,
      render: (score: number) => (
        <Tag color={score > 60 ? 'red' : score > 30 ? 'orange' : 'green'}>
          {score.toFixed(1)}
        </Tag>
      ),
    },
    {
      title: 'Risk Category',
      dataIndex: 'riskCategory',
      key: 'riskCategory',
      render: (category: string) => {
        let color = 'green';
        if (category === 'Medium Risk') color = 'orange';
        if (category === 'High Risk') color = 'red';
        return <Tag color={color}>{category}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusIcon(status)} {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: CustomerWithRisk) => (
        <Button 
          type="primary" 
          onClick={() => handleStatusChange(record)}
        >
          Update Status
        </Button>
      ),
    },
  ];

  // Mobile columns (simplified)
  const mobileColumns = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <span>
          <UserOutlined /> {name}
        </span>
      ),
    },
    {
      title: 'Risk',
      dataIndex: 'riskCategory',
      key: 'riskCategory',
      render: (category: string) => {
        let color = 'green';
        if (category === 'Medium Risk') color = 'orange';
        if (category === 'High Risk') color = 'red';
        return <Tag color={color}>{category.split(' ')[0]}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusIcon(status)}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      render: (_: any, record: CustomerWithRisk) => (
        <Button 
          type="primary"
          size="small"
          icon={<MenuOutlined />}
          onClick={() => handleStatusChange(record)}
        />
      ),
    },
  ];

  // Expandable row for mobile view
  const expandableConfig = isMobile ? {
    expandedRowRender: (record: CustomerWithRisk) => (
      <div style={{ padding: '10px 0' }}>
        <p><strong>Customer ID:</strong> {record.customerId}</p>
        <p><strong>Risk Score:</strong> {record.riskScore.toFixed(1)}</p>
        <Space>
          <Button 
            type="primary" 
            onClick={() => handleStatusChange(record)}
          >
            Update Status
          </Button>
        </Space>
      </div>
    )
  } : {};

  const highRiskCustomers = customers.filter(c => c.riskCategory === 'High Risk' && c.status !== 'Rejected');

  // Render status form (used in both modal and drawer)
  const renderStatusForm = () => (
    <Form form={form} onFinish={handleUpdateStatus} layout="vertical">
      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select a status!' }]}
      >
        <Select>
          <Option value="Review">Review</Option>
          <Option value="Approved">Approved</Option>
          <Option value="Rejected">Rejected</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="notes" label="Notes">
        <Input.TextArea rows={4} placeholder="Add any notes about this decision..." />
      </Form.Item>
      
      {selectedCustomer && selectedCustomer.riskScore > 70 && (
        <Alert
          message="High Risk Warning"
          description="This customer has a high risk score. Please review carefully before approving."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
          Update
        </Button>
        <Button onClick={() => {
          setModalVisible(false);
          setDrawerVisible(false);
        }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div className="workflow-management" style={{ padding: isMobile ? '8px' : '24px' }}>
      <Title level={isMobile ? 3 : 1}>Workflow Management</Title>
      
      {/* High Risk Alerts */}
      {highRiskCustomers.length > 0 && (
        <Alert
          message="High Risk Customer Alert"
          description={`You have ${highRiskCustomers.length} high-risk customers that require attention.`}
          type="warning"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}
      
      {/* Status Filter */}
      <Card style={{ marginBottom: 20 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <h3>Customer Workflow</h3>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: isMobile ? 'left' : 'right' }}>
            <Space direction={isMobile ? 'vertical' : 'horizontal'} style={{ width: isMobile ? '100%' : 'auto' }}>
              <span>Filter by status:</span>
              <Select 
                defaultValue="all" 
                style={{ width: isMobile ? '100%' : 150 }} 
                onChange={value => setStatusFilter(value)}
              >
                <Option value="all">All Statuses</Option>
                <Option value="Review">Review</Option>
                <Option value="Approved">Approved</Option>
                <Option value="Rejected">Rejected</Option>
              </Select>
              <Button type="primary" onClick={fetchCustomers} style={{ width: isMobile ? '100%' : 'auto' }}>
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
      
      {/* Customer Table */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <Table 
            dataSource={filteredCustomers} 
            columns={isMobile ? mobileColumns : desktopColumns} 
            rowKey="customerId"
            loading={loading}
            pagination={{ pageSize: isMobile ? 5 : 10 }}
            expandable={isMobile ? expandableConfig : {}}
            scroll={isMobile ? undefined : { x: 'max-content' }}
          />
        </div>
      </Card>
      
      {/* Status Update Modal (desktop) */}
      <Modal
        title="Update Customer Status"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {renderStatusForm()}
      </Modal>

      {/* Status Update Drawer (mobile) */}
      <Drawer
        title="Update Customer Status"
        placement="bottom"
        height="auto"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {renderStatusForm()}
      </Drawer>
    </div>
  );
};

export default WorkflowManagement;