import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { activities, subjects } from "../data/mockData";

export function ActivityFormPage() {
  const { activityId } = useParams();
  const activity = activities.find((item) => item.id === Number(activityId));
  const isEditing = Boolean(activity);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="page form-page" id="main-content">
      <header className="page-header">
        <div>
          <p className="eyebrow">Formulário estrutural</p>
          <h1>{isEditing ? "Editar atividade" : "Nova atividade"}</h1>
          <p>Preencha os campos que representarão uma obrigação acadêmica.</p>
        </div>
      </header>

      <section className="form-section" aria-labelledby="activity-form-title">
        <h2 className="visually-hidden" id="activity-form-title">
          Dados da atividade
        </h2>

        <form className="activity-form" onSubmit={handleSubmit} aria-describedby="form-note">
          <fieldset>
            <legend>Identificação</legend>

            <div className="form-grid">
              <div className="field field-wide">
                <label htmlFor="title">Título</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  defaultValue={activity?.title}
                  placeholder="Ex.: Trabalho API REST"
                />
              </div>

              <div className="field">
                <label htmlFor="subject">Disciplina</label>
                <select id="subject" name="subject" defaultValue={activity?.subject ?? ""}>
                  <option value="" disabled>
                    Selecione uma disciplina
                  </option>
                  {subjects.map((subject) => (
                    <option value={subject.name} key={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="category">Categoria</label>
                <select id="category" name="category" defaultValue={activity?.category ?? ""}>
                  <option value="" disabled>
                    Selecione uma categoria
                  </option>
                  <option value="Trabalho">Trabalho</option>
                  <option value="Exercício">Exercício</option>
                  <option value="Projeto">Projeto</option>
                  <option value="Prova">Prova</option>
                </select>
              </div>

              <div className="field field-wide">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  defaultValue={activity?.description}
                  placeholder="Descreva o que precisa ser realizado"
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Planejamento</legend>

            <div className="form-grid form-grid-three">
              <div className="field">
                <label htmlFor="dueDate">Prazo</label>
                <input id="dueDate" name="dueDate" type="date" defaultValue={activity?.dueDate} />
              </div>

              <div className="field">
                <label htmlFor="priority">Prioridade</label>
                <select id="priority" name="priority" defaultValue={activity?.priority ?? "MEDIUM"}>
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" defaultValue={activity?.status ?? "PENDING"}>
                  <option value="PENDING">Pendente</option>
                  <option value="COMPLETED">Concluída</option>
                </select>
              </div>
            </div>
          </fieldset>

          <p className="prototype-note" id="form-note">
            Protótipo visual: os dados preenchidos não serão salvos nesta etapa.
          </p>

          <footer className="form-actions">
            <Link className="secondary-link" to="/atividades">
              Cancelar
            </Link>
            <button className="primary-button" type="submit">
              Salvar atividade
            </button>
          </footer>
        </form>
      </section>
    </main>
  );
}
