import {apiClient, mlClient} from './axios';

export const userAPI = {

  //Auth

  register: async (userInfo: { username: string; password: string }) => {
    const response = await apiClient.post('/auth/register', userInfo);
    return response.data;
  },

  login: async (credentials: { username: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  getUserInfo: async () => {
    const response = await apiClient.get('/user/info');
    return response.data;
  },
  // Simulation

  getHeatMapData: async () => {
    const response = await apiClient.get('/simulation/heatmap');
    return response.data;
  },


  // Avatar
  
  uploadAvatar: async (userId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(`/avatar/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  getAvatar: async () => {
    const response = await apiClient.get('/user/avatar');
    return response.data;
  },

//Survey
  submitSurvey: async (data: any) => {
    const response = await apiClient.post('/survey/ffq', data);
    return response.data;
  }

  
};