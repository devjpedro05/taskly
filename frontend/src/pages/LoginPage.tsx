import { useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { login } from "../services/authService";
import type { User } from "../types/domain";
export function LoginPage({ onLogin }: { onLogin: (user: User) => void }) {
  const location = useLocation();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError("");
    setBusy(true);
    try {
      onLogin(
        await login(String(data.get("email")), String(data.get("password"))),
      );
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
          <h1>Entrar</h1>
          <p>Acesse suas atividades acadêmicas.</p>
        </div>
      </header>
      {location.state?.registered && (
        <p className="form-success" role="status">
          Cadastro realizado. Entre com seu e-mail e senha.
        </p>
      )}
      <form className="activity-form form-grid" onSubmit={submit}>
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
        <div className="field field-wide">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        {error && (
          <p className="form-error field-wide" role="alert">
            {error}
          </p>
        )}
        <button className="primary-button" disabled={busy}>
          {busy ? "Entrando..." : "Entrar"}
        </button>
        <Link to="/cadastro">Criar conta</Link>
      </form>
    </main>
  );
}
