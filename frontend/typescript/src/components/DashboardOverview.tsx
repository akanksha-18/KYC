import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Progress, Typography } from 'antd';
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardOverview: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Media queries for responsive design
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://kyc-2rov.onrender.com/api/customers');
        setCustomers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
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
  const financialData = customers.map(customer => ({
    name: customer.name,
    income: customer.monthlyIncome,
    expenses: customer.monthlyExpenses,
    balance: customer.accountBalance
  }));

  // Generate risk distribution data for pie chart
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
          title: 'Customer ID',
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
          title: 'Monthly Income',
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
    if (isMobile) return 24;
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
    <div className="dashboard-overview" style={{ padding: isMobile ? '10px' : '20px' }}>
      <Title level={isMobile ? 3 : 1}>Financial Dashboard</Title>
      
      {/* Key Metrics */}
      <Row gutter={[16, 16]} className="metric-cards">
        <Col span={getStatCardSpan()}>
          <Card size={isMobile ? "small" : "default"}>
            <Statistic
              title="Total Customers"
              value={totalCustomers}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={getStatCardSpan()}>
          <Card size={isMobile ? "small" : "default"}>
            <Statistic
              title="Total Monthly Income"
              value={totalIncome}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix="$"
              suffix=""
            />
          </Card>
        </Col>
        <Col span={getStatCardSpan()}>
          <Card size={isMobile ? "small" : "default"}>
            <Statistic
              title="Total Monthly Expenses"
              value={totalExpenses}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix="$"
              suffix=""
            />
          </Card>
        </Col>
        <Col span={getStatCardSpan()}>
          <Card size={isMobile ? "small" : "default"}>
            <Statistic
              title="Average Credit Score"
              value={averageCreditScore.toFixed(0)}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} className="charts-container" style={{ marginTop: 20 }}>
        <Col span={getChartSpan()}>
          <Card title="Income vs Expenses" size={isMobile ? "small" : "default"}>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
              <LineChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  height={isMobile ? 30 : 50}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                />
                <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <Line type="monotone" dataKey="income" stroke="#52c41a" activeDot={{ r: isMobile ? 4 : 8 }} />
                <Line type="monotone" dataKey="expenses" stroke="#f5222d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={getPieChartSpan()}>
          <Card title="Risk Distribution" size={isMobile ? "small" : "default"}>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={!isMobile}
                  outerRadius={isMobile ? 60 : 80}
                  fill="#8884d8"
                  dataKey="value"
                  label={isMobile ? undefined : ({ name, percent }: { name: string, percent: number }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {riskDistribution.map((_, index) => (
  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Customer Data Table */}
      <Card 
        title="Customer Data" 
        style={{ marginTop: 20 }}
        size={isMobile ? "small" : "default"}
      >
        <Table 
          dataSource={customersWithRisk} 
          columns={getColumns()}
          rowKey="customerId"
          loading={loading}
          pagination={{ 
            pageSize: isMobile ? 5 : 10,
            simple: isMobile 
          }}
          scroll={{ x: isMobile ? 300 : 'max-content' }}
          size={isMobile ? "small" : "middle"}
        />
      </Card>
    </div>
  );
};

export default DashboardOverview;