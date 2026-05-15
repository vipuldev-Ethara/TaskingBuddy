import axios from './axios';

export const login = async (email, password) => {
  const response = await axios.post('/auth/login/', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post('/auth/register/', userData);
  return response.data;
};

export const logout = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (refreshToken) {
    try {
      await axios.post('/auth/logout/', { refresh_token: refreshToken });
    } catch (error) {
      console.error('Logout error', error);
    }
  }
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export const getProfile = async () => {
  const response = await axios.get('/auth/profile/');
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await axios.put('/auth/profile/', userData);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await axios.put('/auth/change-password/', data);
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get('/auth/users/');
  return response.data;
};

export const inviteUser = async (userData) => {
  // Uses the dedicated admin-only invite endpoint
  const response = await axios.post('/auth/users/invite/', userData);
  return response.data;
};

export const removeUser = async (id) => {
  const response = await axios.delete(`/auth/users/${id}/`);
  return response.data;
};
