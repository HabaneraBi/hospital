import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PatientList from "./components/PatientList";
// Import other components

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/patients">Patients</Link>
          <Link to="/departments">Departments</Link>
          <Link to="/employees">Employees</Link>
          <Link to="/wards">Wards</Link>
        </nav>

        <Routes>
          <Route path="/patients" element={<PatientList />} />
          {/* Add other routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
