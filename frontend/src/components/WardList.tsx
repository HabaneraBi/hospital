import React, { useState, useEffect } from "react";
import { Ward } from "../types";
import { wardApi } from "../services/api";
import { Button } from "./Button";

const WardList: React.FC = () => {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    try {
      setLoading(true);
      const response = await wardApi.getAll();
      setWards(response.data);
    } catch (err) {
      setError("Failed to fetch wards");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await wardApi.delete(id);
      setWards(wards.filter((w) => w.id !== id));
    } catch (err) {
      setError("Failed to delete ward");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="blockList">
      <h2>Палаты</h2>
      <table>
        <thead>
          <tr>
            <th>Номер</th>
            <th>Отделение</th>
            <th>Количество коек</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {wards.map((ward) => (
            <tr className="tableRow" key={ward.id}>
              <td>{ward.number}</td>
              <td>{ward.department_name}</td>
              <td>{ward.bed_count}</td>
              <td>
                <Button onClick={() => handleDelete(ward.id)}>Удалить</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WardList;
