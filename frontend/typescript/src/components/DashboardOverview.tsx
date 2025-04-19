// import React, { useEffect, useState } from 'react';
// import { Row, Col, Card, Statistic, Table, Tag, Progress, Typography } from 'antd';
// import { ArrowUpOutlined } from '@ant-design/icons';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// import axios from 'axios';
// import { useMediaQuery } from 'react-responsive';

// const { Title } = Typography;

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

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// const DashboardOverview: React.FC = () => {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
  
//   // Media queries for responsive design
//   const isDesktopOrLaptop = useMediaQuery({ minWidth: 992 });
//   const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
//   const isMobile = useMediaQuery({ maxWidth: 767 });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('https://kyc-2rov.onrender.com/api/customers');
//         setCustomers(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Calculate key metrics
//   const totalCustomers = customers.length;
//   const totalIncome = customers.reduce((sum, customer) => sum + customer.monthlyIncome, 0);
//   const totalExpenses = customers.reduce((sum, customer) => sum + customer.monthlyExpenses, 0);
//   const averageCreditScore = totalCustomers > 0 ? 
//     customers.reduce((sum, customer) => sum + customer.creditScore, 0) / totalCustomers : 0;

//   // Generate financial data for line chart
//   const financialData = customers.map(customer => ({
//     name: customer.name,
//     income: customer.monthlyIncome,
//     expenses: customer.monthlyExpenses,
//     balance: customer.accountBalance
//   }));

//   // Generate risk distribution data for pie chart
//   const calculateRiskScore = (customer: Customer): number => {
//     const creditScoreWeight = 0.4;
//     const repaymentHistoryWeight = 0.3;
//     const debtToIncomeWeight = 0.3;
  
//     // Ensure these are numbers
//     const creditScoreFactor = Math.min((customer.creditScore || 0) / 850, 1) * 100;
    
//     const repaymentRate = customer.loanRepaymentHistory.length > 0 ?
//       customer.loanRepaymentHistory.reduce((sum, val) => Number(sum) + Number(val), 0) / 
//       customer.loanRepaymentHistory.length * 100 : 0;
    
//     const debtToIncomeRatio = Number(customer.outstandingLoans) / Math.max(Number(customer.monthlyIncome) * 12, 1);
//     const debtToIncomeFactor = Math.max(0, 100 - (debtToIncomeRatio * 100));
    
//     const invertedCreditScore = 100 - creditScoreFactor;
//     const invertedRepaymentRate = 100 - repaymentRate;
    
//     return Math.min(Math.max(
//       Number(invertedCreditScore) * creditScoreWeight +
//       Number(invertedRepaymentRate) * repaymentHistoryWeight +
//       Number(debtToIncomeFactor) * debtToIncomeWeight,
//       0
//     ), 100);
//   };

//   const getRiskCategory = (score: number): string => {
//     if (score < 30) return 'Low Risk';
//     if (score < 60) return 'Medium Risk';
//     return 'High Risk';
//   };

//   const customersWithRisk = customers.map(customer => ({
//     ...customer,
//     riskScore: calculateRiskScore(customer),
//     riskCategory: getRiskCategory(calculateRiskScore(customer))
//   }));

//   const riskDistribution = [
//     { name: 'Low Risk', value: customersWithRisk.filter(c => c.riskCategory === 'Low Risk').length },
//     { name: 'Medium Risk', value: customersWithRisk.filter(c => c.riskCategory === 'Medium Risk').length },
//     { name: 'High Risk', value: customersWithRisk.filter(c => c.riskCategory === 'High Risk').length },
//   ];

