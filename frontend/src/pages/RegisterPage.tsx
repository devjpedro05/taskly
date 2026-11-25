import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError("");
    if (data.get("password") !== data.get("confirm")) {
      setError("As senhas devem ser iguais.");
      return;
    }
    setBusy(true);
    try {
      await register(
        String(data.get("name")),
        String(data.get("email")),
        String(data.get("password")),
      );
      navigate("/login", { state: { registered: true } });
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="page form-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Taskly</p>
          <h1>Criar conta</h1>
          <p>Organize seus estudos em um espaço individual.</p>
        </div>
      </header>
      <form className="activity-form form-grid" onSubmit={submit}>
        <div className="field field-wide">
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            maxLength={200}
          />
        </div>
        <div className="field field-wide">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="confirm">Confirmar senha</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        {error && (
          <p className="form-error field-wide" role="alert">
            {error}
          </p>
        )}
        <button className="primary-button" disabled={busy}>
          {busy ? "Cadastrando..." : "Cadastrar"}
        </button>
        <Link to="/login">Voltar ao login</Link>
      </form>
    </main>
  );
}
