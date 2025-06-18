import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import DatabaseManager from "../database/database";

const router = express.Router();
const db = DatabaseManager.getDatabase();

// Получить все болезни с категориями и сложностью
router.get("/", (req: Request, res: Response) => {
  db.all(
    `SELECT d.id, d.name, dc.name as category_name, dx.description as complexity_description
     FROM diseases d
     LEFT JOIN disease_categories dc ON d.category_id = dc.id
     LEFT JOIN disease_complexity dx ON d.complexity_id = dx.id`,
    (err: Error | null, rows: any[]) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

// Получить болезнь по id
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  db.get(
    `SELECT d.id, d.name, dc.name as category_name, dx.description as complexity_description
     FROM diseases d
     LEFT JOIN disease_categories dc ON d.category_id = dc.id
     LEFT JOIN disease_complexity dx ON d.complexity_id = dx.id
     WHERE d.id = ?`,
    [id],
    (err: Error | null, row: any) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(row);
      }
    }
  );
});

// Создать болезнь
router.post("/", (req: Request, res: Response) => {
  const { name, category_name, complexity_description } = req.body;
  if (!name || !category_name || !complexity_description) {
    return res.status(400).json({ error: "Все поля обязательны" });
  }
  db.get(
    `SELECT id FROM disease_categories WHERE name = ?`,
    [category_name],
    (err: Error | null, categoryRow: any) => {
      if (err || !categoryRow) {
        return res.status(400).json({ error: "Категория не найдена" });
      }
      db.get(
        `SELECT id FROM disease_complexity WHERE description = ?`,
        [complexity_description],
        (err2: Error | null, complexityRow: any) => {
          if (err2 || !complexityRow) {
            return res.status(400).json({ error: "Сложность не найдена" });
          }
          const id = uuidv4();
          db.run(
            `INSERT INTO diseases (id, name, category_id, complexity_id) VALUES (?, ?, ?, ?)`,
            [id, name, categoryRow.id, complexityRow.id],
            function (err3: Error | null) {
              if (err3) {
                return res.status(500).json({ error: err3.message });
              }
              db.get(
                `SELECT d.id, d.name, dc.name as category_name, dx.description as complexity_description
                 FROM diseases d
                 LEFT JOIN disease_categories dc ON d.category_id = dc.id
                 LEFT JOIN disease_complexity dx ON d.complexity_id = dx.id
                 WHERE d.id = ?`,
                [id],
                (err4: Error | null, newRow: any) => {
                  if (err4) {
                    return res.status(500).json({ error: err4.message });
                  }
                  res.status(201).json(newRow);
                }
              );
            }
          );
        }
      );
    }
  );
});

// Обновить болезнь
router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, category_name, complexity_description } = req.body;
  if (!name || !category_name || !complexity_description) {
    return res.status(400).json({ error: "Все поля обязательны" });
  }
  db.get(
    `SELECT id FROM disease_categories WHERE name = ?`,
    [category_name],
    (err: Error | null, categoryRow: any) => {
      if (err || !categoryRow) {
        return res.status(400).json({ error: "Категория не найдена" });
      }
      db.get(
        `SELECT id FROM disease_complexity WHERE description = ?`,
        [complexity_description],
        (err2: Error | null, complexityRow: any) => {
          if (err2 || !complexityRow) {
            return res.status(400).json({ error: "Сложность не найдена" });
          }
          db.run(
            `UPDATE diseases SET name = ?, category_id = ?, complexity_id = ? WHERE id = ?`,
            [name, categoryRow.id, complexityRow.id, id],
            function (err3: Error | null) {
              if (err3) {
                return res.status(500).json({ error: err3.message });
              }
              db.get(
                `SELECT d.id, d.name, dc.name as category_name, dx.description as complexity_description
                 FROM diseases d
                 LEFT JOIN disease_categories dc ON d.category_id = dc.id
                 LEFT JOIN disease_complexity dx ON d.complexity_id = dx.id
                 WHERE d.id = ?`,
                [id],
                (err4: Error | null, updatedRow: any) => {
                  if (err4) {
                    return res.status(500).json({ error: err4.message });
                  }
                  res.json(updatedRow);
                }
              );
            }
          );
        }
      );
    }
  );
});

// Удалить болезнь
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  db.run(
    `DELETE FROM diseases WHERE id = ?`,
    [id],
    function (err: Error | null) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ success: true });
      }
    }
  );
});

export default router;