//   // Define table columns based on screen size
//   const getColumns = () => {
//     const baseColumns = [
//       {
//         title: 'Name',
//         dataIndex: 'name',
//         key: 'name',
//         sorter: (a: any, b: any) => a.name.localeCompare(b.name),
//       },
//       {
//         title: 'Risk Category',
//         dataIndex: 'riskCategory',
//         key: 'riskCategory',
//         render: (category: string) => {
//           let color = 'green';
//           if (category === 'Medium Risk') color = 'orange';
//           if (category === 'High Risk') color = 'red';
//           return <Tag color={color}>{category}</Tag>;
//         },
//         filters: [
//           { text: 'Low Risk', value: 'Low Risk' },
//           { text: 'Medium Risk', value: 'Medium Risk' },
//           { text: 'High Risk', value: 'High Risk' },
//         ],
//         onFilter: (value: any, record: any) => record.riskCategory === value,
//       },
//       {
//         title: 'Status',
//         dataIndex: 'status',
//         key: 'status',
//         render: (status: string) => {
//           let color = 'blue';
//           if (status === 'Approved') color = 'green';
//           if (status === 'Rejected') color = 'red';
//           return <Tag color={color}>{status}</Tag>;
//         },
//         filters: [
//           { text: 'Review', value: 'Review' },
//           { text: 'Approved', value: 'Approved' },
//           { text: 'Rejected', value: 'Rejected' },
//         ],
//         onFilter: (value: any, record: any) => record.status === value,
//       }
//     ];

//     if (isDesktopOrLaptop) {
//       return [
//         {
//           title: 'Customer ID',
//           dataIndex: 'customerId',
//           key: 'customerId',
//         },
//         ...baseColumns,
//         {
//           title: 'Monthly Income',
//           dataIndex: 'monthlyIncome',
//           key: 'monthlyIncome',
//           render: (income: number) => `$${income.toLocaleString()}`,
//           sorter: (a: any, b: any) => a.monthlyIncome - b.monthlyIncome,
//         },
//         {
//           title: 'Credit Score',
//           dataIndex: 'creditScore',
//           key: 'creditScore',
//           sorter: (a: any, b: any) => a.creditScore - b.creditScore,
//         },
//         {
//           title: 'Risk Score',
//           dataIndex: 'riskScore',
//           key: 'riskScore',
//           render: (score: number) => (
//             <Progress 
//               percent={Math.round(score)} 
//               size="small" 
//               status={score > 60 ? "exception" : score > 30 ? "normal" : "success"} 
//               strokeColor={score > 60 ? "#f5222d" : score > 30 ? "#faad14" : "#52c41a"}
//             />
//           ),
//           sorter: (a: any, b: any) => a.riskScore - b.riskScore,
//         }
//       ];
//     } else if (isTablet) {
//       return [
//         ...baseColumns,
//         {
//           title: 'Monthly Income',
//           dataIndex: 'monthlyIncome',
//           key: 'monthlyIncome',
//           render: (income: number) => `$${income.toLocaleString()}`,
//           sorter: (a: any, b: any) => a.monthlyIncome - b.monthlyIncome,
//         },
//         {
//           title: 'Risk Score',
//           dataIndex: 'riskScore',
//           key: 'riskScore',
//           render: (score: number) => (
//             <Progress 
//               percent={Math.round(score)} 
//               size="small" 
//               status={score > 60 ? "exception" : score > 30 ? "normal" : "success"} 
//               strokeColor={score > 60 ? "#f5222d" : score > 30 ? "#faad14" : "#52c41a"}
//             />
//           ),
//           sorter: (a: any, b: any) => a.riskScore - b.riskScore,
//         }
//       ];
//     } else {
//       // Mobile view with minimal columns
//       return baseColumns;
//     }
//   };

//   // Get grid spans based on screen size
//   const getStatCardSpan = () => {
//     if (isMobile) return 24;
//     if (isTablet) return 12;
//     return 6;
//   };

//   const getChartSpan = () => {
//     if (isMobile) return 24;
//     if (isTablet) return 24;
//     return 14;
//   };

//   const getPieChartSpan = () => {
//     if (isMobile) return 24;
//     if (isTablet) return 24;
//     return 10;
//   };

//   return (
//     <div className="dashboard-overview" style={{ padding: isMobile ? '10px' : '20px' }}>
//       <Title level={isMobile ? 3 : 1}>Financial Dashboard</Title>
      
