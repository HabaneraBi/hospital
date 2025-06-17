import express from "express";
import cors from "cors";
import departmentRoutes from "./routes/departaments";
import patientRoutes from "./routes/patients";
import wardRoutes from "./routes/wards";
import employeeRoutes from "./routes/employees";
import diseaseRoutes from "./routes/diseases";
import diseaseCategoryRoutes from "./routes/disease-categories";
// Import other routes as needed

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/departments", departmentRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/wards", wardRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/diseases", diseaseRoutes);
app.use("/api/disease-categories", diseaseCategoryRoutes);
// Add other routes here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
