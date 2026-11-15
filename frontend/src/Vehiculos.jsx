import { useState, useEffect } from "react";
import { useAuth } from "./Auth";

function Vehiculos() {
  const { fetchAuth } = useAuth();

  const [vehiculos, setVehiculos] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerVehiculos = async () => {
      try {
        const respuesta = await fetchAuth("http://localhost:3000/vehiculos");

        if (!respuesta.ok) {
          throw new Error("Error al obtener los vehículos");
        }

        const datos = await respuesta.json();
        setVehiculos(datos);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerVehiculos();
  }, [fetchAuth]);

  return (
    <div>
      <h1>Listado de vehículos</h1>

      {cargando && <p>Cargando vehículos...</p>}

      {error && <p>{error}</p>}

      {!cargando && !error && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Patente</th>
              <th>Año</th>
              <th>Capacidad de carga</th>
            </tr>
          </thead>

          <tbody>
            {vehiculos.map((vehiculo) => (
              <tr key={vehiculo.id}>
                <td>{vehiculo.id}</td>
                <td>{vehiculo.marca}</td>
                <td>{vehiculo.modelo}</td>
                <td>{vehiculo.patente}</td>
                <td>{vehiculo.anio}</td>
                <td>{vehiculo.capacidad_carga}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Vehiculos;
