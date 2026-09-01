import type { Activity, Subject } from "../types/domain";

export const activities: Activity[] = [
  {
    id: 1,
    title: "Trabalho API REST",
    description: "Documentar os recursos e contratos previstos para a API do projeto.",
    subject: "Tecnologia de Construção de Software I",
    category: "Trabalho",
    dueDate: "2026-09-05",
    dueDateLabel: "05/09/2026",
    priority: "HIGH",
    status: "PENDING",
  },
  {
    id: 2,
    title: "Lista de exercícios SQL",
    description: "Resolver a lista de consultas, junções e agrupamentos.",
    subject: "Banco de Dados",
    category: "Exercício",
    dueDate: "2026-09-08",
    dueDateLabel: "08/09/2026",
    priority: "MEDIUM",
    status: "PENDING",
  },
  {
    id: 3,
    title: "Projeto da disciplina",
    description: "Preparar a apresentação da primeira versão estrutural do projeto.",
    subject: "Algoritmos",
    category: "Projeto",
    dueDate: "2026-09-12",
    dueDateLabel: "12/09/2026",
    priority: "LOW",
    status: "COMPLETED",
  },
];

export const subjects: Subject[] = [
  {
    id: 1,
    name: "Tecnologia de Construção de Software I",
    professor: "Prof. Carlos Almeida",
    activityCount: 5,
    pendingCount: 2,
  },
  {
    id: 2,
    name: "Banco de Dados",
    professor: "Profa. Marina Costa",
    activityCount: 7,
    pendingCount: 3,
  },
  {
    id: 3,
    name: "Algoritmos",
    professor: "Prof. Rafael Santos",
    activityCount: 4,
    pendingCount: 1,
  },
];

export const summary = [
  { label: "Pendentes", value: 5 },
  { label: "Concluídas", value: 12 },
  { label: "Atrasadas", value: 2 },
];

export const priorityLabels = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
} as const;

export const statusLabels = {
  PENDING: "Pendente",
  COMPLETED: "Concluída",
} as const;
