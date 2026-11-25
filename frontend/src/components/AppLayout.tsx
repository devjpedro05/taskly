import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { logout } from "../services/authService";
import type { User } from "../types/domain";
export function AppLayout({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function leave() {
    setError("");
    setBusy(true);
    try {
      await logout();
      onLogout();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Ir para o conteúdo principal
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/">
            Taskly<span>.</span>
          </Link>
          <nav aria-label="Navegação principal">
            <ul className="nav-list">
              {[
                ["/", "Dashboard"],
                ["/atividades", "Atividades"],
                ["/disciplinas", "Disciplinas"],
                ["/categorias", "Categorias"],
              ].map(([to, label]) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="session-actions">
            <span>{user.name}</span>
            <button
              className="secondary-button"
              disabled={busy}
              onClick={leave}
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      {error && (
        <p className="page form-error" role="alert">
          {error}
        </p>
      )}
      <Outlet />
      <footer className="site-footer">
        <p>Taskly · Projeto acadêmico incremental</p>
        <p>Etapa 07 · Persistência e CRUD com Banco de Dados</p>
      </footer>
    </div>
  );
}
