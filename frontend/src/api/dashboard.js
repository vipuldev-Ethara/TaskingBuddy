import axios from './axios';

export const getDashboardStats = async () => {
  const response = await axios.get('/dashboard/stats/');
  return response.data;
};

export const getActivityLogs = async () => {
  const response = await axios.get('/dashboard/activity/');
  return response.data;
};
