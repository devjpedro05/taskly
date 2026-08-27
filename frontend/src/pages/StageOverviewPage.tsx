import { ProjectHeader } from "../components/ProjectHeader";
import type { ProjectStage } from "../types/project";

const currentStage: ProjectStage = {
  label: "Etapa 01",
  title: "Organização acadêmica começa com clareza.",
  description:
    "Uma fundação Web simples para centralizar atividades, disciplinas, prioridades e prazos acadêmicos.",
};

export function StageOverviewPage() {
  return (
    <div className="app-shell" id="inicio">
      <ProjectHeader stageLabel={currentStage.label} />

      <main className="stage-overview">
        <div className="stage-copy">
          <p className="eyebrow">Proposta e especificação inicial</p>
          <h1>{currentStage.title}</h1>
          <p className="description">{currentStage.description}</p>
        </div>

        <aside className="foundation-note" id="fundacao" aria-label="Estado do projeto">
          <span className="status-mark" aria-hidden="true" />
          <div>
            <strong>Fundação preparada</strong>
            <p>Frontend, API mínima e documentação prontos para evolução incremental.</p>
          </div>
        </aside>
      </main>

      <footer>
        <a href="#fundacao">Ver estado da Etapa 01 <span aria-hidden="true">→</span></a>
        <span>Tecnologia de Construção de Software I</span>
      </footer>
    </div>
  );
}
