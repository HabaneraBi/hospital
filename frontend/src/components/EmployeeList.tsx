import React, { useState, useEffect } from "react";
import { Employee } from "../types";
import { employeeApi } from "../services/api";
import { Button } from "./Button";

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeApi.getAll();
      setEmployees(response.data);
    } catch (err) {
      setError("Failed to fetch employees");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Вы точно хотите удалить этого сотрудника?")) {
      try {
        await employeeApi.delete(id);
        setEmployees(employees.filter((e) => e.id !== id));
      } catch (err) {
        setError("Failed to delete employee");
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="blockList">
      <h2>Сотрудники</h2>
      <table>
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Должность</th>
            <th>Отделение</th>
            <th>Контакты</th>
            <th>Образование</th>
            <th>Специализация</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr className="tableRow" key={employee.id}>
              <td>{employee.full_name}</td>
              <td>{employee.position}</td>
              <td>{employee.department_name}</td>
              <td>{employee.contact_info}</td>
              <td>{employee.education}</td>
              <td>{employee.specialization}</td>
              <td>
                <Button onClick={() => handleDelete(employee.id)}>
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
