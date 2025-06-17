import React, { useState, useEffect } from "react";
import { Department } from "../types";
import { departmentApi } from "../services/api";
import { Button } from "./Button";

const DepartmentList: React.FC = () => {
  const [departaments, setDepartaments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartaments();
  }, []);

  const fetchDepartaments = async () => {
    try {
      setLoading(true);
      const response = await departmentApi.getAll();
      setDepartaments(response.data);
    } catch (err) {
      setError("Failed to fetch departments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Вы точно хотите удалить это отделение?")) {
      try {
        await departmentApi.delete(id);
        setDepartaments(departaments.filter((d) => d.id !== id));
      } catch (err) {
        setError("Failed to delete department");
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="blockList">
      <h2>Отделения</h2>
      <table>
        <thead>
          <tr>
            <th>Название отделения</th>
            <th>Контакты</th>
            <th>Главный врач</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {departaments.map((department) => (
            <tr className="tableRow" key={department.id}>
              <td>{department.name}</td>
              <td>{department.contact_info}</td>
              <td>{department.head_doctor}</td>
              <td>
                <Button onClick={() => handleDelete(department.id)}>
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

export default DepartmentList;
