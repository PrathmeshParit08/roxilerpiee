import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

export const fetchTransactions = async (month, page = 1, search = '') => {
  const { data } = await axios.get(`${API_URL}/transactions`, {
    params: { month, page, search },
  });
  return data;
};

export const fetchStatistics = async (month) => {
  const { data } = await axios.get(`${API_URL}/statistics`, { params: { month } });
  return data;
};

export const fetchBarChart = async (month) => {
  const { data } = await axios.get(`${API_URL}/bar-chart`, { params: { month } });
  return data;
};

export const fetchPieChart = async (month) => {
  const { data } = await axios.get(`${API_URL}/pie-chart`, { params: { month } });
  return data;
};

export const fetchCombinedData = async (month) => {
  const { data } = await axios.get(`${API_URL}/combined`, { params: { month } });
  return data;
};
