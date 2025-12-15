import { useEffect, useState } from "react";
import api from "../api";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  created_at: string;
};

type TaskPayload = {
  title: string;
  description: string;
  status: TaskStatus;
};

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "TODO", label: "Incompleta" },
  { value: "IN_PROGRESS", label: "En progreso" },
  { value: "DONE", label: "Realizada" },
];

function statusBadgeClasses(status: TaskStatus) {
  switch (status) {
    case "TODO":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "DONE":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function statusLabel(status: TaskStatus) {
  return statusOptions.find((s) => s.value === status)?.label ?? status;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Drawer/Panel state
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"view" | "create" | "edit">("view");
  const [selected, setSelected] = useState<Task | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [saving, setSaving] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get<Task[]>("/tasks/");
      setTasks(res.data);
    } catch {
      setErr("No se pudieron cargar tus tareas. ¿Estás logueado?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const closePanel = () => {
    setOpen(false);
    setSelected(null);
    setTitle("");
    setDescription("");
    setStatus("TODO");
    setErr("");
    setSaving(false);
  };

  const openCreate = () => {
    setMode("create");
    setSelected(null);
    setTitle("");
    setDescription("");
    setStatus("TODO");
    setErr("");
    setOpen(true);
  };

  const openEdit = (t: Task) => {
    setMode("edit");
    setSelected(t);
    setTitle(t.title);
    setDescription(t.description ?? "");
    setStatus(t.status);
    setErr("");
    setOpen(true);
  };

  const openView = (t: Task) => {
  setMode("view");
  setSelected(t);
  setTitle(t.title);
  setDescription(t.description ?? "");
  setStatus(t.status);
  setOpen(true);
};


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    const payload: TaskPayload = {
      title: title.trim(),
      description,
      status,
    };

    if (!payload.title) {
      setErr("El título no puede estar vacío.");
      return;
    }

    setSaving(true);
    try {
      if (mode === "create") {
        const res = await api.post<Task>("/tasks/", payload);
        setTasks((prev) => [res.data, ...prev]); 
      } else {
        if (!selected) return;
        const res = await api.put<Task>(`/tasks/${selected.id}/`, payload);
        setTasks((prev) => prev.map((x) => (x.id === selected.id ? res.data : x)));
      }
      closePanel();
    } catch {
      setErr("No se pudo guardar la tarea. Revisa los datos.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!selected) return;
    const ok = confirm("¿Eliminar esta tarea?");
    if (!ok) return;

    setSaving(true);
    setErr("");
    try {
      await api.delete(`/tasks/${selected.id}/`);
      setTasks((prev) => prev.filter((x) => x.id !== selected.id));
      closePanel();
    } catch {
      setErr("No se pudo eliminar la tarea.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Mis tareas</h2>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-slate-900 text-white px-4 py-2.5 font-medium hover:bg-slate-800"
          >
            Añadir nueva tarea
          </button>
        </div>

        {err && !open && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        {/* LISTA */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Lista de mis tareas</h3>
          </div>

          {loading ? (
            <p className="text-slate-600">Cargando...</p>
          ) : tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
              <p className="text-slate-700 font-medium">Aún no tienes tareas</p>
            </div>
          ) : (
            <ul className="grid gap-3">
              {tasks.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => openView(t)}
                    className="w-full text-left rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900 truncate">{t.title}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${statusBadgeClasses(t.status)}`}
                          >
                            {statusLabel(t.status)}
                          </span>
                        </div>

                        {t.description ? (
                          <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                            {t.description}
                          </p>
                        ) : (
                          <p className="text-sm text-slate-400 mt-2 italic">Sin descripción</p>
                        )}

                        <p className="text-xs text-slate-400 mt-3">
                          Creada: {new Date(t.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {/* Editar */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); 
                            openEdit(t);
                          }}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                          title="Editar"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.313 3 21l1.687-4.5L16.862 3.487z"
                            />
                          </svg>
                        </button>

                        {/* Eliminar */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); 
                            setSelected(t);
                            onDelete();
                          }}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700"
                          title="Eliminar"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 7h12M9 7V4h6v3m-8 4v6m4-6v6m4-6v6M5 7l1 13h12l1-13"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
              aria-label="Cerrar"
              className="absolute inset-0 bg-black/30"
              onClick={closePanel}
            />

            <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-lg p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {mode === "create" ? "Nueva tarea" : "Editar tarea"}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {mode === "create"
                      ? "Completa los campos para crear una tarea."
                      : "Modifica los campos y guarda los cambios."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closePanel}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Cerrar
                </button>
              </div>

              {err && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {err}
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                  <input
                    value={title}
                    disabled={mode === "view"}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2
                               focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    placeholder="Título de la tarea"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                  <select
                    value={status}
                    disabled={mode === "view"}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white
                               focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  >
                    {statusOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={description}
                    disabled={mode === "view"}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2
                               focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    placeholder="Opcional"
                  />
                </div>

               <div className="flex items-center justify-between gap-3 pt-2">
                {(mode === "create" || mode === "edit") && (
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-slate-900 text-white px-4 py-2.5 font-medium justify-center flex-1
                              hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? "Guardando..." : mode === "create" ? "Crear tarea" : "Guardar cambios"}
                  </button>
                )}

                {mode === "view" && (
                  <button
                    type="button"
                    onClick={() => openEdit(selected!)}
                    className="rounded-xl bg-slate-900 text-white px-4 py-2.5 font-medium justify-center flex-1 hover:bg-slate-800"
                  >
                    Editar
                  </button>
                )}
              </div>


              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
