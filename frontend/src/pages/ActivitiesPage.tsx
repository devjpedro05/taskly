import { type ChangeEvent, type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ActivityCard } from "../components/ActivityCard";
import { activities, subjects } from "../data/mockData";

function getItemsLabel(count: number) {
  return `${count} ${count === 1 ? "item" : "itens"}`;
}

export function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(normalizedSearch);
    const matchesStatus = statusFilter === "all" || activity.status === statusFilter;
    const matchesSubject = subjectFilter === "all" || activity.subject === subjectFilter;
    const matchesCategory = categoryFilter === "all" || activity.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || activity.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesSubject &&
      matchesCategory &&
      matchesPriority
    );
  });

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function clearFilters() {
    setSearchTerm("");
    setStatusFilter("all");
    setSubjectFilter("all");
    setCategoryFilter("all");
    setPriorityFilter("all");
  }

  return (
    <main className="page" id="main-content">
      <header className="page-header">
        <div>
          <p className="eyebrow">Organização acadêmica</p>
          <h1>Atividades</h1>
          <p>Consulte, pesquise e filtre as atividades acadêmicas cadastradas.</p>
        </div>
        <Link className="primary-link" to="/atividades/nova">
          Nova atividade
        </Link>
      </header>

      <section className="filter-section" aria-labelledby="filters-title">
        <header className="section-header compact">
          <div>
            <h2 id="filters-title">Pesquisa e filtros</h2>
            <p>Os resultados são atualizados conforme os controles são alterados.</p>
          </div>
        </header>

        <form className="filter-form" role="search" onSubmit={handleFilterSubmit}>
          <div className="field search-field">
            <label htmlFor="activity-search">Buscar atividade</label>
            <input
              id="activity-search"
              name="search"
              type="search"
              placeholder="Digite o título da atividade"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="field">
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              name="status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">Todos</option>
              <option value="PENDING">Pendente</option>
              <option value="COMPLETED">Concluída</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="subject-filter">Disciplina</label>
            <select
              id="subject-filter"
              name="subject"
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
            >
              <option value="all">Todas</option>
              {subjects.map((subject) => (
                <option value={subject.name} key={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="category-filter">Categoria</label>
            <select
              id="category-filter"
              name="category"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="all">Todas</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Exercício">Exercício</option>
              <option value="Projeto">Projeto</option>
              <option value="Prova">Prova</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="priority-filter">Prioridade</label>
            <select
              id="priority-filter"
              name="priority"
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
            >
              <option value="all">Todas</option>
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>

          <button
            className="secondary-button clear-filters-button"
            type="button"
            onClick={clearFilters}
          >
            Limpar filtros
          </button>
        </form>
      </section>

      <section className="content-section" aria-labelledby="activities-title">
        <header className="section-header">
          <div>
            <p className="eyebrow">Dados demonstrativos</p>
            <h2 id="activities-title">Lista de atividades</h2>
          </div>
          <span aria-live="polite">{getItemsLabel(filteredActivities.length)}</span>
        </header>

        <div className="activity-list">
          {filteredActivities.length === 0 ? (
            <div className="empty-state" role="status">
              <h3>Nenhuma atividade encontrada.</h3>
              <p>Tente alterar a pesquisa ou os filtros aplicados.</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <ActivityCard activity={activity} key={activity.id} showActions />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
