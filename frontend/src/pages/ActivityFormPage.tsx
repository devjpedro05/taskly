import { type FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { activities, subjects } from "../data/mockData";

interface FormErrors {
  title?: string;
  subject?: string;
  category?: string;
  dueDate?: string;
}

function validateForm(formData: FormData) {
  const validationErrors: FormErrors = {};
  const title = String(formData.get("title") ?? "").trim();
  const subject = String(formData.get("subject") ?? "");
  const category = String(formData.get("category") ?? "");
  const dueDate = String(formData.get("dueDate") ?? "");

  if (!title) {
    validationErrors.title = "Título é obrigatório.";
  }

  if (!subject) {
    validationErrors.subject = "Selecione uma disciplina.";
  }

  if (!category) {
    validationErrors.category = "Selecione uma categoria.";
  }

  if (!dueDate) {
    validationErrors.dueDate = "Informe o prazo.";
  }

  return validationErrors;
}

export function ActivityFormPage() {
  const { activityId } = useParams();
  const activity = activities.find((item) => item.id === Number(activityId));
  const isEditing = Boolean(activity);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const validationErrors = validateForm(formData);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSuccessMessage("");
      return;
    }

    setSuccessMessage("Formulário validado com sucesso.");
  }

  return (
    <main className="page form-page" id="main-content">
      <header className="page-header">
        <div>
          <p className="eyebrow">Formulário de atividade</p>
          <h1>{isEditing ? "Editar atividade" : "Nova atividade"}</h1>
          <p>Preencha os campos que representarão uma obrigação acadêmica.</p>
        </div>
      </header>

      <section className="form-section" aria-labelledby="activity-form-title">
        <h2 className="visually-hidden" id="activity-form-title">
          Dados da atividade
        </h2>

        <form
          className="activity-form"
          onSubmit={handleSubmit}
          aria-describedby="form-note"
          noValidate
        >
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
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? "title-error" : undefined}
                />
                {errors.title && (
                  <p className="field-error" id="title-error">
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="field">
                <label htmlFor="subject">Disciplina</label>
                <select
                  id="subject"
                  name="subject"
                  defaultValue={activity?.subject ?? ""}
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                >
                  <option value="" disabled>
                    Selecione uma disciplina
                  </option>
                  {subjects.map((subject) => (
                    <option value={subject.name} key={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="field-error" id="subject-error">
                    {errors.subject}
                  </p>
                )}
              </div>

              <div className="field">
                <label htmlFor="category">Categoria</label>
                <select
                  id="category"
                  name="category"
                  defaultValue={activity?.category ?? ""}
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={errors.category ? "category-error" : undefined}
                >
                  <option value="" disabled>
                    Selecione uma categoria
                  </option>
                  <option value="Trabalho">Trabalho</option>
                  <option value="Exercício">Exercício</option>
                  <option value="Projeto">Projeto</option>
                  <option value="Prova">Prova</option>
                </select>
                {errors.category && (
                  <p className="field-error" id="category-error">
                    {errors.category}
                  </p>
                )}
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
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  defaultValue={activity?.dueDate}
                  aria-invalid={Boolean(errors.dueDate)}
                  aria-describedby={errors.dueDate ? "due-date-error" : undefined}
                />
                {errors.dueDate && (
                  <p className="field-error" id="due-date-error">
                    {errors.dueDate}
                  </p>
                )}
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
            Nesta etapa, o formulário valida os campos obrigatórios, mas não salva os dados.
          </p>

          {successMessage && (
            <div className="form-success" role="status">
              <p>
                <strong>{successMessage}</strong>
              </p>
              <p>Os dados não são persistidos nesta etapa.</p>
            </div>
          )}

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
