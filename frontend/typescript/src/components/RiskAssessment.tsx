// import React, { useEffect, useState } from 'react';
// import { Row, Col, Card, Progress, Statistic, Table, Tag, Select, Input, Space } from 'antd';
// import { WarningOutlined, CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
// import type { ColumnsType } from 'antd/es/table';
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
//   debtToIncomeRatio: number;
//   repaymentRate: number;
// }

// const RiskAssessment: React.FC = () => {
//   const [customers, setCustomers] = useState<CustomerWithRisk[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [filter, setFilter] = useState<string>('all');
//   const [searchText, setSearchText] = useState<string>('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('https://kyc-2rov.onrender.com/api/customers');
//         const customersWithRisk = response.data.map((customer: Customer) => {
//           // Add check for empty loanRepaymentHistory to prevent division by zero
//           const repaymentRate = customer.loanRepaymentHistory.length > 0 
//             ? (customer.loanRepaymentHistory.reduce((sum, val) => sum + val, 0) / 
//                customer.loanRepaymentHistory.length * 100)
//             : 0;
            
//           const debtToIncomeRatio = customer.outstandingLoans / (customer.monthlyIncome * 12);
//           const riskScore = calculateRiskScore(customer);
          
//           return {
//             ...customer,
//             riskScore,
//             riskCategory: getRiskCategory(riskScore),
//             debtToIncomeRatio,
//             repaymentRate
//           };
//         });
//         setCustomers(customersWithRisk);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const calculateRiskScore = (customer: Customer): number => {
//     const creditScoreWeight = 0.4;
//     const repaymentHistoryWeight = 0.3;
//     const debtToIncomeWeight = 0.3;
  
//     const creditScoreFactor = Math.min(customer.creditScore / 850, 1) * 100;
    
//     // Add check for empty loanRepaymentHistory to prevent division by zero
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

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Approved': return 'green';
//       case 'Rejected': return 'red';
//       default: return 'blue';
//     }
//   };

//   const filteredCustomers = customers.filter(customer => {
//     const matchesFilter = filter === 'all' || customer.riskCategory === filter;
//     const matchesSearch = customer.name.toLowerCase().includes(searchText.toLowerCase()) || 
//                          customer.customerId.toLowerCase().includes(searchText.toLowerCase());
//     return matchesFilter && matchesSearch;
//   });

//   const highRiskCount = customers.filter(c => c.riskCategory === 'High Risk').length;
//   const mediumRiskCount = customers.filter(c => c.riskCategory === 'Medium Risk').length;
//   const lowRiskCount = customers.filter(c => c.riskCategory === 'Low Risk').length;

//   // Remove commented out columns definition
//   const columns: ColumnsType<CustomerWithRisk> = [
//     {
//       title: 'Customer',
//       dataIndex: 'name',
//       key: 'name',
//       render: (name: string, record: CustomerWithRisk) => (
//         <span>
//           {name} <br />
//           <small style={{ color: '#888' }}>{record.customerId}</small>
//         </span>
//       ),
//     },
//     {
//       title: 'Risk Score',
//       dataIndex: 'riskScore',
//       key: 'riskScore',
//       sorter: (a, b) => a.riskScore - b.riskScore,
//       render: (score: number) => (
//         <Progress 
//           percent={Math.round(score)} 
//           size="small" 
//           status={score > 60 ? "exception" : score > 30 ? "normal" : "success"} 
//           strokeColor={score > 60 ? "#f5222d" : score > 30 ? "#faad14" : "#52c41a"}
//         />
//       ),
//     },
//     {
//       title: 'Credit Score',
//       dataIndex: 'creditScore',
//       key: 'creditScore',
//       sorter: (a, b) => a.creditScore - b.creditScore,
//     },
//     {
//       title: 'Debt-to-Income',
//       dataIndex: 'debtToIncomeRatio',
//       key: 'debtToIncomeRatio',
//       render: (ratio: number) => `${(ratio * 100).toFixed(1)}%`,
//       sorter: (a, b) => a.debtToIncomeRatio - b.debtToIncomeRatio,
//     },
//     {
//       title: 'Repayment Rate',
//       dataIndex: 'repaymentRate',
//       key: 'repaymentRate',
//       render: (rate: number) => `${rate.toFixed(0)}%`,
//       sorter: (a, b) => a.repaymentRate - b.repaymentRate,
//     },
//     {
//       title: 'Risk Category',
//       dataIndex: 'riskCategory',
//       key: 'riskCategory',
//       filters: [
//         { text: 'High Risk', value: 'High Risk' },
//         { text: 'Medium Risk', value: 'Medium Risk' },
//         { text: 'Low Risk', value: 'Low Risk' },
//       ],
//       onFilter: (value, record) => record.riskCategory === value,
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
//         <Tag color={getStatusColor(status)}>{status}</Tag>
//       ),
//     },
//   ];

