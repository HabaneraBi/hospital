-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  head_doctor TEXT NOT NULL,
  contact_info TEXT
);

-- Disease categories table
CREATE TABLE IF NOT EXISTS disease_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Disease complexity table
CREATE TABLE IF NOT EXISTS disease_complexity (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL
);

-- Diseases table
CREATE TABLE IF NOT EXISTS diseases (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  complexity_id TEXT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES disease_categories(id),
  FOREIGN KEY (complexity_id) REFERENCES disease_complexity(id)
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  department_id TEXT NOT NULL,
  contact_info TEXT,
  education TEXT,
  specialization TEXT,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Wards table
CREATE TABLE IF NOT EXISTS wards (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  department_id TEXT NOT NULL,
  bed_count INTEGER NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  gender TEXT NOT NULL,
  contact_info TEXT,
  ward_id TEXT,
  attending_doctor_id TEXT,
  registration_date TEXT NOT NULL,
  disease_id TEXT,
  FOREIGN KEY (ward_id) REFERENCES wards(id),
  FOREIGN KEY (attending_doctor_id) REFERENCES employees(id),
  FOREIGN KEY (disease_id) REFERENCES diseases(id)
);