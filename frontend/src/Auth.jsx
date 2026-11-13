import { createContext, useCallback, useContext, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, contrasena) => {
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contrasena }),
      });

      if (!response.ok) {
        setError("Credenciales incorrectas");
        return false;
      }

      const datos = await response.json();
      setToken(datos.token);

      return true;
    } catch (error) {
      console.error(error);
      setError("Error al conectar con el servidor");
      return false;
    }
  }, []);

  const logout = () => {
    setToken(null);
    setError(null);
  };

  const fetchAuth = useCallback(
    (url, options = {}) => {
      if (!token) {
        throw new Error("No hay una sesión iniciada");
      }

      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    },
    [token],
  );

  return (
    <AuthContext.Provider
      value={{
        token,
        error,
        login,
        logout,
        fetchAuth,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
