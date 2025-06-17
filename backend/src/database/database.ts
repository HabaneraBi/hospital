import sqlite3 from "sqlite3";
import { Database } from "sqlite3";
import path from "path";
import fs from "fs";

class DatabaseManager {
  private db: Database;

  constructor() {
    const dbPath = path.join(__dirname, "../../medical.db");
    this.db = new sqlite3.Database(dbPath);
    this.initDatabase();
  }

  private initDatabase() {
    const initSQL = fs.readFileSync(path.join(__dirname, "init.sql"), "utf8");
    this.db.exec(initSQL, (err) => {
      if (err) {
        console.error("Error initializing database:", err);
      } else {
        console.log("Database initialized successfully");
        this.seedData();
      }
    });
  }

  private seedData() {
    // Добавляем тестовые данные
    const seedSQL = `
      -- Departments
      INSERT OR IGNORE INTO departments (id, name, head_doctor, contact_info) VALUES
      ('dept-1', 'Cardiology', 'Dr. Smith', '+1234567890'),
      ('dept-2', 'Neurology', 'Dr. Johnson', '+1234567891'),
      ('dept-3', 'Pediatrics', 'Dr. Williams', '+1234567892');

      -- Disease Categories
      INSERT OR IGNORE INTO disease_categories (id, name) VALUES
      ('cat-1', 'Cardiovascular'),
      ('cat-2', 'Neurological'),
      ('cat-3', 'Pediatric');

      -- Disease Complexity
      INSERT OR IGNORE INTO disease_complexity (id, description) VALUES
      ('comp-1', 'Low complexity'),
      ('comp-2', 'Medium complexity'),
      ('comp-3', 'High complexity');

      -- Diseases
      INSERT OR IGNORE INTO diseases (id, name, category_id, complexity_id) VALUES
      ('dis-1', 'Hypertension', 'cat-1', 'comp-2'),
      ('dis-2', 'Migraine', 'cat-2', 'comp-1'),
      ('dis-3', 'Asthma', 'cat-3', 'comp-2');

      -- Employees
      INSERT OR IGNORE INTO employees (id, full_name, position, department_id, contact_info, education, specialization) VALUES
      ('emp-1', 'Dr. John Smith', 'Head Doctor', 'dept-1', 'smith@hospital.com', 'MD, Harvard', 'Cardiology'),
      ('emp-2', 'Dr. Jane Johnson', 'Senior Doctor', 'dept-2', 'johnson@hospital.com', 'MD, Yale', 'Neurology'),
      ('emp-3', 'Dr. Bob Williams', 'Doctor', 'dept-3', 'williams@hospital.com', 'MD, Stanford', 'Pediatrics');

      -- Wards
      INSERT OR IGNORE INTO wards (id, number, department_id, bed_count) VALUES
      ('ward-1', '101', 'dept-1', 4),
      ('ward-2', '201', 'dept-2', 6),
      ('ward-3', '301', 'dept-3', 8);

      -- Patients
      INSERT OR IGNORE INTO patients (id, full_name, birth_date, gender, contact_info, ward_id, attending_doctor_id, registration_date) VALUES
      ('pat-1', 'Alice Cooper', '1985-05-15', 'Female', 'alice@email.com', 'ward-1', 'emp-1', '2024-01-15'),
      ('pat-2', 'Bob Miller', '1990-08-22', 'Male', 'bob@email.com', 'ward-2', 'emp-2', '2024-01-16'),
      ('pat-3', 'Charlie Brown', '2010-12-10', 'Male', 'charlie@email.com', 'ward-3', 'emp-3', '2024-01-17');
    `;

    this.db.exec(seedSQL, (err) => {
      if (err) {
        console.error("Error seeding data:", err);
      } else {
        console.log("Test data seeded successfully");
      }
    });
  }

  getDatabase(): Database {
    return this.db;
  }
}

export default new DatabaseManager();
