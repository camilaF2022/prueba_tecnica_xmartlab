import { Navigate, Route, Routes, Link, useNavigate, useLocation } from "react-router-dom";
import { isLoged, logout } from "./auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isLoged()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const nav = useNavigate();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";


  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link to="/tasks" className="text-lg font-semibold text-slate-900">
           Task Manager
          </Link>

          <nav className="flex items-center gap-3">
            {!isLoged() ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white
                             hover:bg-slate-800 transition"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  nav("/login");
                }}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700
                           hover:bg-slate-100 transition"
              >
                Cerrar sesión
              </button>
            )}
          </nav>
        </div>
      </header>

      <main
        className={`mx-auto max-w-5xl px-4 ${
          isAuthPage ? "h-[calc(100vh-64px)] overflow-hidden" : "py-6"
        }`}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Routes>
      </main>

    </div>
  );
}
