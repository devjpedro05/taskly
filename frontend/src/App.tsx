import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { me } from "./services/authService";
import type { User } from "./types/domain";
import { AppLayout } from "./components/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ActivitiesPage } from "./pages/ActivitiesPage";
import { ActivityFormPage } from "./pages/ActivityFormPage";
import { SubjectsPage } from "./pages/SubjectsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { ActivityDetailsPage } from "./pages/ActivityDetailsPage";
export function App() {
  const [user, setUser] = useState<User | null>(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <main className="page" role="status">
        Verificando sessão...
      </main>
    );
  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? <Navigate to="/" replace /> : <LoginPage onLogin={setUser} />
        }
      />
      <Route
        path="/cadastro"
        element={user ? <Navigate to="/" replace /> : <RegisterPage />}
      />
      <Route
        element={
          user ? (
            <AppLayout user={user} onLogout={() => setUser(null)} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="atividades" element={<ActivitiesPage />} />
        <Route
          path="atividades/nova"
          element={<ActivityFormPage key="new" />}
        />
        <Route
          path="atividades/:activityId/editar"
          element={<ActivityFormPage key="edit" />}
        />
        <Route
          path="atividades/:activityId"
          element={<ActivityDetailsPage />}
        />
        <Route path="disciplinas" element={<SubjectsPage />} />
        <Route path="categorias" element={<CategoriesPage />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={user ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}
