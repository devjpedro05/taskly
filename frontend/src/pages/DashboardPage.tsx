import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getActivities } from "../services/activityService";
import { ActivityCard } from "../components/ActivityCard";
import type { Activity } from "../types/domain";
export function DashboardPage() {
  const [activities, setActivities] = useState<Activity[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    getActivities()
      .then(setActivities)
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);
  const now = new Date(),
    today = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");
  const pending = activities.filter((a) => a.status === "PENDING");
  const upcoming = pending
    .filter((a) => a.dueDate >= today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);
  const summary = [
    ["Pendentes", pending.length],
    ["Concluídas", activities.length - pending.length],
    ["Atrasadas", pending.filter((a) => a.dueDate < today).length],
  ];
  return (
    <main className="page" id="main-content">
      <header className="page-header">
        <div>
          <p className="eyebrow">Visão geral</p>
          <h1>Dashboard</h1>
          <p>Suas atividades acadêmicas e próximos prazos.</p>
        </div>
        <Link className="primary-link" to="/atividades/nova">
          Nova atividade
        </Link>
      </header>
      {loading ? (
        <p role="status">Carregando atividades...</p>
      ) : error ? (
        <p role="alert" className="form-error">
          {error}
        </p>
      ) : (
        <>
          <section
            className="summary-section"
            aria-label="Resumo das atividades"
          >
            <div className="summary-list">
              {summary.map(([label, count]) => (
                <article className="summary-item" key={label}>
                  <p>{label}</p>
                  <strong>{count}</strong>
                </article>
              ))}
            </div>
          </section>
          <section className="content-section">
            <h2>Próximas atividades</h2>
            <div className="activity-list">
              {upcoming.map((a) => (
                <ActivityCard activity={a} key={a.id} />
              ))}
              {upcoming.length === 0 && (
                <p className="empty-state">
                  Nenhuma atividade futura pendente.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
