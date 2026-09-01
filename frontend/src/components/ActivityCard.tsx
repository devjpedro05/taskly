import { Link } from "react-router-dom";
import { priorityLabels, statusLabels } from "../data/mockData";
import type { Activity } from "../types/domain";

interface ActivityCardProps {
  activity: Activity;
  showActions?: boolean;
}

export function ActivityCard({ activity, showActions = false }: ActivityCardProps) {
  return (
    <article className="activity-item">
      <header className="activity-header">
        <div>
          <p className="activity-subject">{activity.subject}</p>
          <h3>{activity.title}</h3>
        </div>
        <span className={`status status-${activity.status.toLowerCase()}`}>
          {statusLabels[activity.status]}
        </span>
      </header>

      <p className="activity-description">{activity.description}</p>

      <dl className="activity-metadata">
        <div>
          <dt>Categoria</dt>
          <dd>{activity.category}</dd>
        </div>
        <div>
          <dt>Prazo</dt>
          <dd>
            <time dateTime={activity.dueDate}>{activity.dueDateLabel}</time>
          </dd>
        </div>
        <div>
          <dt>Prioridade</dt>
          <dd>{priorityLabels[activity.priority]}</dd>
        </div>
      </dl>

      {showActions && (
        <footer className="activity-actions">
          <Link className="text-link" to={`/atividades/${activity.id}/editar`}>
            Editar
          </Link>
          <button
            className="text-button danger"
            type="button"
            disabled
            title="Exclusão será implementada em uma etapa futura"
          >
            Excluir
          </button>
        </footer>
      )}
    </article>
  );
}
