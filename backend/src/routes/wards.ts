import express from "express";
import { v4 as uuidv4 } from "uuid";
import DatabaseManager from "../database/database";

const router = express.Router();
const db = DatabaseManager.getDatabase();

// GET all wards with department name
router.get("/", (req, res) => {
  const query = `
    SELECT w.*, d.name as department_name
    FROM wards w
    LEFT JOIN departments d ON w.department_id = d.id
  `;
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET ward by ID with department name
router.get("/:id", (req, res) => {
  const query = `
    SELECT w.*, d.name as department_name
    FROM wards w
    LEFT JOIN departments d ON w.department_id = d.id
    WHERE w.id = ?
  `;
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Ward not found" });
      return;
    }
    res.json(row);
  });
});

// POST create ward
router.post("/", (req, res) => {
  const { number, department_id, bed_count } = req.body;
  const id = uuidv4();
  db.run(
    "INSERT INTO wards (id, number, department_id, bed_count) VALUES (?, ?, ?, ?)",
    [id, number, department_id, bed_count],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, number, department_id, bed_count });
    }
  );
});

// PUT update ward
router.put("/:id", (req, res) => {
  const { number, department_id, bed_count } = req.body;
  db.run(
    "UPDATE wards SET number = ?, department_id = ?, bed_count = ? WHERE id = ?",
    [number, department_id, bed_count, req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "Ward not found" });
        return;
      }
      res.json({ id: req.params.id, number, department_id, bed_count });
    }
  );
});

// DELETE ward
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM wards WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Ward not found" });
      return;
    }
    res.json({ message: "Ward deleted successfully" });
  });
});

export default router;
