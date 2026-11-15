import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./Auth";

const inicial = {
  marca: "",
  modelo: "",
  patente: "",
  anio: "",
  capacidad_carga: "",
};

function Vehiculos() {
  const { fetchAuth } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [form, setForm] = useState(inicial);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState("");

  const cargarVehiculos = useCallback(async () => {
    try {
      const res = await fetchAuth("http://localhost:3000/vehiculos");
      if (!res.ok) throw new Error("Error al cargar vehículos");
      setVehiculos(await res.json());
    } catch (e) {
      setError(e.message);
    }
  }, [fetchAuth]);

  useEffect(() => {
    cargarVehiculos();
  }, [cargarVehiculos]);

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError("");

    const url =
      editando !== null
        ? `http://localhost:3000/vehiculos/${editando}`
        : "http://localhost:3000/vehiculos";

    try {
      const res = await fetchAuth(url, {
        method: editando !== null ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          anio: Number(form.anio),
          capacidad_carga: Number(form.capacidad_carga),
        }),
      });

      const datos = await res.json();
      if (!res.ok) throw new Error(datos.mensaje);

      setForm(inicial);
      setEditando(null);
      await cargarVehiculos();
    } catch (e) {
      setError(e.message);
    }
  };

  const modificar = (v) => {
    setEditando(v.id);
    setForm({
      marca: v.marca,
      modelo: v.modelo,
      patente: v.patente,
      anio: v.anio,
      capacidad_carga: v.capacidad_carga,
    });
    setError("");
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar vehículo?")) return;

    try {
      const res = await fetchAuth(`http://localhost:3000/vehiculos/${id}`, {
        method: "DELETE",
      });

      const datos = await res.json();
      if (!res.ok) throw new Error(datos.mensaje);

      setError("");
      if (editando === id) {
        setEditando(null);
        setForm(inicial);
      }
      await cargarVehiculos();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1>Gestión de vehículos</h1>

      <div className="gestion-columnas">
        <section>
          <h2>
            {editando !== null ? "Modificar vehículo" : "Registrar vehículo"}
          </h2>

          <form onSubmit={guardar}>
            <div>
              <label>Marca:</label>
              <input
                name="marca"
                value={form.marca}
                onChange={cambiar}
                required
              />
            </div>

            <div>
              <label>Modelo:</label>
              <input
                name="modelo"
                value={form.modelo}
                onChange={cambiar}
                required
              />
            </div>

            <div>
              <label>Patente:</label>
              <input
                name="patente"
                value={form.patente}
                onChange={cambiar}
                maxLength={20}
                required
              />
            </div>

            <div>
              <label>Año:</label>
              <input
                type="number"
                name="anio"
                value={form.anio}
                onChange={cambiar}
                min="1900"
                required
              />
            </div>

            <div>
              <label>Capacidad de carga:</label>
              <input
                type="number"
                name="capacidad_carga"
                value={form.capacidad_carga}
                onChange={cambiar}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <button type="submit">
              {editando !== null ? "Guardar cambios" : "Registrar"}
            </button>

            {editando !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditando(null);
                  setForm(inicial);
                }}
              >
                Cancelar
              </button>
            )}
          </form>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </section>

        <section>
          <h2>Listado de vehículos</h2>

          <div className="tabla-scroll">
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Patente</th>
                  <th>Año</th>
                  <th>Capacidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {vehiculos.map((v) => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.marca}</td>
                    <td>{v.modelo}</td>
                    <td>{v.patente}</td>
                    <td>{v.anio}</td>
                    <td>{v.capacidad_carga}</td>
                    <td>
                      <button onClick={() => modificar(v)}>Modificar</button>
                      <button onClick={() => eliminar(v.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Vehiculos;
