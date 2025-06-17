import express from "express";
import { v4 as uuidv4 } from "uuid";
import DatabaseManager from "../database/database";

const router = express.Router();
const db = DatabaseManager.getDatabase();

// GET all employees with department name
router.get("/", (req, res) => {
  const query = `
    SELECT e.*, d.name as department_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
  `;
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET employee by ID with department name
router.get("/:id", (req, res) => {
  const query = `
    SELECT e.*, d.name as department_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE e.id = ?
  `;
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    res.json(row);
  });
});

// POST create employee
router.post("/", (req, res) => {
  const {
    full_name,
    position,
    department_id,
    contact_info,
    education,
    specialization,
  } = req.body;
  const id = uuidv4();
  db.run(
    "INSERT INTO employees (id, full_name, position, department_id, contact_info, education, specialization) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      full_name,
      position,
      department_id,
      contact_info,
      education,
      specialization,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id,
        full_name,
        position,
        department_id,
        contact_info,
        education,
        specialization,
      });
    }
  );
});

// PUT update employee
router.put("/:id", (req, res) => {
  const {
    full_name,
    position,
    department_id,
    contact_info,
    education,
    specialization,
  } = req.body;
  db.run(
    "UPDATE employees SET full_name = ?, position = ?, department_id = ?, contact_info = ?, education = ?, specialization = ? WHERE id = ?",
    [
      full_name,
      position,
      department_id,
      contact_info,
      education,
      specialization,
      req.params.id,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "Employee not found" });
        return;
      }
      res.json({
        id: req.params.id,
        full_name,
        position,
        department_id,
        contact_info,
        education,
        specialization,
      });
    }
  );
});

// DELETE employee
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM employees WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    res.json({ message: "Employee deleted successfully" });
  });
});

export default router;
