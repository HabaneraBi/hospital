import express from "express";
import { v4 as uuidv4 } from "uuid";
import DatabaseManager from "../database/database";

const router = express.Router();
const db = DatabaseManager.getDatabase();

// GET all departments
router.get("/", (req, res) => {
  db.all("SELECT * FROM departments", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET department by ID
router.get("/:id", (req, res) => {
  db.get(
    "SELECT * FROM departments WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: "Department not found" });
        return;
      }
      res.json(row);
    }
  );
});

// POST create department
router.post("/", (req, res) => {
  const { name, head_doctor, contact_info } = req.body;
  const id = uuidv4();

  db.run(
    "INSERT INTO departments (id, name, head_doctor, contact_info) VALUES (?, ?, ?, ?)",
    [id, name, head_doctor, contact_info],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, name, head_doctor, contact_info });
    }
  );
});

// PUT update department
router.put("/:id", (req, res) => {
  const { name, head_doctor, contact_info } = req.body;

  db.run(
    "UPDATE departments SET name = ?, head_doctor = ?, contact_info = ? WHERE id = ?",
    [name, head_doctor, contact_info, req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "Department not found" });
        return;
      }
      res.json({ id: req.params.id, name, head_doctor, contact_info });
    }
  );
});

// DELETE department
router.delete("/:id", (req, res) => {
  db.run(
    "DELETE FROM departments WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "Department not found" });
        return;
      }
      res.json({ message: "Department deleted successfully" });
    }
  );
});

export default router;