//       {/* Key Metrics */}
//       <Row gutter={[16, 16]} className="metric-cards">
//         <Col span={getStatCardSpan()}>
//           <Card size={isMobile ? "small" : "default"}>
//             <Statistic
//               title="Total Customers"
//               value={totalCustomers}
//               precision={0}
//               valueStyle={{ color: '#3f8600' }}
//               prefix={<ArrowUpOutlined />}
//             />
//           </Card>
//         </Col>
//         <Col span={getStatCardSpan()}>
//           <Card size={isMobile ? "small" : "default"}>
//             <Statistic
//               title="Total Monthly Income"
//               value={totalIncome}
//               precision={0}
//               valueStyle={{ color: '#3f8600' }}
//               prefix="$"
//               suffix=""
//             />
//           </Card>
//         </Col>
//         <Col span={getStatCardSpan()}>
//           <Card size={isMobile ? "small" : "default"}>
//             <Statistic
//               title="Total Monthly Expenses"
//               value={totalExpenses}
//               precision={0}
//               valueStyle={{ color: '#cf1322' }}
//               prefix="$"
//               suffix=""
//             />
//           </Card>
//         </Col>
//         <Col span={getStatCardSpan()}>
//           <Card size={isMobile ? "small" : "default"}>
//             <Statistic
//               title="Average Credit Score"
//               value={averageCreditScore.toFixed(0)}
//               precision={0}
//               valueStyle={{ color: '#1890ff' }}
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* Charts */}
//       <Row gutter={[16, 16]} className="charts-container" style={{ marginTop: 20 }}>
//         <Col span={getChartSpan()}>
//           <Card title="Income vs Expenses" size={isMobile ? "small" : "default"}>
//             <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
//               <LineChart data={financialData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis 
//                   dataKey="name" 
//                   tick={{ fontSize: isMobile ? 10 : 12 }}
//                   height={isMobile ? 30 : 50}
//                   angle={isMobile ? -45 : 0}
//                   textAnchor={isMobile ? "end" : "middle"}
//                 />
//                 <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
//                 <Tooltip formatter={(value) => `$${value}`} />
//                 <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
//                 <Line type="monotone" dataKey="income" stroke="#52c41a" activeDot={{ r: isMobile ? 4 : 8 }} />
//                 <Line type="monotone" dataKey="expenses" stroke="#f5222d" />
//               </LineChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>
//         <Col span={getPieChartSpan()}>
//           <Card title="Risk Distribution" size={isMobile ? "small" : "default"}>
//             <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
//               <PieChart>
//                 <Pie
//                   data={riskDistribution}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={!isMobile}
//                   outerRadius={isMobile ? 60 : 80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={isMobile ? undefined : ({ name, percent }: { name: string, percent: number }) => 
//                     `${name}: ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {riskDistribution.map((_, index) => (
//   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
//               </PieChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>
//       </Row>

//       {/* Customer Data Table */}
//       <Card 
//         title="Customer Data" 
//         style={{ marginTop: 20 }}
//         size={isMobile ? "small" : "default"}
//       >
//         <Table 
//           dataSource={customersWithRisk} 
//           columns={getColumns()}
//           rowKey="customerId"
//           loading={loading}
//           pagination={{ 
//             pageSize: isMobile ? 5 : 10,
//             simple: isMobile 
//           }}
//           scroll={{ x: isMobile ? 300 : 'max-content' }}
//           size={isMobile ? "small" : "middle"}
//         />
//       </Card>
//     </div>
//   );
// };

// export default DashboardOverview;


import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Progress, Typography, Skeleton } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';

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

