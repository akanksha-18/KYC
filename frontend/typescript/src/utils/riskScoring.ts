// src/utils/riskScoring.ts
export interface Customer {
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
  
  export interface CustomerWithRisk extends Customer {
    riskScore: number;
    riskCategory: string;
    debtToIncomeRatio?: number;
    repaymentRate?: number;
  }
  
  /**
   * Calculate risk score for a customer based on credit score, repayment history, and debt-to-income ratio
   * Higher score means higher risk (0-100 scale)
   */
  export const calculateRiskScore = (customer: Customer): number => {
    // Parameters that affect risk score
    const creditScoreWeight = 0.4;
    const repaymentHistoryWeight = 0.3;
    const debtToIncomeWeight = 0.3;
  
    // Credit score factor (higher is better)
    const creditScoreFactor = Math.min(customer.creditScore / 850, 1) * 100;
    
    // Repayment history factor (percentage of on-time payments)
    const repaymentRate = customer.loanRepaymentHistory.reduce((sum, val) => sum + val, 0) / 
                        customer.loanRepaymentHistory.length * 100;
    
    // Debt-to-income ratio (lower is better)
    const debtToIncomeRatio = customer.outstandingLoans / (customer.monthlyIncome * 12);
    const debtToIncomeFactor = Math.max(0, 100 - (debtToIncomeRatio * 100));
    
    // Final weighted score (higher means higher risk)
    const invertedCreditScore = 100 - creditScoreFactor;
    const invertedRepaymentRate = 100 - repaymentRate;
    
    const riskScore = (
      invertedCreditScore * creditScoreWeight +
      invertedRepaymentRate * repaymentHistoryWeight +
      debtToIncomeFactor * debtToIncomeWeight
    );
    
    return Math.min(Math.max(riskScore, 0), 100);
  };
  
  /**
   * Classify customer into risk categories based on their risk score
   */
  export const getRiskCategory = (score: number): string => {
    if (score < 30) return 'Low Risk';
    if (score < 60) return 'Medium Risk';
    return 'High Risk';
  };
  
  /**
   * Add risk score and category to customer data
   */
  export const enrichCustomerWithRiskData = (customer: Customer): CustomerWithRisk => {
    const riskScore = calculateRiskScore(customer);
    const repaymentRate = customer.loanRepaymentHistory.reduce((sum, val) => sum + val, 0) / 
                        customer.loanRepaymentHistory.length * 100;
    const debtToIncomeRatio = customer.outstandingLoans / (customer.monthlyIncome * 12);
    
    return {
      ...customer,
      riskScore,
      riskCategory: getRiskCategory(riskScore),
      debtToIncomeRatio,
      repaymentRate
    };
  };
  
  /**
   * Get appropriate color for risk levels
   */
  export const getRiskColor = (score: number): string => {
    if (score < 30) return '#52c41a'; 
    if (score < 60) return '#faad14';  
    return '#f5222d';  
  };
  
  /**
   * Get appropriate color for status
   */
  export const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Approved': return 'green';
      case 'Rejected': return 'red';
      default: return 'blue';
    }
  };