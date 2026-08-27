interface ProjectHeaderProps {
  stageLabel: string;
}

export function ProjectHeader({ stageLabel }: ProjectHeaderProps) {
  return (
    <header className="project-header">
      <a className="brand" href="#inicio" aria-label="Taskly — início">
        Taskly<span aria-hidden="true">.</span>
      </a>
      <span className="stage-badge">{stageLabel}</span>
    </header>
  );
}
