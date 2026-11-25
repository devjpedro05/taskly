import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getActivity,
  createActivity,
  updateActivity,
} from "../services/activityService";
import { getSubjects } from "../services/subjectService";
import { getCategories } from "../services/categoryService";
import type { Activity, Subject, Category, NewActivity } from "../types/domain";
export function ActivityFormPage() {
  const { activityId } = useParams(),
    id = Number(activityId);
  const [activity, setActivity] = useState<Activity | null>(null),
    [subjects, setSubjects] = useState<Subject[]>([]),
    [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true),
    [loadError, setLoadError] = useState(""),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(""),
    [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    Promise.all([
      getSubjects(),
      getCategories(),
      activityId ? getActivity(id) : Promise.resolve(null),
    ])
      .then(([s, c, a]) => {
        setSubjects(s);
        setCategories(c);
        setActivity(a);
      })
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, [activityId, id]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setSuccess("");
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim(),
      subjectId = Number(form.get("subjectId")),
      categoryId = Number(form.get("categoryId")),
      dueDate = String(form.get("dueDate") ?? "");
    const invalid: Record<string, string> = {};
    if (!title) invalid.title = "Título é obrigatório.";
    if (!subjectId) invalid.subjectId = "Selecione uma disciplina.";
    if (!categoryId) invalid.categoryId = "Selecione uma categoria.";
    if (!dueDate) invalid.dueDate = "Informe o prazo.";
    setErrors(invalid);
    if (Object.keys(invalid).length) return;
    const data: NewActivity = {
      title,
      subjectId,
      categoryId,
      dueDate,
      description: String(form.get("description") ?? ""),
      priority: form.get("priority") as NewActivity["priority"],
      status: form.get("status") as NewActivity["status"],
    };
    setBusy(true);
    try {
      const saved = activityId
        ? await updateActivity(id, data)
        : await createActivity(data);
      setActivity(saved);
      setSuccess(
        activityId ? "Atividade atualizada." : "Atividade cadastrada.",
      );
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function feedback(field: string) {
    return errors[field] ? (
      <p className="field-error" id={field + "-error"}>
        {errors[field]}
      </p>
    ) : null;
  }
  return (
    <main className="page form-page" id="main-content">
      <header className="page-header">
        <div>
          <p className="eyebrow">Planejamento</p>
          <h1>{activityId ? "Editar atividade" : "Nova atividade"}</h1>
          <p>Informe os dados da obrigação acadêmica.</p>
        </div>
      </header>
      {loading ? (
        <p role="status">Carregando formulário...</p>
      ) : loadError ? (
        <p role="alert" className="form-error">
          {loadError}
        </p>
      ) : (
        <>
          {(!subjects.length || !categories.length) && (
            <p className="prototype-note">
              Cadastre uma <Link to="/disciplinas">disciplina</Link> e uma{" "}
              <Link to="/categorias">categoria</Link> antes de salvar.
            </p>
          )}
          <form className="activity-form" onSubmit={submit} noValidate>
            <fieldset>
              <legend>Identificação</legend>
              <div className="form-grid">
                <div className="field field-wide">
                  <label htmlFor="title">Título</label>
                  <input
                    id="title"
                    name="title"
                    maxLength={200}
                    defaultValue={activity?.title}
                    aria-invalid={Boolean(errors.title)}
                    aria-describedby={errors.title ? "title-error" : undefined}
                  />
                  {feedback("title")}
                </div>
                <div className="field">
                  <label htmlFor="subjectId">Disciplina</label>
                  <select
                    id="subjectId"
                    name="subjectId"
                    defaultValue={activity?.subjectId ?? ""}
                    aria-invalid={Boolean(errors.subjectId)}
                    aria-describedby={
                      errors.subjectId ? "subjectId-error" : undefined
                    }
                  >
                    <option value="">Selecione uma disciplina</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {feedback("subjectId")}
                </div>
                <div className="field">
                  <label htmlFor="categoryId">Categoria</label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    defaultValue={activity?.categoryId ?? ""}
                    aria-invalid={Boolean(errors.categoryId)}
                    aria-describedby={
                      errors.categoryId ? "categoryId-error" : undefined
                    }
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {feedback("categoryId")}
                </div>
                <div className="field field-wide">
                  <label htmlFor="description">Descrição</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    maxLength={10000}
                    defaultValue={activity?.description}
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
                    aria-describedby={
                      errors.dueDate ? "dueDate-error" : undefined
                    }
                  />
                  {feedback("dueDate")}
                </div>
                <div className="field">
                  <label htmlFor="priority">Prioridade</label>
                  <select
                    id="priority"
                    name="priority"
                    defaultValue={activity?.priority ?? "MEDIUM"}
                  >
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={activity?.status ?? "PENDING"}
                  >
                    <option value="PENDING">Pendente</option>
                    <option value="COMPLETED">Concluída</option>
                  </select>
                </div>
              </div>
            </fieldset>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className="form-success" role="status">
                {success}{" "}
                <Link to={"/atividades/" + activity?.id}>Ver detalhes</Link>
              </p>
            )}
            <footer className="form-actions">
              <Link className="secondary-link" to="/atividades">
                Cancelar
              </Link>
              <button className="primary-button" disabled={busy}>
                {busy ? "Salvando..." : "Salvar atividade"}
              </button>
            </footer>
          </form>
        </>
      )}
    </main>
  );
}