//   return (
//     <div className="risk-assessment">
//       <h1>Risk Assessment</h1>
      
//       {/* Risk Summary Cards */}
//       <Row gutter={16} className="risk-summary">
//         <Col span={8}>
//           <Card>
//             <Statistic
//               title="High Risk Customers"
//               value={highRiskCount}
//               valueStyle={{ color: '#cf1322' }}
//               prefix={<WarningOutlined />}
//               suffix={`/ ${customers.length}`}
//             />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card>
//             <Statistic
//               title="Medium Risk Customers"
//               value={mediumRiskCount}
//               valueStyle={{ color: '#faad14' }}
//               prefix={<WarningOutlined />}
//               suffix={`/ ${customers.length}`}
//             />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card>
//             <Statistic
//               title="Low Risk Customers"
//               value={lowRiskCount}
//               valueStyle={{ color: '#3f8600' }}
//               prefix={<CheckCircleOutlined />}
//               suffix={`/ ${customers.length}`}
//             />
//           </Card>
//         </Col>
//       </Row>
      
//       {/* Filter Controls */}
//       <Card style={{ marginTop: 20 }}>
//         <Space>
//           <Select 
//             defaultValue="all" 
//             style={{ width: 150 }} 
//             onChange={value => setFilter(value)}
//           >
//             <Option value="all">All Customers</Option>
//             <Option value="High Risk">High Risk</Option>
//             <Option value="Medium Risk">Medium Risk</Option>
//             <Option value="Low Risk">Low Risk</Option>
//           </Select>
          
//           <Input
//             placeholder="Search by name or ID"
//             prefix={<SearchOutlined />}
//             value={searchText}
//             onChange={e => setSearchText(e.target.value)}
//             style={{ width: 250 }}
//           />
//         </Space>
//       </Card>
      
//       {/* Customer Risk Table */}
//       <Card title="Customer Risk Analysis" style={{ marginTop: 20 }}>
//         <Table 
//           dataSource={filteredCustomers} 
//           columns={columns} 
//           rowKey="customerId"
//           loading={loading}
//           pagination={{ pageSize: 10 }}
//         />
//       </Card>
//     </div>
//   );
// };

// export default RiskAssessment;

import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Progress, Statistic, Table, Tag, Select, Input, Space, Typography } from 'antd';
import { WarningOutlined, CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
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
  debtToIncomeRatio: number;
  repaymentRate: number;
}

