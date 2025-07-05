import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth Services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    const response = await api.post('/register', userData);
    return response.data;
  },
};

// Doctor Services
export const doctorService = {
  getDoctors: async () => {
    const response = await api.get('/doctors');
    return response.data;
  },

  addDoctor: async (doctorData: {
    name: string;
    specialty: string;
    available: boolean;
  }) => {
    const response = await api.post('/doctors', doctorData);
    return response.data;
  },
};

// Appointment Services
export const appointmentService = {
  createAppointment: async (appointmentData: {
    userId: string;
    doctorId: string;
    date: string;
    time: string;
  }) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  getUserAppointments: async (userId: string) => {
    const response = await api.get(`/appointments/${userId}`);
    return response.data;
  },

  updateAppointment: async (id: string, appointmentData: any) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },
}; 