interface Props {
  darkMode: boolean;
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardOverview: React.FC <Props>= ({ darkMode }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Media queries for responsive design
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Add loading state for charts
  const [chartsLoading, setChartsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://kyc-2rov.onrender.com/api/customers');
        setCustomers(response.data);
        setLoading(false);
        // Set charts loading to false after a short delay to ensure proper rendering
        setTimeout(() => setChartsLoading(false), 500);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        setChartsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate key metrics
  const totalCustomers = customers.length;
  const totalIncome = customers.reduce((sum, customer) => sum + customer.monthlyIncome, 0);
  const totalExpenses = customers.reduce((sum, customer) => sum + customer.monthlyExpenses, 0);
  const averageCreditScore = totalCustomers > 0 ? 
    customers.reduce((sum, customer) => sum + customer.creditScore, 0) / totalCustomers : 0;

  // Generate financial data for line chart
  const financialData = customers.slice(0, isMobile ? 5 : 10).map(customer => ({
    name: customer.name.split(' ')[0], // Use first name only for mobile to save space
    income: customer.monthlyIncome,
    expenses: customer.monthlyExpenses,
    balance: customer.accountBalance
  }));

  // Calculate risk score function
  const calculateRiskScore = (customer: Customer): number => {
    const creditScoreWeight = 0.4;
    const repaymentHistoryWeight = 0.3;
    const debtToIncomeWeight = 0.3;
  
    // Ensure these are numbers
    const creditScoreFactor = Math.min((customer.creditScore || 0) / 850, 1) * 100;
    
    const repaymentRate = customer.loanRepaymentHistory.length > 0 ?
      customer.loanRepaymentHistory.reduce((sum, val) => Number(sum) + Number(val), 0) / 
      customer.loanRepaymentHistory.length * 100 : 0;
    
    const debtToIncomeRatio = Number(customer.outstandingLoans) / Math.max(Number(customer.monthlyIncome) * 12, 1);
    const debtToIncomeFactor = Math.max(0, 100 - (debtToIncomeRatio * 100));
    
    const invertedCreditScore = 100 - creditScoreFactor;
    const invertedRepaymentRate = 100 - repaymentRate;
    
    return Math.min(Math.max(
      Number(invertedCreditScore) * creditScoreWeight +
      Number(invertedRepaymentRate) * repaymentHistoryWeight +
      Number(debtToIncomeFactor) * debtToIncomeWeight,
      0
    ), 100);
  };

  const getRiskCategory = (score: number): string => {
    if (score < 30) return 'Low Risk';
    if (score < 60) return 'Medium Risk';
    return 'High Risk';
  };

  const customersWithRisk = customers.map(customer => ({
    ...customer,
    riskScore: calculateRiskScore(customer),
    riskCategory: getRiskCategory(calculateRiskScore(customer))
  }));

  const riskDistribution = [
    { name: 'Low Risk', value: customersWithRisk.filter(c => c.riskCategory === 'Low Risk').length },
    { name: 'Medium Risk', value: customersWithRisk.filter(c => c.riskCategory === 'Medium Risk').length },
    { name: 'High Risk', value: customersWithRisk.filter(c => c.riskCategory === 'High Risk').length },
  ];

  // Define table columns based on screen size
  const getColumns = () => {
    const baseColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
        render: (text: string) => isMobile ? text.split(' ')[0] : text, // Show only first name on mobile
      },
      {
        title: 'Risk',
        dataIndex: 'riskCategory',
        key: 'riskCategory',
        render: (category: string) => {
          let color = 'green';
          if (category === 'Medium Risk') color = 'orange';
          if (category === 'High Risk') color = 'red';
          return <Tag color={color}>{isMobile ? category.split(' ')[0] : category}</Tag>; // Show only "Low", "Medium", "High" on mobile
        },
        filters: [
          { text: 'Low Risk', value: 'Low Risk' },
          { text: 'Medium Risk', value: 'Medium Risk' },
          { text: 'High Risk', value: 'High Risk' },
        ],
        onFilter: (value: any, record: any) => record.riskCategory === value,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
          let color = 'blue';
          if (status === 'Approved') color = 'green';
          if (status === 'Rejected') color = 'red';
          return <Tag color={color}>{status}</Tag>;
        },
        filters: [
          { text: 'Review', value: 'Review' },
          { text: 'Approved', value: 'Approved' },
          { text: 'Rejected', value: 'Rejected' },
        ],
        onFilter: (value: any, record: any) => record.status === value,
      }
    ];

