import { useState } from "react";
import { useNavigate, Link } from "react-router";

function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    contrasena: "",
  });

  const [error, setError] = useState("");

  const cambiar = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registrar = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const datos = await res.json();

      if (!res.ok) {
        throw new Error(datos.mensaje || "Error al registrar usuario");
      }

      navigate("/login");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1>Registro de usuarios</h1>

      <form onSubmit={registrar}>
        <div>
          <label>Nombre: </label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={cambiar}
            required
          />
        </div>

        <div>
          <label>Correo electrónico: </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={cambiar}
            required
          />
        </div>

        <div>
          <label>Contraseña: </label>
          <input
            type="password"
            name="contrasena"
            value={form.contrasena}
            onChange={cambiar}
            minLength={8}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Registrarse</button>
      </form>

      <p>
        ¿Ya tenés una cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </div>
  );
}

export default Registro;
