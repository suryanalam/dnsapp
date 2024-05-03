import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./utils/ProtectedRoutes";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import HostedZones from "./pages/HostedZones";
import Records from "./pages/Records";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/hosted-zones" element={<HostedZones />} />
        <Route path="/records" element={<Records />} />
      </Route>
    </Routes>
  );
}

export default App;
