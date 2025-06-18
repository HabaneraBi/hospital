import React, { useState, useEffect } from "react";
import { Ward, Department } from "../types";
import { wardApi, departmentApi } from "../services/api";
import { Button } from "./Button";
import Modal from "./Modal";

const initialEditState: Ward = {
  id: "",
  number: "",
  department_name: "",
  bed_count: 0,
  department_id: "",
};

const WardList: React.FC = () => {
  const [wards, setWards] = useState<Ward[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editWard, setEditWard] = useState<Ward>(initialEditState);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newWard, setNewWard] = useState<Ward>(initialEditState);

  useEffect(() => {
    fetchWards();
    fetchDepartments();
  }, []);

  const fetchWards = async () => {
    try {
      setLoading(true);
      const response = await wardApi.getAll();
      setWards(response.data);
    } catch (err) {
      setError("Не удалось загрузить палаты");
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
      await wardApi.delete(id);
      setWards(wards.filter((w) => w.id !== id));
    } catch (err) {
      setError("Не удалось удалить палату");
    }
  };

  const handleEditClick = (ward: Ward) => {
    const department = departments.find((d) => d.name === ward.department_name);
    setEditWard({ ...ward, department_id: department ? department.id : "" });
    setIsEditOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditWard({ ...editWard, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      const payload = {
        number: editWard.number,
        department_id: editWard.department_id,
        bed_count: Number(editWard.bed_count),
        department_name:
          departments.find((d) => d.id === editWard.department_id)?.name || "",
      };
      await wardApi.update(editWard.id, payload);
      fetchWards();
      setIsEditOpen(false);
    } catch (err) {
      setError("Не удалось обновить палату");
    }
  };

  const handleAddClick = () => {
    setNewWard(initialEditState);
    setIsAddOpen(true);
  };

  const handleAddChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewWard({ ...newWard, [e.target.name]: e.target.value });
  };

  const handleAddSave = async () => {
    try {
      const payload = {
        number: newWard.number,
        department_id: newWard.department_id,
        bed_count: Number(newWard.bed_count),
        department_name:
          departments.find((d) => d.id === newWard.department_id)?.name || "",
      };
      const response = await wardApi.create(payload);
      fetchWards();
      setIsAddOpen(false);
    } catch (err) {
      setError("Не удалось добавить палату");
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="blockList">
      <h2>Палаты</h2>
      <div className="addButton">
        <Button onClick={handleAddClick}>Добавить</Button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Название палаты</th>
            <th>Отделение</th>
            <th>Количество мест</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {wards.map((ward) => (
            <tr className="tableRow" key={ward.id}>
              <td>{ward.number}</td>
              <td>{ward.department_name}</td>
              <td>{ward.bed_count}</td>
              <td className="tableActions">
                <Button onClick={() => handleDelete(ward.id)}>Удалить</Button>
                <Button onClick={() => handleEditClick(ward)}>Изменить</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <h3>Редактировать палату</h3>
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
            name="number"
            value={editWard.number}
            onChange={handleEditChange}
            placeholder="Номер палаты"
          />
          <select
            name="department_id"
            value={editWard.department_id}
            onChange={handleEditChange}
          >
            <option value="">Выберите отделение</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <input
            name="bed_count"
            type="number"
            value={editWard.bed_count}
            onChange={handleEditChange}
            placeholder="Количество коек"
          />
          <Button onClick={handleEditSave}>Сохранить</Button>
        </div>
      </Modal>
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <h3>Добавить палату</h3>
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
            name="number"
            value={newWard.number}
            onChange={handleAddChange}
            placeholder="Номер палаты"
          />
          <select
            name="department_id"
            value={newWard.department_id}
            onChange={handleAddChange}
          >
            <option value="">Выберите отделение</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <input
            name="bed_count"
            type="number"
            value={newWard.bed_count}
            onChange={handleAddChange}
            placeholder="Количество коек"
          />
          <Button onClick={handleAddSave}>Сохранить</Button>
        </div>
      </Modal>
    </div>
  );
};

export default WardList;
