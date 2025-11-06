import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://localhost:3005'; // Schedule Service
const AUTH_BASE_URL = 'http://localhost:3001'; // Auth Service (future)

class ApiClient {
  private scheduleClient: AxiosInstance;
  private authClient: AxiosInstance;

  constructor() {
    // Schedule Service client
    this.scheduleClient = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Auth Service client
    this.authClient = axios.create({
      baseURL: `${AUTH_BASE_URL}/api/v1`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to attach auth token
    this.scheduleClient.interceptors.request.use(
      async (config) => {
        const token = await SecureStore.getItemAsync('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.authClient.interceptors.request.use(
      async (config) => {
        const token = await SecureStore.getItemAsync('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    [this.scheduleClient, this.authClient].forEach((client) => {
      client.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
          if (error.response?.status === 401) {
            // Token expired, clear and redirect to login
            await SecureStore.deleteItemAsync('auth_token');
            await SecureStore.deleteItemAsync('user_id');
            // Navigate to login screen (handled by navigation context)
          }
          return Promise.reject(error);
        }
      );
    });
  }

  // ==========================================
  // Schedule Service API
  // ==========================================

  /**
   * Get schedules for a project
   */
  async getSchedules(projectId: string) {
    const response = await this.scheduleClient.get('/schedules', {
      params: { projectId },
    });
    return response.data;
  }

  /**
   * Get schedule with activities
   */
  async getSchedule(scheduleId: string) {
    const response = await this.scheduleClient.get(`/schedules/${scheduleId}`);
    return response.data;
  }

  /**
   * Get activities for a schedule
   */
  async getActivities(scheduleId: string) {
    const response = await this.scheduleClient.get(`/schedules/${scheduleId}/activities`);
    return response.data;
  }

  /**
   * Update activity progress
   */
  async updateActivity(scheduleId: string, activityId: string, data: any) {
    const response = await this.scheduleClient.put(
      `/schedules/${scheduleId}/activities/${activityId}`,
      data
    );
    return response.data;
  }

  /**
   * Upload photo (multipart/form-data)
   */
  async uploadPhoto(file: FormData) {
    const response = await this.scheduleClient.post('/photos', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // ==========================================
  // Auth Service API (Future)
  // ==========================================

  /**
   * Login
   */
  async login(email: string, password: string) {
    const response = await this.authClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    const response = await this.authClient.get('/auth/me');
    return response.data;
  }

  /**
   * Logout
   */
  async logout() {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_id');
  }
}

export default new ApiClient();
