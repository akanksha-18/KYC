// src/services/api.ts
import axios from 'axios';
import { Customer, CustomerWithRisk, enrichCustomerWithRiskData } from '../utils/riskScoring';

const API_URL = 'https://kyc-2rov.onrender.com/api';

const api = {
  // Customer endpoints
  customers: {
    getAll: async (): Promise<CustomerWithRisk[]> => {
      const response = await axios.get(`${API_URL}/customers`);
      return response.data.map((customer: Customer) => enrichCustomerWithRiskData(customer));
    },
    
    getById: async (id: string): Promise<CustomerWithRisk> => {
      const response = await axios.get(`${API_URL}/customers/${id}`);
      return enrichCustomerWithRiskData(response.data);
    },
    
    create: async (customer: Partial<Customer>): Promise<CustomerWithRisk> => {
      const response = await axios.post(`${API_URL}/customers`, customer);
      return enrichCustomerWithRiskData(response.data);
    },
    
    update: async (id: string, customer: Partial<Customer>): Promise<CustomerWithRisk> => {
      const response = await axios.put(`${API_URL}/customers/${id}`, customer);
      return enrichCustomerWithRiskData(response.data);
    },
    
    delete: async (id: string): Promise<void> => {
      await axios.delete(`${API_URL}/customers/${id}`);
    }
  },
  
  // Alert endpoints
  alerts: {
    getAll: async () => {
      const response = await axios.get(`${API_URL}/alerts`);
      return response.data;
    },
    
    create: async (alert: any) => {
      const response = await axios.post(`${API_URL}/alerts`, alert);
      return response.data;
    },
    
    getByCustomerId: async (customerId: string) => {
      const response = await axios.get(`${API_URL}/alerts/customer/${customerId}`);
      return response.data;
    }
  }
};

export default api;