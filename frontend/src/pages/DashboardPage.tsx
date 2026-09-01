import { Link } from "react-router-dom";
import { ActivityCard } from "../components/ActivityCard";
import { activities, summary } from "../data/mockData";

export function DashboardPage() {
  return (
    <main className="page" id="main-content">
      <header className="page-header">
        <div>
          <p className="eyebrow">Visão geral</p>
          <h1>Dashboard</h1>
          <p>Organize suas atividades acadêmicas e acompanhe os próximos prazos.</p>
        </div>
        <Link className="secondary-link" to="/atividades">
          Ver todas as atividades
        </Link>
      </header>

      <section className="summary-section" aria-labelledby="summary-title">
        <h2 id="summary-title">Resumo das atividades</h2>
        <div className="summary-list">
          {summary.map((item) => (
            <article className="summary-item" key={item.label}>
              <p>{item.label}</p>
              <strong>{String(item.value).padStart(2, "0")}</strong>
            </article>
          ))}
        </div>
        <p className="prototype-caption">Dados estáticos utilizados para representar o protótipo.</p>
      </section>

      <section className="content-section" aria-labelledby="upcoming-title">
        <header className="section-header">
          <div>
            <p className="eyebrow">Agenda</p>
            <h2 id="upcoming-title">Próximas atividades</h2>
          </div>
          <span>{activities.length} atividades demonstrativas</span>
        </header>

        <div className="activity-list">
          {activities.slice(0, 2).map((activity) => (
            <ActivityCard activity={activity} key={activity.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
