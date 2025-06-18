import React, { useState, useEffect } from "react";
import { Employee, Department } from "../types";
import { employeeApi, departmentApi } from "../services/api";
import { Button } from "./Button";
import Modal from "./Modal";

const initialEditState: Employee = {
  id: "",
  full_name: "",
  position: "",
  department_name: "",
  contact_info: "",
  education: "",
  specialization: "",
  department_id: "",
};

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee>(initialEditState);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>(initialEditState);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeApi.getAll();
      setEmployees(response.data);
    } catch (err) {
      setError("Не удалось загрузить сотрудников");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentApi.getAll();
      setDepartments(response.data);
    } catch (err) {
      setError("Не удалось загрузить отделения");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await employeeApi.delete(id);
      setEmployees(employees.filter((e) => e.id !== id));
    } catch (err) {
      setError("Не удалось удалить сотрудника");
    }
  };

  const handleEditClick = (employee: Employee) => {
    setEditEmployee(employee);
    setIsEditOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditEmployee({ ...editEmployee, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      await employeeApi.update(editEmployee.id, editEmployee);
      setEmployees((prev) =>
        prev.map((e) => (e.id === editEmployee.id ? editEmployee : e))
      );
      setIsEditOpen(false);
    } catch (err) {
      setError("Не удалось обновить сотрудника");
    }
  };

  const handleAddClick = () => {
    setNewEmployee(initialEditState);
    setIsAddOpen(true);
  };

  const handleAddChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleAddSave = async () => {
    try {
      const response = await employeeApi.create(newEmployee);
      setEmployees((prev) => [...prev, response.data]);
      setIsAddOpen(false);
    } catch (err) {
      setError("Не удалось добавить сотрудника");
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="blockList">
      <h2>Сотрудники</h2>
      <div className="addButton">
        <Button onClick={handleAddClick}>Добавить</Button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Должность</th>
            <th>Отделение</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr className="tableRow" key={employee.id}>
              <td>{employee.full_name}</td>
              <td>{employee.position}</td>
              <td>{employee.department_name}</td>
              <td className="tableActions">
                <Button onClick={() => handleDelete(employee.id)}>
                  Удалить
                </Button>
                <Button onClick={() => handleEditClick(employee)}>
                  Изменить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <h3>Редактировать сотрудника</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            alignItems: "center",
            width: "100%",
          }}
        >
          <input
            name="full_name"
            value={editEmployee.full_name}
            onChange={handleEditChange}
            placeholder="Имя"
          />
          <input
            name="position"
            value={editEmployee.position}
            onChange={handleEditChange}
            placeholder="Должность"
          />
          <select
            name="department_name"
            value={editEmployee.department_name}
            onChange={handleEditChange}
          >
            <option value="">Выберите отделение</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
          <Button onClick={handleEditSave}>Сохранить</Button>
        </div>
      </Modal>
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <h3>Добавить сотрудника</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            alignItems: "center",
            width: "100%",
          }}
        >
          <input
            name="full_name"
            value={newEmployee.full_name}
            onChange={handleAddChange}
            placeholder="Имя"
          />
          <input
            name="position"
            value={newEmployee.position}
            onChange={handleAddChange}
            placeholder="Должность"
          />
          <select
            name="department_name"
            value={newEmployee.department_name}
            onChange={handleAddChange}
          >
            <option value="">Выберите отделение</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
          <Button onClick={handleAddSave}>Сохранить</Button>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeList;