const RiskAssessment: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerWithRisk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
  
  // Media query for responsive layout
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://kyc-2rov.onrender.com/api/customers');
        const customersWithRisk = response.data.map((customer: Customer) => {
          // Add check for empty loanRepaymentHistory to prevent division by zero
          const repaymentRate = customer.loanRepaymentHistory.length > 0 
            ? (customer.loanRepaymentHistory.reduce((sum, val) => sum + val, 0) / 
               customer.loanRepaymentHistory.length * 100)
            : 0;
            
          const debtToIncomeRatio = customer.outstandingLoans / (customer.monthlyIncome * 12);
          const riskScore = calculateRiskScore(customer);
          
          return {
            ...customer,
            riskScore,
            riskCategory: getRiskCategory(riskScore),
            debtToIncomeRatio,
            repaymentRate
          };
        });
        setCustomers(customersWithRisk);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateRiskScore = (customer: Customer): number => {
    const creditScoreWeight = 0.4;
    const repaymentHistoryWeight = 0.3;
    const debtToIncomeWeight = 0.3;
  
    const creditScoreFactor = Math.min(customer.creditScore / 850, 1) * 100;
    
    // Add check for empty loanRepaymentHistory to prevent division by zero
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'green';
      case 'Rejected': return 'red';
      default: return 'blue';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesFilter = filter === 'all' || customer.riskCategory === filter;
    const matchesSearch = customer.name.toLowerCase().includes(searchText.toLowerCase()) || 
                         customer.customerId.toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const highRiskCount = customers.filter(c => c.riskCategory === 'High Risk').length;
  const mediumRiskCount = customers.filter(c => c.riskCategory === 'Medium Risk').length;
  const lowRiskCount = customers.filter(c => c.riskCategory === 'Low Risk').length;

  // Define columns based on screen size
  const desktopColumns: ColumnsType<CustomerWithRisk> = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: CustomerWithRisk) => (
        <span>
          {name} <br />
          <small style={{ color: '#888' }}>{record.customerId}</small>
        </span>
      ),
    },
    {
      title: 'Risk Score',
      dataIndex: 'riskScore',
      key: 'riskScore',
      sorter: (a, b) => a.riskScore - b.riskScore,
      render: (score: number) => (
        <Progress 
          percent={Math.round(score)} 
          size="small" 
          status={score > 60 ? "exception" : score > 30 ? "normal" : "success"} 
          strokeColor={score > 60 ? "#f5222d" : score > 30 ? "#faad14" : "#52c41a"}
        />
      ),
    },
    {
      title: 'Credit Score',
      dataIndex: 'creditScore',
      key: 'creditScore',
      sorter: (a, b) => a.creditScore - b.creditScore,
    },
    {
      title: 'Debt-to-Income',
      dataIndex: 'debtToIncomeRatio',
      key: 'debtToIncomeRatio',
      render: (ratio: number) => `${(ratio * 100).toFixed(1)}%`,
      sorter: (a, b) => a.debtToIncomeRatio - b.debtToIncomeRatio,
    },
    {
      title: 'Repayment Rate',
      dataIndex: 'repaymentRate',
      key: 'repaymentRate',
      render: (rate: number) => `${rate.toFixed(0)}%`,
      sorter: (a, b) => a.repaymentRate - b.repaymentRate,
    },
    {
      title: 'Risk Category',
      dataIndex: 'riskCategory',
      key: 'riskCategory',
      filters: [
        { text: 'High Risk', value: 'High Risk' },
        { text: 'Medium Risk', value: 'Medium Risk' },
        { text: 'Low Risk', value: 'Low Risk' },
      ],
      onFilter: (value, record) => record.riskCategory === value,
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
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
  ];

  // Simplified mobile columns
  const mobileColumns: ColumnsType<CustomerWithRisk> = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: CustomerWithRisk) => (
        <span>
          {name} <br />
          <small style={{ color: '#888' }}>{record.customerId}</small>
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
        return <Tag color={color}>{category}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
  ];

  // Create expandable row config for mobile view
  const expandableConfig = isMobile ? {
    expandedRowRender: (record: CustomerWithRisk) => (
      <div style={{ padding: '12px 0' }}>
        <p><strong>Risk Score:</strong> <Progress 
            percent={Math.round(record.riskScore)} 
            size="small" 
            status={record.riskScore > 60 ? "exception" : record.riskScore > 30 ? "normal" : "success"} 
            strokeColor={record.riskScore > 60 ? "#f5222d" : record.riskScore > 30 ? "#faad14" : "#52c41a"}
          />
        </p>
        <p><strong>Credit Score:</strong> {record.creditScore}</p>
        <p><strong>Debt-to-Income:</strong> {(record.debtToIncomeRatio * 100).toFixed(1)}%</p>
        <p><strong>Repayment Rate:</strong> {record.repaymentRate.toFixed(0)}%</p>
      </div>
    )
  } : {};

  return (
    <div className="risk-assessment" style={{ padding: isMobile ? '8px' : '24px' }}>
      <Title level={isMobile ? 3 : 1}>Risk Assessment</Title>
      
      {/* Risk Summary Cards */}
      <Row gutter={[16, 16]} className="risk-summary">
        <Col xs={24} sm={24} md={8}>
          <Card>
            <Statistic
              title="High Risk Customers"
              value={highRiskCount}
              valueStyle={{ color: '#cf1322' }}
              prefix={<WarningOutlined />}
              suffix={`/ ${customers.length}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card>
            <Statistic
              title="Medium Risk Customers"
              value={mediumRiskCount}
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
              suffix={`/ ${customers.length}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card>
            <Statistic
              title="Low Risk Customers"
              value={lowRiskCount}
              valueStyle={{ color: '#3f8600' }}
              prefix={<CheckCircleOutlined />}
              suffix={`/ ${customers.length}`}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Filter Controls */}
      <Card style={{ marginTop: 20 }}>
        <Space direction={isMobile ? 'vertical' : 'horizontal'} style={{ width: '100%' }}>
          <Select 
            defaultValue="all" 
            style={{ width: isMobile ? '100%' : 150 }} 
            onChange={value => setFilter(value)}
          >
            <Option value="all">All Customers</Option>
            <Option value="High Risk">High Risk</Option>
            <Option value="Medium Risk">Medium Risk</Option>
            <Option value="Low Risk">Low Risk</Option>
          </Select>
          
          <Input
            placeholder="Search by name or ID"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: isMobile ? '100%' : 250 }}
          />
        </Space>
      </Card>
      
      {/* Customer Risk Table */}
      <Card title="Customer Risk Analysis" style={{ marginTop: 20, overflowX: 'auto' }}>
        <Table 
          dataSource={filteredCustomers} 
          columns={isMobile ? mobileColumns : desktopColumns} 
          rowKey="customerId"
          loading={loading}
          pagination={{ pageSize: isMobile ? 5 : 10 }}
          expandable={isMobile ? expandableConfig : {}}
          scroll={isMobile ? undefined : { x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default RiskAssessment;