import express from "express";
import { v4 as uuidv4 } from "uuid";
import DatabaseManager from "../database/database";

const router = express.Router();
const db = DatabaseManager.getDatabase();

// GET all patients with ward and doctor info
router.get("/", (req, res) => {
  const query = `
    SELECT p.*, w.number as ward_number, e.full_name as doctor_name, d.name as disease
    FROM patients p
    LEFT JOIN wards w ON p.ward_id = w.id
    LEFT JOIN employees e ON p.attending_doctor_id = e.id
    LEFT JOIN diseases d ON p.disease_id = d.id
  `;

  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET patient by ID
router.get("/:id", (req, res) => {
  const query = `
    SELECT p.*, w.number as ward_number, e.full_name as doctor_name
    FROM patients p
    LEFT JOIN wards w ON p.ward_id = w.id
    LEFT JOIN employees e ON p.attending_doctor_id = e.id
    LEFT JOIN diseases d ON p.disease_id = d.id
    WHERE p.id = ?
  `;

  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    res.json(row);
  });
});

// POST create patient
router.post("/", (req, res) => {
  const {
    full_name,
    birth_date,
    gender,
    contact_info,
    ward_id,
    attending_doctor_id,
    disease_id,
  } = req.body;
  const id = uuidv4();
  const registration_date = new Date().toISOString().split("T")[0];

  db.run(
    "INSERT INTO patients (id, full_name, birth_date, gender, contact_info, ward_id, attending_doctor_id, registration_date, disease_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      full_name,
      birth_date,
      gender,
      contact_info,
      ward_id,
      attending_doctor_id,
      registration_date,
      disease_id,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id,
        full_name,
        birth_date,
        gender,
        contact_info,
        ward_id,
        attending_doctor_id,
        registration_date,
        disease_id,
      });
    }
  );
});

// PUT update patient
router.put("/:id", (req, res) => {
  const {
    full_name,
    birth_date,
    gender,
    contact_info,
    ward_id,
    attending_doctor_id,
    disease_id,
  } = req.body;

  db.run(
    "UPDATE patients SET full_name = ?, birth_date = ?, gender = ?, contact_info = ?, ward_id = ?, attending_doctor_id = ?, disease_id = ? WHERE id = ?",
    [
      full_name,
      birth_date,
      gender,
      contact_info,
      ward_id,
      attending_doctor_id,
      disease_id,
      req.params.id,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "Patient not found" });
        return;
      }
      res.json({
        id: req.params.id,
        full_name,
        birth_date,
        gender,
        contact_info,
        ward_id,
        attending_doctor_id,
        disease_id,
      });
    }
  );
});

// DELETE patient
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM patients WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    res.json({ message: "Patient deleted successfully" });
  });
});

export default router;
