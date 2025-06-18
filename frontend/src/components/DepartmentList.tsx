import React, { useState, useEffect } from "react";
import { Department } from "../types";
import { departmentApi } from "../services/api";
import { Button } from "./Button";
import Modal from "./Modal";

const initialEditState: Department = {
  id: "",
  name: "",
  head_doctor: "",
  contact_info: "",
};

const DepartmentList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editDepartment, setEditDepartment] =
    useState<Department>(initialEditState);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDepartment, setNewDepartment] =
    useState<Department>(initialEditState);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentApi.getAll();
      setDepartments(response.data);
    } catch (err) {
      setError("Не удалось загрузить отделения");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await departmentApi.delete(id);
      setDepartments(departments.filter((d) => d.id !== id));
    } catch (err) {
      setError("Не удалось удалить отделение");
    }
  };

  const handleEditClick = (department: Department) => {
    setEditDepartment(department);
    setIsEditOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditDepartment({ ...editDepartment, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      await departmentApi.update(editDepartment.id, editDepartment);
      setDepartments((prev) =>
        prev.map((d) => (d.id === editDepartment.id ? editDepartment : d))
      );
      setIsEditOpen(false);
    } catch (err) {
      setError("Не удалось обновить отделение");
    }
  };

  const handleAddClick = () => {
    setNewDepartment(initialEditState);
    setIsAddOpen(true);
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDepartment({ ...newDepartment, [e.target.name]: e.target.value });
  };

  const handleAddSave = async () => {
    try {
      const response = await departmentApi.create(newDepartment);
      setDepartments((prev) => [...prev, response.data]);
      setIsAddOpen(false);
    } catch (err) {
      setError("Не удалось добавить отделение");
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="blockList">
      <h2>Отделения</h2>
      <div className="addButton">
        <Button onClick={handleAddClick}>Добавить</Button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Название отделения</th>
            <th>Главврач</th>
            <th>Контакты</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => (
            <tr className="tableRow" key={department.id}>
              <td>{department.name}</td>
              <td>{department.head_doctor}</td>
              <td>{department.contact_info}</td>
              <td className="tableActions">
                <Button onClick={() => handleDelete(department.id)}>
                  Удалить
                </Button>
                <Button onClick={() => handleEditClick(department)}>
                  Изменить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <h3>Редактировать отделение</h3>
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
            name="name"
            value={editDepartment.name}
            onChange={handleEditChange}
            placeholder="Название отделения"
          />
          <input
            name="head_doctor"
            value={editDepartment.head_doctor}
            onChange={handleEditChange}
            placeholder="ФИО главврача"
          />
          <input
            name="contact_info"
            value={editDepartment.contact_info}
            onChange={handleEditChange}
            placeholder="Контакты"
          />
          <Button onClick={handleEditSave}>Сохранить</Button>
        </div>
      </Modal>
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <h3>Добавить отделение</h3>
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
            name="name"
            value={newDepartment.name}
            onChange={handleAddChange}
            placeholder="Название отделения"
          />
          <input
            name="head_doctor"
            value={newDepartment.head_doctor}
            onChange={handleAddChange}
            placeholder="ФИО главврача"
          />
          <input
            name="contact_info"
            value={newDepartment.contact_info}
            onChange={handleAddChange}
            placeholder="Контакты"
          />
          <Button onClick={handleAddSave}>Сохранить</Button>
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentList;
