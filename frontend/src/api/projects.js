import axios from './axios';

export const getProjects = async (params = {}) => {
  const response = await axios.get('/projects/', { params });
  return response.data;
};

export const getProject = async (id) => {
  const response = await axios.get(`/projects/${id}/`);
  return response.data;
};

export const createProject = async (data) => {
  const response = await axios.post('/projects/', data);
  return response.data;
};

export const updateProject = async (id, data) => {
  const response = await axios.put(`/projects/${id}/`, data);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await axios.delete(`/projects/${id}/`);
  return response.data;
};

export const addProjectMember = async (projectId, userId) => {
  const response = await axios.post(`/projects/${projectId}/add-member/`, { user_id: userId });
  return response.data;
};

export const removeProjectMember = async (projectId, userId) => {
  const response = await axios.post(`/projects/${projectId}/remove-member/`, { user_id: userId });
  return response.data;
};
