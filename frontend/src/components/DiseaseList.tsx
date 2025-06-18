import React, { useState, useEffect } from "react";
import { Disease } from "../types";
import { diseaseApi } from "../services/api";
import { Button } from "./Button";
import Modal from "./Modal";

const initialEditState: Disease = {
  id: "",
  name: "",
  category_name: "Кардиологические",
  complexity_description: "Низкая сложность",
};

const categoryOptions = [
  "Кардиологические",
  "Неврологические",
  "Педиатрические",
  "Реанимационные",
  "Хирургические",
];

const complexityOptions = [
  "Низкая сложность",
  "Средняя сложность",
  "Высокая сложность",
];

const DiseaseList: React.FC = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editDisease, setEditDisease] = useState<Disease>(initialEditState);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDisease, setNewDisease] = useState<Disease>(initialEditState);

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    try {
      setLoading(true);
      const response = await diseaseApi.getAll();
      setDiseases(response.data);
    } catch (err) {
      setError("Не удалось загрузить болезни");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await diseaseApi.delete(id);
      setDiseases(diseases.filter((d) => d.id !== id));
    } catch (err) {
      setError("Не удалось удалить болезнь");
    }
  };

  const handleEditClick = (disease: Disease) => {
    setEditDisease(disease);
    setIsEditOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditDisease({ ...editDisease, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      await diseaseApi.update(editDisease.id, editDisease);
      setDiseases((prev) =>
        prev.map((d) => (d.id === editDisease.id ? editDisease : d))
      );
      setIsEditOpen(false);
    } catch (err) {
      setError("Не удалось обновить болезнь");
    }
  };

  const handleAddClick = () => {
    setNewDisease(initialEditState);
    setIsAddOpen(true);
  };

  const handleAddChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewDisease({ ...newDisease, [e.target.name]: e.target.value });
  };

  const handleAddSave = async () => {
    try {
      const response = await diseaseApi.create(newDisease);
      setDiseases((prev) => [...prev, response.data]);
      setIsAddOpen(false);
    } catch (err) {
      setError("Не удалось добавить болезнь");
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="blockList">
      <h2>Болезни</h2>
      <div className="addButton">
        <Button onClick={handleAddClick}>Добавить</Button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Название заболевания</th>
            <th>Категория заболевания</th>
            <th>Сложность заболевания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {diseases.map((disease) => (
            <tr className="tableRow" key={disease.id}>
              <td>{disease.name}</td>
              <td>{disease.category_name}</td>
              <td>{disease.complexity_description}</td>
              <td className="tableActions">
                <Button onClick={() => handleDelete(disease.id)}>
                  Удалить
                </Button>
                <Button onClick={() => handleEditClick(disease)}>
                  Изменить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <h3>Редактировать болезнь</h3>
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
            value={editDisease.name}
            onChange={handleEditChange}
            placeholder="Название заболевания"
          />
          <select
            name="category_name"
            value={editDisease.category_name}
            onChange={handleEditChange}
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            name="complexity_description"
            value={editDisease.complexity_description}
            onChange={handleEditChange}
          >
            {complexityOptions.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
          <Button onClick={handleEditSave}>Сохранить</Button>
        </div>
      </Modal>
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <h3>Добавить болезнь</h3>
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
            value={newDisease.name}
            onChange={handleAddChange}
            placeholder="Название заболевания"
          />
          <select
            name="category_name"
            value={newDisease.category_name}
            onChange={handleAddChange}
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            name="complexity_description"
            value={newDisease.complexity_description}
            onChange={handleAddChange}
          >
            {complexityOptions.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
          <Button onClick={handleAddSave}>Сохранить</Button>
        </div>
      </Modal>
    </div>
  );
};

export default DiseaseList;
