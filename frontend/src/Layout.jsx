import { Link, Outlet } from "react-router";

function Layout() {
  return (
    <div>
      <header>
        <h2>Gestión de Transporte</h2>

        <nav>
          <Link to="/">Inicio</Link>
          {" | "}
          <Link to="/vehiculos">Vehículos</Link>
          {" | "}
          <Link to="/conductores">Conductores</Link>
          {" | "}
          <Link to="/viajes">Viajes</Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
