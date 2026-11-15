import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./Auth";

const inicial = {
  nombre: "",
  apellido: "",
  numero_documento: "",
  numero_licencia: "",
  fecha_alta_licencia: "",
  fecha_vencimiento_licencia: "",
};

function Conductores() {
  const { fetchAuth } = useAuth();
  const [conductores, setConductores] = useState([]);
  const [form, setForm] = useState(inicial);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState("");

  const cargarConductores = useCallback(async () => {
    try {
      const res = await fetchAuth("http://localhost:3000/conductores");
      if (!res.ok) throw new Error("Error al cargar conductores");
      setConductores(await res.json());
    } catch (e) {
      setError(e.message);
    }
  }, [fetchAuth]);

  useEffect(() => {
    cargarConductores();
  }, [cargarConductores]);

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError("");

    const url =
      editando !== null
        ? `http://localhost:3000/conductores/${editando}`
        : "http://localhost:3000/conductores";

    try {
      const res = await fetchAuth(url, {
        method: editando !== null ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const datos = await res.json();
      if (!res.ok) throw new Error(datos.mensaje);

      setForm(inicial);
      setEditando(null);
      await cargarConductores();
    } catch (e) {
      setError(e.message);
    }
  };

  const modificar = (c) => {
    setEditando(c.id);
    setForm({
      nombre: c.nombre,
      apellido: c.apellido,
      numero_documento: c.numero_documento,
      numero_licencia: c.numero_licencia,
      fecha_alta_licencia: c.fecha_alta_licencia.slice(0, 10),
      fecha_vencimiento_licencia: c.fecha_vencimiento_licencia.slice(0, 10),
    });
    setError("");
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar conductor?")) return;

    try {
      const res = await fetchAuth(`http://localhost:3000/conductores/${id}`, {
        method: "DELETE",
      });

      const datos = await res.json();
      if (!res.ok) throw new Error(datos.mensaje);

      setError("");
      if (editando === id) {
        setEditando(null);
        setForm(inicial);
      }
      await cargarConductores();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1>Gestión de conductores</h1>

      <div className="gestion-columnas">
        <section>
          <h2>
            {editando !== null ? "Modificar conductor" : "Registrar conductor"}
          </h2>

          <form onSubmit={guardar}>
            <div>
              <label>Nombre:</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={cambiar}
                required
              />
            </div>

            <div>
              <label>Apellido:</label>
              <input
                name="apellido"
                value={form.apellido}
                onChange={cambiar}
                required
              />
            </div>

            <div>
              <label>Documento:</label>
              <input
                name="numero_documento"
                value={form.numero_documento}
                onChange={cambiar}
                required
              />
            </div>

            <div>
              <label>Número de licencia:</label>
              <input
                name="numero_licencia"
                value={form.numero_licencia}
                onChange={cambiar}
                required
              />
            </div>

            <div>
              <label>Alta de licencia:</label>
              <input
                type="date"
                name="fecha_alta_licencia"
                value={form.fecha_alta_licencia}
                onChange={cambiar}
                required
              />
            </div>

            <div>
              <label>Vencimiento de licencia:</label>
              <input
                type="date"
                name="fecha_vencimiento_licencia"
                value={form.fecha_vencimiento_licencia}
                onChange={cambiar}
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
          <h2>Listado de conductores</h2>

          <div className="tabla-scroll">
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Documento</th>
                  <th>Licencia</th>
                  <th>Alta</th>
                  <th>Vencimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {conductores.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.nombre}</td>
                    <td>{c.apellido}</td>
                    <td>{c.numero_documento}</td>
                    <td>{c.numero_licencia}</td>
                    <td>{c.fecha_alta_licencia?.slice(0, 10)}</td>
                    <td>{c.fecha_vencimiento_licencia?.slice(0, 10)}</td>
                    <td>
                      <button onClick={() => modificar(c)}>Modificar</button>
                      <button onClick={() => eliminar(c.id)}>Eliminar</button>
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

export default Conductores;
