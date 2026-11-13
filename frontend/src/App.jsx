import { Routes, Route } from "react-router";

import Layout from "./Layout";
import AuthLayout from "./AuthLayout";
import Home from "./Home";
import Login from "./Login";
import Vehiculos from "./Vehiculos";
import Conductores from "./Conductores";
import Viajes from "./Viajes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />

        <Route element={<AuthLayout />}>
          <Route path="vehiculos" element={<Vehiculos />} />
          <Route path="conductores" element={<Conductores />} />
          <Route path="viajes" element={<Viajes />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
