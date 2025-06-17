import axios from "axios";
import { Department, Patient, Employee, Ward } from "../types";

const API_BASE_URL = "http://localhost:3003/api";

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

// Employees
export const employeeApi = {
  getAll: () => api.get<Employee[]>("/employees"),
  getById: (id: string) => api.get<Employee>(`/employees/${id}`),
  create: (employee: Omit<Employee, "id">) =>
    api.post<Employee>("/employees", employee),
  update: (id: string, employee: Omit<Employee, "id">) =>
    api.put<Employee>(`/employees/${id}`, employee),
  delete: (id: string) => api.delete(`/employees/${id}`),
};

// Wards
export const wardApi = {
  getAll: () => api.get<Ward[]>("/wards"),
  getById: (id: string) => api.get<Ward>(`/wards/${id}`),
  create: (ward: Omit<Ward, "id">) => api.post<Ward>("/wards", ward),
  update: (id: string, ward: Omit<Ward, "id">) =>
    api.put<Ward>(`/wards/${id}`, ward),
  delete: (id: string) => api.delete(`/wards/${id}`),
};

// Diseases
export const diseaseApi = {
  getAll: () => api.get<any[]>("/diseases"),
  getById: (id: string) => api.get<any>(`/diseases/${id}`),
  create: (disease: Omit<any, "id">) => api.post<any>("/diseases", disease),
  update: (id: string, disease: Omit<any, "id">) =>
    api.put<any>(`/diseases/${id}`, disease),
  delete: (id: string) => api.delete(`/diseases/${id}`),
};
