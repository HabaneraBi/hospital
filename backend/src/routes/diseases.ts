import express from "express";
import { v4 as uuidv4 } from "uuid";
import DatabaseManager from "../database/database";

const router = express.Router();
const db = DatabaseManager.getDatabase();

// GET all diseases with category and complexity names
router.get("/", (req, res) => {
  const query = `
    SELECT dis.*, cat.name as category_name, comp.description as complexity_description
    FROM diseases dis
    LEFT JOIN disease_categories cat ON dis.category_id = cat.id
    LEFT JOIN disease_complexity comp ON dis.complexity_id = comp.id
  `;
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET disease by ID with category and complexity names
router.get("/:id", (req, res) => {
  const query = `
    SELECT dis.*, cat.name as category_name, comp.description as complexity_description
    FROM diseases dis
    LEFT JOIN disease_categories cat ON dis.category_id = cat.id
    LEFT JOIN disease_complexity comp ON dis.complexity_id = comp.id
    WHERE dis.id = ?
  `;
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Disease not found" });
      return;
    }
    res.json(row);
  });
});

// POST create disease
router.post("/", (req, res) => {
  const { name, category_id, complexity_id } = req.body;
  const id = uuidv4();
  db.run(
    "INSERT INTO diseases (id, name, category_id, complexity_id) VALUES (?, ?, ?, ?)",
    [id, name, category_id, complexity_id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, name, category_id, complexity_id });
    }
  );
});

// PUT update disease
router.put("/:id", (req, res) => {
  const { name, category_id, complexity_id } = req.body;
  db.run(
    "UPDATE diseases SET name = ?, category_id = ?, complexity_id = ? WHERE id = ?",
    [name, category_id, complexity_id, req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "Disease not found" });
        return;
      }
      res.json({ id: req.params.id, name, category_id, complexity_id });
    }
  );
});

// DELETE disease
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM diseases WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Disease not found" });
      return;
    }
    res.json({ message: "Disease deleted successfully" });
  });
});

export default router;