    if (isDesktopOrLaptop) {
      return [
        {
          title: 'ID',
          dataIndex: 'customerId',
          key: 'customerId',
        },
        ...baseColumns,
        {
          title: 'Monthly Income',
          dataIndex: 'monthlyIncome',
          key: 'monthlyIncome',
          render: (income: number) => `$${income.toLocaleString()}`,
          sorter: (a: any, b: any) => a.monthlyIncome - b.monthlyIncome,
        },
        {
          title: 'Credit Score',
          dataIndex: 'creditScore',
          key: 'creditScore',
          sorter: (a: any, b: any) => a.creditScore - b.creditScore,
        },
        {
          title: 'Risk Score',
          dataIndex: 'riskScore',
          key: 'riskScore',
          render: (score: number) => (
            <Progress 
              percent={Math.round(score)} 
              size="small" 
              status={score > 60 ? "exception" : score > 30 ? "normal" : "success"} 
              strokeColor={score > 60 ? "#f5222d" : score > 30 ? "#faad14" : "#52c41a"}
            />
          ),
          sorter: (a: any, b: any) => a.riskScore - b.riskScore,
        }
      ];
    } else if (isTablet) {
      return [
        ...baseColumns,
        {
          title: 'Income',
          dataIndex: 'monthlyIncome',
          key: 'monthlyIncome',
          render: (income: number) => `$${income.toLocaleString()}`,
          sorter: (a: any, b: any) => a.monthlyIncome - b.monthlyIncome,
        },
        {
          title: 'Risk Score',
          dataIndex: 'riskScore',
          key: 'riskScore',
          render: (score: number) => (
            <Progress 
              percent={Math.round(score)} 
              size="small" 
              status={score > 60 ? "exception" : score > 30 ? "normal" : "success"} 
              strokeColor={score > 60 ? "#f5222d" : score > 30 ? "#faad14" : "#52c41a"}
            />
          ),
          sorter: (a: any, b: any) => a.riskScore - b.riskScore,
        }
      ];
    } else {
      // Mobile view with minimal columns
      return baseColumns;
    }
  };

  // Get grid spans based on screen size
  const getStatCardSpan = () => {
    if (isMobile) return 12;
    if (isTablet) return 12;
    return 6;
  };

  const getChartSpan = () => {
    if (isMobile) return 24;
    if (isTablet) return 24;
    return 14;
  };

  const getPieChartSpan = () => {
    if (isMobile) return 24;
    if (isTablet) return 24;
    return 10;
  };

  return (
    <div
  className={`dashboard-overview ${darkMode ? 'bg-[#1e1e2f] text-white' : 'bg-white text-black'}`}
  style={{ padding: isMobile ? '10px' : '20px' }}
>

      <Title level={isMobile ? 4 : isTablet ? 3 : 2} style={{ marginBottom: isMobile ? '12px' : '24px' }}>Financial Dashboard</Title>
      
      {/* Key Metrics */}
      <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]} className="metric-cards">
        <Col span={getStatCardSpan()}>
          <Card size="small" bodyStyle={{ padding: isMobile ? '12px 8px' : '24px 16px' }}>
            <Statistic
              title={<span style={{ fontSize: isMobile ? '12px' : '14px' }}>Customers</span>}
              value={totalCustomers}
              precision={0}
              valueStyle={{ color: '#3f8600', fontSize: isMobile ? '16px' : '20px' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={getStatCardSpan()}>
          <Card size="small" bodyStyle={{ padding: isMobile ? '12px 8px' : '24px 16px' }}>
            <Statistic
              title={<span style={{ fontSize: isMobile ? '12px' : '14px' }}>Monthly Income</span>}
              value={totalIncome}
              precision={0}
              valueStyle={{ color: '#3f8600', fontSize: isMobile ? '16px' : '20px' }}
              prefix="$"
              suffix=""
            />
          </Card>
        </Col>
        <Col span={getStatCardSpan()}>
          <Card size="small" bodyStyle={{ padding: isMobile ? '12px 8px' : '24px 16px' }}>
            <Statistic
              title={<span style={{ fontSize: isMobile ? '12px' : '14px' }}>Monthly Expenses</span>}
              value={totalExpenses}
              precision={0}
              valueStyle={{ color: '#cf1322', fontSize: isMobile ? '16px' : '20px' }}
              prefix="$"
              suffix=""
            />
          </Card>
        </Col>
        <Col span={getStatCardSpan()}>
          <Card size="small" bodyStyle={{ padding: isMobile ? '12px 8px' : '24px 16px' }}>
            <Statistic
              title={<span style={{ fontSize: isMobile ? '12px' : '14px' }}>Avg Credit Score</span>}
              value={averageCreditScore.toFixed(0)}
              precision={0}
              valueStyle={{ color: '#1890ff', fontSize: isMobile ? '16px' : '20px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]} className="charts-container" style={{ marginTop: isMobile ? 12 : 20 }}>
        <Col span={getChartSpan()}>
          <Card 
            title={<span style={{ fontSize: isMobile ? '14px' : '16px' }}>Income vs Expenses</span>} 
            size="small" 
            bodyStyle={{ padding: isMobile ? '8px 0' : '12px 8px', height: isMobile ? '220px' : '320px' }}
          >
            {chartsLoading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financialData} margin={{ top: 5, right: 20, left: isMobile ? 0 : 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={!isMobile} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    height={isMobile ? 30 : 50}
                    angle={isMobile ? -30 : 0}
                    textAnchor={isMobile ? "end" : "middle"}
                    tickMargin={isMobile ? 5 : 10}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <YAxis 
                    tick={{ fontSize: isMobile ? 10 : 12 }} 
                    width={isMobile ? 35 : 60}
                    axisLine={{ stroke: '#e0e0e0' }}
                    tickFormatter={(value) => isMobile ? `${value/1000}k` : `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => `$${Number(value).toLocaleString()}`} 
                    contentStyle={{ fontSize: isMobile ? 10 : 12 }}
                    itemStyle={{ padding: isMobile ? 2 : 4 }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: isMobile ? 10 : 12, paddingTop: isMobile ? 5 : 10 }} 
                    iconSize={isMobile ? 8 : 14}
                    verticalAlign={isMobile ? "top" : "bottom"}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#52c41a" 
                    activeDot={{ r: isMobile ? 4 : 8 }} 
                    strokeWidth={isMobile ? 1.5 : 2} 
                    dot={{ r: isMobile ? 2 : 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#f5222d" 
                    strokeWidth={isMobile ? 1.5 : 2} 
                    dot={{ r: isMobile ? 2 : 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
        <Col span={getPieChartSpan()}>
          <Card 
            title={<span style={{ fontSize: isMobile ? '14px' : '16px' }}>Risk Distribution</span>} 
            size="small" 
            bodyStyle={{ padding: isMobile ? '8px 0' : '12px 8px', height: isMobile ? '220px' : '320px' }}
          >
            {chartsLoading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={!isMobile}
                    outerRadius={isMobile ? 60 : 80}
                    innerRadius={isMobile ? 30 : 40}
                    fill="#8884d8"
                    dataKey="value"
                    label={isMobile ? false : ({ name, percent }: { name: string, percent: number }) => 
                      `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value} customers`}
                    contentStyle={{ fontSize: isMobile ? 10 : 12 }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} 
                    iconSize={isMobile ? 8 : 14}
                    formatter={(value) => value.replace(' Risk', '')} // Shorter labels on mobile
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      {/* Customer Data Table */}
      <Card 
        title={<span style={{ fontSize: isMobile ? '14px' : '16px' }}>Customer Data</span>} 
        style={{ marginTop: isMobile ? 12 : 20 }}
        size="small"
        bodyStyle={{ padding: isMobile ? '0px' : '8px' }}
      >
        <Table 
          dataSource={customersWithRisk} 
          columns={getColumns()}
          rowKey="customerId"
          loading={loading}
          pagination={{ 
            pageSize: isMobile ? 5 : isTablet ? 7 : 10,
            simple: isMobile || isTablet,
            size: 'small'
          }}
          scroll={{ x: isMobile ? 'max-content' : '100%' }}
          size="small"
          style={{ fontSize: isMobile ? '12px' : '14px' }}
        />
      </Card>
    </div>
  );
};

export default DashboardOverview;