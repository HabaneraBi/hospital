import axios from "axios";
import { Department, Patient, Employee, Ward } from "../types";

const API_BASE_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Departments
export const departmentApi = {
  getAll: () => api.get<Department[]>("/departments"),
  getById: (id: string) => api.get<Department>(`/departments/${id}`),
  create: (department: Omit<Department, "id">) =>
    api.post<Department>("/departments", department),
  update: (id: string, department: Omit<Department, "id">) =>
    api.put<Department>(`/departments/${id}`, department),
  delete: (id: string) => api.delete(`/departments/${id}`),
};

// Patients
export const patientApi = {
  getAll: () => api.get<Patient[]>("/patients"),
  getById: (id: string) => api.get<Patient>(`/patients/${id}`),
  create: (patient: Omit<Patient, "id" | "registration_date">) =>
    api.post<Patient>("/patients", patient),
  update: (id: string, patient: Omit<Patient, "id" | "registration_date">) =>
    api.put<Patient>(`/patients/${id}`, patient),
  delete: (id: string) => api.delete(`/patients/${id}`),
};

// Add similar APIs for employees, wards, diseases, etc.
