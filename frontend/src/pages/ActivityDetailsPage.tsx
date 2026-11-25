import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getActivity, deleteActivity } from "../services/activityService";
import {
  getSubtasks,
  createSubtask,
  updateSubtask,
  deleteSubtask,
} from "../services/subtaskService";
import { ActivityCard } from "../components/ActivityCard";
import type { Activity, Subtask } from "../types/domain";
export function ActivityDetailsPage() {
  const id = Number(useParams().activityId),
    navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null),
    [subtasks, setSubtasks] = useState<Subtask[]>([]),
    [title, setTitle] = useState("");
  const [error, setError] = useState(""),
    [success, setSuccess] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    Promise.all([getActivity(id), getSubtasks(id)])
      .then(([a, s]) => {
        setActivity(a);
        setSubtasks(s);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [id]);
  async function add(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await createSubtask(id, title);
      setTitle("");
      setSubtasks(await getSubtasks(id));
      setSuccess("Subtarefa adicionada.");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function change(sub: Subtask, remove = false) {
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      if (remove) await deleteSubtask(id, sub.id);
      else await updateSubtask(id, sub.id, { completed: !sub.completed });
      setSubtasks(await getSubtasks(id));
      setSuccess(remove ? "Subtarefa excluída." : "Subtarefa atualizada.");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    setError("");
    setBusy(true);
    try {
      await deleteActivity(id);
      navigate("/atividades");
    } catch (error) {
      setError((error as Error).message);
      setBusy(false);
    }
  }
  return (
    <main className="page" id="main-content">
      <header className="page-header">
        <div>
          <p className="eyebrow">Atividade e etapas</p>
          <h1>Detalhes da atividade</h1>
        </div>
        <Link className="secondary-link" to="/atividades">
          Voltar
        </Link>
      </header>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status">Carregando...</p>
      ) : (
        activity && (
          <>
            <ActivityCard activity={activity} />
            <div className="activity-actions">
              <Link
                className="primary-link"
                to={"/atividades/" + id + "/editar"}
              >
                Editar atividade
              </Link>
              <button
                className="secondary-button"
                disabled={busy}
                onClick={remove}
              >
                Excluir atividade
              </button>
            </div>
            <section className="content-section">
              <h2>Subtarefas</h2>
              <form className="reference-form" onSubmit={add}>
                <div className="field">
                  <label htmlFor="subtask-title">Título da subtarefa</label>
                  <input
                    id="subtask-title"
                    required
                    maxLength={200}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <button className="primary-button" disabled={busy}>
                  Adicionar subtarefa
                </button>
              </form>
              {success && (
                <p className="form-success" role="status">
                  {success}
                </p>
              )}
              {subtasks.length === 0 && <p>Nenhuma subtarefa cadastrada.</p>}
              <ul className="subtask-list">
                {subtasks.map((sub) => (
                  <li key={sub.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        disabled={busy}
                        onChange={() => change(sub)}
                      />{" "}
                      {sub.title}
                    </label>
                    <button
                      className="secondary-button"
                      disabled={busy}
                      onClick={() => change(sub, true)}
                    >
                      Excluir subtarefa
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )
      )}
    </main>
  );
}
