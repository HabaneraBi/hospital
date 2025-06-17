import express from "express";
import cors from "cors";
import departmentRoutes from "./routes/departaments";
import patientRoutes from "./routes/patients";
// Import other routes as needed

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/departments", departmentRoutes);
app.use("/api/patients", patientRoutes);
// Add other routes here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
