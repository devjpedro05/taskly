import { useEffect, useState, type FormEvent } from "react";
import {
  getSubjects,
  saveSubject,
  deleteSubject,
} from "../services/subjectService";
import {
  getCategories,
  saveCategory,
  deleteCategory,
} from "../services/categoryService";
import type { Subject, Category } from "../types/domain";
export function ReferenceManager({
  kind,
}: {
  kind: "subjects" | "categories";
}) {
  const isSubject = kind === "subjects",
    title = isSubject ? "Disciplinas" : "Categorias";
  const [items, setItems] = useState<(Subject | Category)[]>([]),
    [loading, setLoading] = useState(true);
  const [id, setId] = useState<number | null>(null),
    [name, setName] = useState(""),
    [professor, setProfessor] = useState("");
  const [error, setError] = useState(""),
    [success, setSuccess] = useState(""),
    [busy, setBusy] = useState(false);
  async function load() {
    setLoading(true);
    try {
      setItems(await (isSubject ? getSubjects() : getCategories()));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [kind]);
  function reset() {
    setId(null);
    setName("");
    setProfessor("");
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      if (isSubject) await saveSubject(id, name, professor);
      else await saveCategory(id, name);
      reset();
      await load();
      setSuccess("Registro salvo.");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(value: number) {
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      if (isSubject) await deleteSubject(value);
      else await deleteCategory(value);
      if (id === value) reset();
      await load();
      setSuccess("Registro excluído.");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="page" id="main-content">
      <header className="page-header">
        <div>
          <p className="eyebrow">Organização acadêmica</p>
          <h1>{title}</h1>
          <p>Gerencie os registros usados nas suas atividades.</p>
        </div>
      </header>
      <section className="form-section">
        <h2>{id ? "Editar registro" : "Novo registro"}</h2>
        <form className="reference-form" onSubmit={submit}>
          <div className="field">
            <label htmlFor="reference-name">Nome</label>
            <input
              id="reference-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={200}
            />
          </div>
          {isSubject && (
            <div className="field">
              <label htmlFor="professor">Professor</label>
              <input
                id="professor"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                maxLength={200}
              />
            </div>
          )}
          <button className="primary-button" disabled={busy}>
            {busy ? "Salvando..." : "Salvar"}
          </button>
          {id && (
            <button type="button" className="secondary-button" onClick={reset}>
              Cancelar edição
            </button>
          )}
        </form>
      </section>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="form-success" role="status">
          {success}
        </p>
      )}
      {loading ? (
        <p role="status">Carregando...</p>
      ) : (
        <section className="subject-list" aria-label={title}>
          {items.length === 0 && (
            <p className="empty-state">Nenhum registro cadastrado.</p>
          )}
          {items.map((item) => (
            <article className="subject-item" key={item.id}>
              <div>
                <h2>{item.name}</h2>
                {"professor" in item && (
                  <>
                    <p>{item.professor}</p>
                    <p>
                      {item.activityCount} atividades · {item.pendingCount}{" "}
                      pendentes
                    </p>
                  </>
                )}
              </div>
              <div className="activity-actions">
                <button
                  className="secondary-button"
                  onClick={() => {
                    setId(item.id);
                    setName(item.name);
                    setProfessor("professor" in item ? item.professor : "");
                    setSuccess("");
                  }}
                >
                  Editar
                </button>
                <button
                  className="secondary-button"
                  disabled={busy}
                  onClick={() => remove(item.id)}
                >
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
