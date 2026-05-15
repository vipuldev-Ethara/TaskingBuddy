import axios from './axios';

export const getTasks = async (params = {}) => {
  const response = await axios.get('/tasks/', { params });
  return response.data;
};

export const getTask = async (id) => {
  const response = await axios.get(`/tasks/${id}/`);
  return response.data;
};

export const createTask = async (data) => {
  // Use FormData if there's an attachment
  let payload = data;
  let headers = {};
  
  if (data.attachment instanceof File) {
    payload = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        payload.append(key, data[key]);
      }
    });
    headers = { 'Content-Type': 'multipart/form-data' };
  }
  
  const response = await axios.post('/tasks/', payload, { headers });
  return response.data;
};

export const updateTask = async (id, data) => {
  let payload = data;
  let headers = {};
  
  if (data.attachment instanceof File) {
    payload = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        payload.append(key, data[key]);
      }
    });
    headers = { 'Content-Type': 'multipart/form-data' };
  }
  
  const response = await axios.put(`/tasks/${id}/`, payload, { headers });
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`/tasks/${id}/`);
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await axios.patch(`/tasks/${id}/update-status/`, { status });
  return response.data;
};
