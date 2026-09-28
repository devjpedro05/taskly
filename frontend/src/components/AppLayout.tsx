import { Link, NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/atividades", label: "Atividades", end: false },
  { to: "/disciplinas", label: "Disciplinas", end: false },
];

export function AppLayout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Ir para o conteúdo principal
      </a>

      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="Taskly — Dashboard">
            Taskly<span aria-hidden="true">.</span>
          </Link>

          <nav aria-label="Navegação principal">
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <Link className="primary-link" to="/atividades/nova">
            Nova atividade
          </Link>
        </div>
      </header>

      <Outlet />

      <footer className="site-footer">
        <p>Taskly · Projeto acadêmico incremental</p>
        <p>Etapa 04 · Interatividade com JavaScript</p>
      </footer>
    </div>
  );
}
