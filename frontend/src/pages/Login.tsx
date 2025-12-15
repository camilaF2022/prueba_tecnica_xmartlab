import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import type { Token } from "../types";

export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.post<Token>("/auth/login/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      nav("/tasks");
    } catch {
      setErr("Inicio de sesión inválido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">Iniciar sesión</h2>
          </div>

          {err && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Usuario"
                autoComplete="username"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 text-white py-2.5 font-medium
                         hover:bg-slate-800 active:bg-slate-950 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Ingresando..." : "Entrar"}
            </button>
          </form>

          <p className="text-sm text-slate-600 mt-6 text-center">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="font-medium text-slate-900 hover:underline">
              Regístrate
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
