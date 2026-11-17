import { type FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { activities, subjects } from "../data/mockData";
import { createActivity } from "../services/activityService";
import type { ActivityPriority, ActivityStatus, NewActivity } from "../types/domain";

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

function formatDueDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function ActivityFormPage() {
  const { activityId } = useParams();
  const activity = activities.find((item) => item.id === Number(activityId));
  const isEditing = Boolean(activityId);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setSubmitError("");
    setSuccessMessage("");
    const formData = new FormData(event.currentTarget);
    const validationErrors = validateForm(formData);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (isEditing) {
      setSuccessMessage("Formulário validado com sucesso. A edição permanece demonstrativa.");
      return;
    }

    const dueDate = String(formData.get("dueDate") ?? "");
    const newActivity: NewActivity = {
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      subject: String(formData.get("subject") ?? ""),
      category: String(formData.get("category") ?? ""),
      dueDate,
      dueDateLabel: formatDueDate(dueDate),
      priority: String(formData.get("priority")) as ActivityPriority,
      status: String(formData.get("status")) as ActivityStatus,
    };

    setIsSubmitting(true);

    try {
      await createActivity(newActivity);
      setSuccessMessage("Atividade enviada com sucesso.");
    } catch {
      setSubmitError("Não foi possível enviar a atividade.");
    } finally {
      setIsSubmitting(false);
    }
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
            {isEditing
              ? "Edição demonstrativa: os dados locais são usados para pré-preenchimento. Alterações não são enviadas ao serviço."
              : "O cadastro envia os dados à API Taskly."}
            {isEditing && !activity && " Esta atividade não possui dados locais para pré-preenchimento."}
          </p>

          {submitError && (
            <p className="form-error" role="alert">{submitError}</p>
          )}

          {successMessage && (
            <div className="form-success" role="status">
              <p>
                <strong>{successMessage}</strong>
              </p>
              {!isEditing && <p>A atividade fica disponível até o servidor ser reiniciado.</p>}
            </div>
          )}

          <footer className="form-actions">
            <Link className="secondary-link" to="/atividades">
              Cancelar
            </Link>
            <button className="primary-button" type="submit" disabled={isSubmitting || (isEditing && !activity)}>
              {isSubmitting ? "Enviando..." : isEditing ? "Validar edição" : "Salvar atividade"}
            </button>
          </footer>
        </form>
      </section>
    </main>
  );
}
