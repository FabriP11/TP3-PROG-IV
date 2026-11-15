import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./Auth";

const inicial = {
  vehiculo_id: "",
  conductor_id: "",
  fecha_salida: "",
  fecha_llegada: "",
  origen: "",
  destino: "",
  kilometros: "",
  observaciones: "",
};

function Viajes() {
  const { fetchAuth } = useAuth();

  const [viajes, setViajes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [form, setForm] = useState(inicial);
  const [error, setError] = useState("");

  const [tipo, setTipo] = useState("vehiculo");
  const [idHistorial, setIdHistorial] = useState("");
  const [historial, setHistorial] = useState(null);

  const cargarDatos = useCallback(async () => {
    try {
      const [rv, rc, rviajes] = await Promise.all([
        fetchAuth("http://localhost:3000/vehiculos"),
        fetchAuth("http://localhost:3000/conductores"),
        fetchAuth("http://localhost:3000/viajes"),
      ]);

      if (!rv.ok || !rc.ok || !rviajes.ok) {
        throw new Error("Error al cargar los datos");
      }

      setVehiculos(await rv.json());
      setConductores(await rc.json());
      setViajes(await rviajes.json());
    } catch (e) {
      setError(e.message);
    }
  }, [fetchAuth]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetchAuth("http://localhost:3000/viajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          vehiculo_id: Number(form.vehiculo_id),
          conductor_id: Number(form.conductor_id),
          kilometros: Number(form.kilometros),
          fecha_salida: form.fecha_salida + ":00",
          fecha_llegada: form.fecha_llegada + ":00",
        }),
      });

      const datos = await res.json();
      if (!res.ok) throw new Error(datos.mensaje);

      setForm(inicial);
      setHistorial(null);
      await cargarDatos();
    } catch (e) {
      setError(e.message);
    }
  };

  const consultarHistorial = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetchAuth(
        `http://localhost:3000/viajes/${tipo}/${idHistorial}`,
      );

      if (!res.ok) throw new Error("Error al consultar historial");

      setHistorial(await res.json());
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1>Gestión de viajes</h1>

      <div className="gestion-columnas">
        {/* COLUMNA IZQUIERDA: REGISTRAR VIAJE */}
        <section>
          <h2>Registrar viaje</h2>

          <form onSubmit={guardar}>
            <div>
              <label>Vehículo:</label>
              <select
                name="vehiculo_id"
                value={form.vehiculo_id}
                onChange={cambiar}
                required
              >
                <option value="">Seleccionar vehículo</option>
                {vehiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.marca} {v.modelo} - {v.patente}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Conductor:</label>
              <select
                name="conductor_id"
                value={form.conductor_id}
                onChange={cambiar}
                required
              >
                <option value="">Seleccionar conductor</option>
                {conductores.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} {c.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Fecha de salida:</label>
              <input
                type="datetime-local"
                name="fecha_salida"
                value={form.fecha_salida}
                onChange={cambiar}
                required
              />
            </div>

            <div>
              <label>Fecha de llegada:</label>
              <input
                type="datetime-local"
                name="fecha_llegada"
                value={form.fecha_llegada}
                onChange={cambiar}
                required
              />
            </div>

            <div>
              <label>Origen:</label>
              <input
                name="origen"
                value={form.origen}
                onChange={cambiar}
                required
              />
            </div>

            <div>
              <label>Destino:</label>
              <input
                name="destino"
                value={form.destino}
                onChange={cambiar}
                required
              />
            </div>

            <div>
              <label>Kilómetros:</label>
              <input
                type="number"
                name="kilometros"
                value={form.kilometros}
                onChange={cambiar}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div>
              <label>Observaciones:</label>
              <input
                name="observaciones"
                value={form.observaciones}
                onChange={cambiar}
              />
            </div>

            <button type="submit">Registrar viaje</button>
          </form>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </section>

        {/* COLUMNA DERECHA: LISTADO E HISTORIAL */}
        <section>
          <h2>Listado de viajes</h2>

          <div className="tabla-scroll">
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vehículo</th>
                  <th>Conductor</th>
                  <th>Salida</th>
                  <th>Llegada</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Km</th>
                </tr>
              </thead>

              <tbody>
                {viajes.map((v) => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>
                      {v.marca} {v.modelo}
                    </td>
                    <td>
                      {v.conductor_nombre} {v.conductor_apellido}
                    </td>
                    <td>{v.fecha_salida?.slice(0, 16).replace("T", " ")}</td>
                    <td>{v.fecha_llegada?.slice(0, 16).replace("T", " ")}</td>
                    <td>{v.origen}</td>
                    <td>{v.destino}</td>
                    <td>{v.kilometros}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* HISTORIAL DEBAJO DEL LISTADO */}
          <h2>Historial de viajes</h2>

          <form onSubmit={consultarHistorial}>
            <div>
              <label>Consultar por:</label>
              <select
                value={tipo}
                onChange={(e) => {
                  setTipo(e.target.value);
                  setIdHistorial("");
                  setHistorial(null);
                }}
              >
                <option value="vehiculo">Vehículo</option>
                <option value="conductor">Conductor</option>
              </select>
            </div>

            <div>
              <label>Seleccionar:</label>
              <select
                value={idHistorial}
                onChange={(e) => setIdHistorial(e.target.value)}
                required
              >
                <option value="">Seleccionar</option>

                {tipo === "vehiculo"
                  ? vehiculos.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.marca} {v.modelo} - {v.patente}
                      </option>
                    ))
                  : conductores.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} {c.apellido}
                      </option>
                    ))}
              </select>
            </div>

            <button type="submit">Consultar</button>
          </form>

          {historial && (
            <div>
              <h3>Total de kilómetros: {historial.total_kilometros} km</h3>

              <ul>
                {historial.viajes.map((v) => (
                  <li key={v.id}>
                    {v.origen} - {v.destino}: {v.kilometros} km
                  </li>
                ))}
              </ul>

              {historial.viajes.length === 0 && (
                <p>No hay viajes registrados.</p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Viajes;
