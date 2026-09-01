import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { ActivitiesPage } from "./pages/ActivitiesPage";
import { ActivityFormPage } from "./pages/ActivityFormPage";
import { DashboardPage } from "./pages/DashboardPage";
import { SubjectsPage } from "./pages/SubjectsPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="atividades" element={<ActivitiesPage />} />
        <Route path="atividades/nova" element={<ActivityFormPage />} />
        <Route path="atividades/:activityId/editar" element={<ActivityFormPage />} />
        <Route path="disciplinas" element={<SubjectsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
