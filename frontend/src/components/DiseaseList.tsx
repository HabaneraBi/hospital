import React, { useState, useEffect } from "react";
import { Disease } from "../types";
import { diseaseApi } from "../services/api";
import { Button } from "./Button";

const DiseaseList: React.FC = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    try {
      setLoading(true);
      const response = await diseaseApi.getAll();
      setDiseases(response.data);
    } catch (err) {
      setError("Failed to fetch diseases");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await diseaseApi.delete(id);
      setDiseases(diseases.filter((d) => d.id !== id));
    } catch (err) {
      setError("Failed to delete disease");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="blockList">
      <h2>Болезни</h2>
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
              <td>
                <Button onClick={() => handleDelete(disease.id)}>
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

export default DiseaseList;
