import {apiClient, mlClient} from './axios';

export const userAPI = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  getHeatMapData: async (credentials: { sid: string }) => {
    const response = await apiClient.post('/simulation/heatmap', credentials);
    return response.data;
  }
  
};