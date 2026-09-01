import { Link } from "react-router-dom";
import { ActivityCard } from "../components/ActivityCard";
import { activities, subjects } from "../data/mockData";

export function ActivitiesPage() {
  return (
    <main className="page" id="main-content">
      <header className="page-header">
        <div>
          <p className="eyebrow">Organização acadêmica</p>
          <h1>Atividades</h1>
          <p>Consulte as atividades e visualize os controles previstos para pesquisa e filtros.</p>
        </div>
        <Link className="primary-link" to="/atividades/nova">
          Nova atividade
        </Link>
      </header>

      <section className="filter-section" aria-labelledby="filters-title">
        <header className="section-header compact">
          <div>
            <h2 id="filters-title">Pesquisa e filtros</h2>
            <p>Controles visuais sem filtragem funcional nesta etapa.</p>
          </div>
        </header>

        <form className="filter-form" role="search" onSubmit={(event) => event.preventDefault()}>
          <div className="field search-field">
            <label htmlFor="activity-search">Buscar atividade</label>
            <input
              id="activity-search"
              name="search"
              type="search"
              placeholder="Digite o título da atividade"
            />
          </div>

          <div className="field">
            <label htmlFor="status-filter">Status</label>
            <select id="status-filter" name="status" defaultValue="all">
              <option value="all">Todos</option>
              <option value="pending">Pendente</option>
              <option value="completed">Concluída</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="subject-filter">Disciplina</label>
            <select id="subject-filter" name="subject" defaultValue="all">
              <option value="all">Todas</option>
              {subjects.map((subject) => (
                <option value={subject.id} key={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="category-filter">Categoria</label>
            <select id="category-filter" name="category" defaultValue="all">
              <option value="all">Todas</option>
              <option value="work">Trabalho</option>
              <option value="exercise">Exercício</option>
              <option value="project">Projeto</option>
              <option value="exam">Prova</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="priority-filter">Prioridade</label>
            <select id="priority-filter" name="priority" defaultValue="all">
              <option value="all">Todas</option>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <button className="secondary-button" type="submit">
            Aplicar filtros
          </button>
        </form>
      </section>

      <section className="content-section" aria-labelledby="activities-title">
        <header className="section-header">
          <div>
            <p className="eyebrow">Dados demonstrativos</p>
            <h2 id="activities-title">Lista de atividades</h2>
          </div>
          <span>{activities.length} itens</span>
        </header>

        <div className="activity-list">
          {activities.map((activity) => (
            <ActivityCard activity={activity} key={activity.id} showActions />
          ))}
        </div>
      </section>
    </main>
  );
}
