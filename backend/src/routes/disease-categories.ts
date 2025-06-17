import express from "express";
import { v4 as uuidv4 } from "uuid";
import DatabaseManager from "../database/database";

const router = express.Router();
const db = DatabaseManager.getDatabase();

// GET all disease categories
router.get("/", (req, res) => {
  db.all("SELECT * FROM disease_categories", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET disease category by ID
router.get("/:id", (req, res) => {
  db.get(
    "SELECT * FROM disease_categories WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: "Disease category not found" });
        return;
      }
      res.json(row);
    }
  );
});

// POST create disease category
router.post("/", (req, res) => {
  const { name } = req.body;
  const id = uuidv4();
  db.run(
    "INSERT INTO disease_categories (id, name) VALUES (?, ?)",
    [id, name],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, name });
    }
  );
});

// PUT update disease category
router.put("/:id", (req, res) => {
  const { name } = req.body;
  db.run(
    "UPDATE disease_categories SET name = ? WHERE id = ?",
    [name, req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "Disease category not found" });
        return;
      }
      res.json({ id: req.params.id, name });
    }
  );
});

// DELETE disease category
router.delete("/:id", (req, res) => {
  db.run(
    "DELETE FROM disease_categories WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "Disease category not found" });
        return;
      }
      res.json({ message: "Disease category deleted successfully" });
    }
  );
});

export default router;
