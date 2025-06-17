import React, { useState, useEffect } from "react";
import { Patient } from "../types";
import { patientApi } from "../services/api";
import { Button } from "./Button";

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientApi.getAll();
      setPatients(response.data);
    } catch (err) {
      setError("Failed to fetch patients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await patientApi.delete(id);
      setPatients(patients.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete patient");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="blockList">
      <h2>Пациенты</h2>
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Дата рождения</th>
            <th>Пол</th>
            <th>Палата</th>
            <th>Врач</th>
            <th>Заболевание</th>
            <th>Дата регистрации</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr className="tableRow" key={patient.id}>
              <td>{patient.full_name}</td>
              <td>{patient.birth_date}</td>
              <td>{patient.gender}</td>
              <td>{patient.ward_number}</td>
              <td>{patient.doctor_name}</td>
              <td>{patient.disease}</td>
              <td>{patient.registration_date}</td>
              <td>
                <Button onClick={() => handleDelete(patient.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
