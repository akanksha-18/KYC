import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Progress, Statistic, Table, Tag, Select, Input,  Space } from 'antd';
import { WarningOutlined, CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://kyc-2rov.onrender.com/api/customers');
        const customersWithRisk = response.data.map((customer: Customer) => {
          const repaymentRate = customer.loanRepaymentHistory.reduce((sum, val) => sum + val, 0) / 
                               customer.loanRepaymentHistory.length * 100;
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
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
    
    const repaymentRate = customer.loanRepaymentHistory.reduce((sum, val) => sum + val, 0) / 
                          customer.loanRepaymentHistory.length * 100;
    
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

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: CustomerWithRisk) => (
        <span>
          {text} <br />
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
      sorter: (a: CustomerWithRisk, b: CustomerWithRisk) => a.creditScore - b.creditScore,
    },
    {
      title: 'Debt-to-Income',
      dataIndex: 'debtToIncomeRatio',
      key: 'debtToIncomeRatio',
      render: (ratio: number) => `${(ratio * 100).toFixed(1)}%`,
      sorter: (a: CustomerWithRisk, b: CustomerWithRisk) => a.debtToIncomeRatio - b.debtToIncomeRatio,
    },
    {
      title: 'Repayment Rate',
      dataIndex: 'repaymentRate',
      key: 'repaymentRate',
      render: (rate: number) => `${rate.toFixed(0)}%`,
      sorter: (a: CustomerWithRisk, b: CustomerWithRisk) => a.repaymentRate - b.repaymentRate,
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
      onFilter: (value: string, record: CustomerWithRisk) => record.riskCategory === value,
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

  return (
    <div className="risk-assessment">
      <h1>Risk Assessment</h1>
      
      {/* Risk Summary Cards */}
      <Row gutter={16} className="risk-summary">
        <Col span={8}>
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
        <Col span={8}>
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
        <Col span={8}>
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
        <Space>
          <Select 
            defaultValue="all" 
            style={{ width: 150 }} 
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
            style={{ width: 250 }}
          />
        </Space>
      </Card>
      
      {/* Customer Risk Table */}
      <Card title="Customer Risk Analysis" style={{ marginTop: 20 }}>
        <Table 
          dataSource={filteredCustomers} 
          columns={columns} 
          rowKey="customerId"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default RiskAssessment;