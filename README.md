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

## API Integration

The dashboard connects to a backend API to fetch customer financial data:
- API endpoint: `https://kyc-2rov.onrender.com/api/customers`
- Data structure includes customer details, financial metrics, and credit information

## Installation

1. Clone the repository:
   ```
   git clone [repository-url]
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

## Code Structure

- **Component Architecture**: Single-page dashboard component with modular sections
- **TypeScript Interface**: Strong typing for customer data structure
- **Responsive Hooks**: Media queries to adjust layout based on viewport
- **Dynamic Calculations**: Real-time risk assessment and financial metrics

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
