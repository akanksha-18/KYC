# Financial Dashboard

A responsive React dashboard for financial data analysis and risk assessment.

## Overview

This project is a comprehensive financial dashboard built with React and TypeScript that allows users to:
- View key financial metrics for customers
- Analyze income vs expenses data with interactive charts
- Assess customer risk profiles using a custom risk scoring algorithm
- Filter and sort customer data based on various criteria

## Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Key Metrics Display**: Total customers, income, expenses, and average credit score
- **Interactive Charts**:
  - Line chart showing income vs expenses
  - Pie chart displaying risk distribution
- **Customer Data Table**:
  - Sortable columns
  - Filterable by risk category and status
  - Responsive layout that adapts to screen size
- **Risk Assessment System**:
  - Custom algorithm calculating risk scores based on:
    - Credit score
    - Repayment history
    - Debt-to-income ratio
  - Visual indicators for risk levels (low, medium, high)

## Technologies Used

- **React**: Frontend library for building the user interface
- **TypeScript**: Type safety for better code quality
- **Ant Design**: UI component library
- **Recharts**: Responsive charting library
- **Axios**: HTTP client for API requests
- **React-Responsive**: Media query hooks for responsive design
![image](https://github.com/user-attachments/assets/60587c17-51c2-46dc-a5b0-a52439b8b8b0)
![image](https://github.com/user-attachments/assets/3d9c15c1-729e-49a4-a61e-0cf1f3bd6d3c)
![image](https://github.com/user-attachments/assets/c23b4a86-bf30-4483-ac57-431ba9f0a973)




## API Integration

The dashboard connects to a backend API to fetch customer financial data:
- API endpoint: `https://kyc-2rov.onrender.com/api/customers`
- Data structure includes customer details, financial metrics, and credit information

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/akanksha-18/KYC.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Usage

The dashboard automatically loads customer data on mount and displays:
1. Key financial metrics at the top
2. Interactive charts in the middle section
3. Detailed customer data table at the bottom

Users can:
- Sort customers by name, income, credit score, or risk score
- Filter customers by risk category (Low, Medium, High)
- Filter customers by status (Review, Approved, Rejected)
- View different data presentations based on screen size

## Responsive Design

The dashboard adapts to different screen sizes:
- **Desktop**: Full feature set with detailed tables and large charts
- **Tablet**: Streamlined layout with adjusted column visibility
- **Mobile**: Essential information with simplified charts and compact tables
### ✅ Risk Scoring Explanation

The risk score is calculated using a weighted formula based on three key financial factors:

- **Credit Score** (40% weight)  
  The credit score is normalized to a percentage out of 100, where a higher credit score contributes to a lower risk.

- **Loan Repayment History** (30% weight)  
  This is calculated as the average repayment success rate (percentage) across all previous loans. A higher repayment rate reduces the risk.

- **Debt-to-Income Ratio** (30% weight)  
  Calculated by dividing the customer's total outstanding loans by their annual income. A lower ratio indicates better financial stability and lowers the risk score.

The final **risk score** is a value between **0 and 100**, where:
- Lower scores indicate **lower risk**
- Higher scores indicate **higher risk**

Based on the final score, customers are classified into the following **risk categories**:

| Risk Score Range | Risk Category |
|------------------|----------------|
| 0 - 29           | Low Risk       |
| 30 - 59          | Medium Risk    |
| 60 - 100         | High Risk      |

This scoring system helps determine loan eligibility and guide approval decisions.

## Code Structure

- **Component Architecture**: Single-page dashboard component with modular sections
- **TypeScript Interface**: Strong typing for customer data structure
- **Responsive Hooks**: Media queries to adjust layout based on viewport
- **Dynamic Calculations**: Real-time risk assessment and financial metrics
## AI Tool Usage
This project utilized AI assistance to enhance the development process:
Claude (Anthropic's AI Assistant)

- **Debugging Support**: Helped identify and fix TypeScript errors related to unused variables in React components and type issues in arithmetic operations
- **Documentation Creation**: Generated comprehensive README documentation capturing the project's features, structure, and implementation details
- **Code Optimization**: Provided suggestions for making arithmetic operations type-safe by ensuring proper number conversions
- **Implementation Guidance**: Offered solutions for properly handling unused parameters in mapping functions

## Troubleshooting

If you encounter build errors:
- Ensure all variables used in mapping functions are utilized or replaced with underscores
- Check that arithmetic operations are performed on proper number types
- Use explicit number conversion (Number()) for values that might not be numeric

## Future Enhancements

- Add authentication system
- Implement data editing capabilities
- Create additional chart visualizations
- Add historical data comparison
- Develop customer detail view
