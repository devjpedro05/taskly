import { Router } from "express";
import { activities } from "../data/activities.js";
import type { Activity, ActivityInput } from "../types.js";

export const activitiesRouter = Router();
let nextId = Math.max(0, ...activities.map((activity) => activity.id)) + 1;

const editableFields = [
  "title", "description", "subject", "category",
  "dueDate", "dueDateLabel", "priority", "status",
];

const invalidId = { error: "ID da atividade inválido." };
const invalidData = { error: "Dados da atividade inválidos." };
const notFound = { error: "Atividade não encontrada." };

function parseId(value: string): number | undefined {
  if (!value || /[^0-9]/.test(value)) return;
  const id = Number(value);
  if (Number.isSafeInteger(id) && id > 0) return id;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function dateLabel(value: unknown): string | undefined {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return;

  const [year, month, day] = value.split("-");
  const date = new Date(value + "T00:00:00Z");
  // Algumas datas inexistentes são normalizadas pelo JavaScript, como 30 de fevereiro.
  if (year === "0000" || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return;
  }
  return `${day}/${month}/${year}`;
}

function validateActivity(body: Record<string, unknown>): ActivityInput | undefined {
  const { title, subject, category, description, dueDate, dueDateLabel, priority, status } = body;

  if (
    typeof title !== "string" || !title.trim() ||
    typeof subject !== "string" || !subject.trim() ||
    typeof category !== "string" || !category.trim() ||
    typeof description !== "string" ||
    typeof dueDate !== "string" ||
    typeof dueDateLabel !== "string" || dueDateLabel !== dateLabel(dueDate) ||
    (priority !== "LOW" && priority !== "MEDIUM" && priority !== "HIGH") ||
    (status !== "PENDING" && status !== "COMPLETED")
  ) {
    return;
  }

  return {
    title: title.trim(),
    subject: subject.trim(),
    category: category.trim(),
    description,
    dueDate,
    dueDateLabel,
    priority,
    status,
  };
}

activitiesRouter.get("/", (_request, response) => {
  response.status(200).json(activities);
});

activitiesRouter.get("/:id", (request, response) => {
  const id = parseId(request.params.id);
  if (id === undefined) return response.status(400).json(invalidId);

  const activity = activities.find((item) => item.id === id);
  if (!activity) return response.status(404).json(notFound);

  return response.status(200).json(activity);
});

activitiesRouter.post("/", (request, response) => {
  const body: unknown = request.body;
  const input = isObject(body) ? validateActivity(body) : undefined;
  if (!input) return response.status(400).json(invalidData);

  const activity: Activity = { id: nextId++, ...input };
  activities.push(activity);
  return response.location(`/activities/${activity.id}`).status(201).json(activity);
});

activitiesRouter.patch("/:id", (request, response) => {
  const id = parseId(request.params.id);
  if (id === undefined) return response.status(400).json(invalidId);

  const index = activities.findIndex((item) => item.id === id);
  if (index === -1) return response.status(404).json(notFound);

  const body: unknown = request.body;
  if (!isObject(body)) return response.status(400).json(invalidData);
  const fields = Object.keys(body);
  if (fields.length === 0 || fields.some((field) => !editableFields.includes(field))) {
    return response.status(400).json(invalidData);
  }

  const candidate: Record<string, unknown> = { ...activities[index], ...body };
  // O rótulo deriva do prazo; mudar o prazo sozinho mantém os dois valores coerentes.
  if (fields.includes("dueDate") && !fields.includes("dueDateLabel")) {
    candidate.dueDateLabel = dateLabel(candidate.dueDate);
  }

  const input = validateActivity(candidate);
  if (!input) return response.status(400).json(invalidData);

  const updated: Activity = { id, ...input };
  activities[index] = updated;
  return response.status(200).json(updated);
});

activitiesRouter.delete("/:id", (request, response) => {
  const id = parseId(request.params.id);
  if (id === undefined) return response.status(400).json(invalidId);

  const index = activities.findIndex((item) => item.id === id);
  if (index === -1) return response.status(404).json(notFound);

  activities.splice(index, 1);
  return response.status(204).end();
});
