import { Link, Outlet } from "react-router";
import { useAuth } from "./Auth";

function Layout() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div>
      <header>
        <h2>Gestión de Transporte</h2>

        <nav>
          <Link to="/">Inicio</Link>
          <Link to="/vehiculos">Vehículos</Link>
          <Link to="/conductores">Conductores</Link>
          <Link to="/viajes">Viajes</Link>

          {isAuthenticated ? (
            <button onClick={logout}>Cerrar sesión</button>
          ) : (
            <Link to="/login">Ingresar</Link>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
