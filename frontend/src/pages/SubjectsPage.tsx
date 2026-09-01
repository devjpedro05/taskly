import { subjects } from "../data/mockData";

export function SubjectsPage() {
  return (
    <main className="page" id="main-content">
      <header className="page-header">
        <div>
          <p className="eyebrow">Organização por contexto</p>
          <h1>Disciplinas</h1>
          <p>Visualize as disciplinas e a quantidade demonstrativa de atividades associadas.</p>
        </div>
        <button
          className="primary-button"
          type="button"
          disabled
          title="Cadastro de disciplinas será implementado em uma etapa futura"
        >
          Nova disciplina
        </button>
      </header>

      <section className="content-section" aria-labelledby="subjects-title">
        <header className="section-header">
          <div>
            <p className="eyebrow">Dados demonstrativos</p>
            <h2 id="subjects-title">Disciplinas cadastradas</h2>
          </div>
          <span>{subjects.length} disciplinas</span>
        </header>

        <div className="subject-list">
          {subjects.map((subject) => (
            <article className="subject-item" key={subject.id}>
              <header>
                <p className="subject-index">{String(subject.id).padStart(2, "0")}</p>
                <div>
                  <h3>{subject.name}</h3>
                  <p>{subject.professor}</p>
                </div>
              </header>

              <dl>
                <div>
                  <dt>Atividades</dt>
                  <dd>{subject.activityCount}</dd>
                </div>
                <div>
                  <dt>Pendentes</dt>
                  <dd>{subject.pendingCount}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
