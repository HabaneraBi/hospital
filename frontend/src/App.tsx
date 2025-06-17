import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import PatientList from "./components/PatientList";
import DepartmentList from "./components/DepartmentList";
import EmployeeList from "./components/EmployeeList";
import DiseaseList from "./components/DiseaseList";
import WardList from "./components/WardList";

// Import other components

function App() {
  const location = useLocation();
  return (
    <div className="App">
      <nav>
        <Link
          className={`${location.pathname === "/patients" && "activeLink"}`}
          to="/patients"
        >
          Пациенты
        </Link>
        <Link
          className={`${location.pathname === "/departments" && "activeLink"}`}
          to="/departments"
        >
          Отделения
        </Link>
        <Link
          className={`${location.pathname === "/employees" && "activeLink"}`}
          to="/employees"
        >
          Сотрудники
        </Link>
        <Link
          className={`${location.pathname === "/wards" && "activeLink"}`}
          to="/wards"
        >
          Палаты
        </Link>
        <Link
          className={`${location.pathname === "/diseases" && "activeLink"}`}
          to="/diseases"
        >
          Заболевания
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/patients" replace />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/departments" element={<DepartmentList />} />
        <Route path="/wards" element={<WardList />} />
        <Route path="/diseases" element={<DiseaseList />} />
        <Route path="/employees" element={<EmployeeList />} />
        {/* Add other routes here */}
      </Routes>
    </div>
  );
}

export default App;
