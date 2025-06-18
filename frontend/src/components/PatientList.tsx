import React, { useState, useEffect } from "react";
import { Patient, Ward, Employee } from "../types";
import { patientApi, wardApi, employeeApi, diseaseApi } from "../services/api";
import { Button } from "./Button";
import Modal from "./Modal";

const genderOptions = ["Мужской", "Женский"];

const initialEditState = {
  full_name: "",
  birth_date: "",
  gender: "Мужской",
  contact_info: "",
  ward_id: "",
  attending_doctor_id: "",
  disease_id: "",
};

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [diseases, setDiseases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editPatient, setEditPatient] = useState<any>(initialEditState);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newPatient, setNewPatient] = useState<any>(initialEditState);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [patientsRes, wardsRes, employeesRes, diseasesRes] =
        await Promise.all([
          patientApi.getAll(),
          wardApi.getAll(),
          employeeApi.getAll(),
          diseaseApi.getAll(),
        ]);
      setPatients(patientsRes.data);
      setWards(wardsRes.data);
      setEmployees(employeesRes.data);
      setDiseases(diseasesRes.data);
    } catch (err) {
      setError("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await patientApi.delete(id);
      setPatients(patients.filter((p) => p.id !== id));
    } catch (err) {
      setError("Не удалось удалить пациента");
    }
  };

  const handleEditClick = (patient: Patient) => {
    setEditPatient({
      ...patient,
      disease_id: patient.disease_id || "", // если есть disease_id, иначе ""
    });
    setIsEditOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditPatient({ ...editPatient, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      await patientApi.update(editPatient.id, editPatient);
      fetchAll();
      setIsEditOpen(false);
    } catch (err) {
      setError("Не удалось обновить пациента");
    }
  };

  const handleAddClick = () => {
    setNewPatient(initialEditState);
    setIsAddOpen(true);
  };

  const handleAddChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  const handleAddSave = async () => {
    try {
      await patientApi.create(newPatient);
      fetchAll();
      setIsAddOpen(false);
    } catch (err) {
      setError("Не удалось добавить пациента");
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="blockList">
      <h2>Пациенты</h2>
      <div className="addButton">
        <Button onClick={handleAddClick}>Добавить</Button>
      </div>
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
              <td>
                {wards.find((w) => w.id === patient.ward_id)?.number || ""}
              </td>
              <td>
                {employees.find((e) => e.id === patient.attending_doctor_id)
                  ?.full_name || ""}
              </td>
              <td>
                {diseases.find(
                  (d) => d.id === (patient.disease_id || patient.disease)
                )?.name ||
                  patient.disease ||
                  ""}
              </td>
              <td>{patient.registration_date}</td>
              <td className="tableActions">
                <Button onClick={() => handleEditClick(patient)}>
                  Изменить
                </Button>
                <Button onClick={() => handleDelete(patient.id)}>
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <h3>Редактировать пациента</h3>
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
            value={editPatient.full_name}
            onChange={handleEditChange}
            placeholder="Имя"
          />
          <input
            name="birth_date"
            type="date"
            value={editPatient.birth_date}
            onChange={handleEditChange}
            placeholder="Дата рождения"
          />
          <select
            name="gender"
            value={editPatient.gender}
            onChange={handleEditChange}
          >
            {genderOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <input
            name="contact_info"
            value={editPatient.contact_info}
            onChange={handleEditChange}
            placeholder="Контакты"
          />
          <select
            name="ward_id"
            value={editPatient.ward_id}
            onChange={handleEditChange}
          >
            <option value="">Выберите палату</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.number}
              </option>
            ))}
          </select>
          <select
            name="attending_doctor_id"
            value={editPatient.attending_doctor_id}
            onChange={handleEditChange}
          >
            <option value="">Выберите врача</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.full_name}
              </option>
            ))}
          </select>
          <select
            name="disease_id"
            value={editPatient.disease_id}
            onChange={handleEditChange}
          >
            <option value="">Выберите заболевание</option>
            {diseases.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <Button onClick={handleEditSave}>Сохранить</Button>
        </div>
      </Modal>
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <h3>Добавить пациента</h3>
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
            value={newPatient.full_name}
            onChange={handleAddChange}
            placeholder="Имя"
          />
          <input
            name="birth_date"
            type="date"
            value={newPatient.birth_date}
            onChange={handleAddChange}
            placeholder="Дата рождения"
          />
          <select
            name="gender"
            value={newPatient.gender}
            onChange={handleAddChange}
          >
            {genderOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <input
            name="contact_info"
            value={newPatient.contact_info}
            onChange={handleAddChange}
            placeholder="Контакты"
          />
          <select
            name="ward_id"
            value={newPatient.ward_id}
            onChange={handleAddChange}
          >
            <option value="">Выберите палату</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.number}
              </option>
            ))}
          </select>
          <select
            name="attending_doctor_id"
            value={newPatient.attending_doctor_id}
            onChange={handleAddChange}
          >
            <option value="">Выберите врача</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.full_name}
              </option>
            ))}
          </select>
          <select
            name="disease_id"
            value={newPatient.disease_id}
            onChange={handleAddChange}
          >
            <option value="">Выберите заболевание</option>
            {diseases.map((d) => (
              <option key={d.id} value={d.id}>
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

export default PatientList;
