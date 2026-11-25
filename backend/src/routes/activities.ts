import { Router } from "express";
import * as data from "../database/activities.js";
import { getSubject } from "../database/subjects.js";
import { getCategory } from "../database/categories.js";
import {
  isObject,
  isId,
  parseId,
  allowed,
  text,
  validDate,
} from "../validation.js";
import type { ActivityInput } from "../types.js";
export const activitiesRouter = Router();
const fields = [
  "title",
  "description",
  "subjectId",
  "categoryId",
  "dueDate",
  "priority",
  "status",
];
function validate(body: Record<string, unknown>): ActivityInput | undefined {
  const {
    title,
    description,
    subjectId,
    categoryId,
    dueDate,
    priority,
    status,
  } = body;
  if (
    !text(title) ||
    typeof description !== "string" ||
    description.length > 10000 ||
    !isId(subjectId) ||
    !isId(categoryId) ||
    !validDate(dueDate) ||
    (priority !== "LOW" && priority !== "MEDIUM" && priority !== "HIGH") ||
    (status !== "PENDING" && status !== "COMPLETED")
  )
    return;
  return {
    title: title.trim(),
    description,
    subjectId,
    categoryId,
    dueDate,
    priority,
    status,
  };
}
activitiesRouter.get("/", (_req, res) =>
  res.json(data.listActivities(res.locals.user.id)),
);
activitiesRouter.get("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: "ID inválido." });
  const activity = data.getActivity(res.locals.user.id, id);
  return activity
    ? res.json(activity)
    : res.status(404).json({ error: "Atividade não encontrada." });
});
activitiesRouter.post("/", (req, res) => {
  const body: unknown = req.body;
  const input =
    isObject(body) && allowed(body, fields) ? validate(body) : undefined;
  if (!input)
    return res.status(400).json({ error: "Dados da atividade inválidos." });
  const user = res.locals.user.id;
  if (
    !getSubject(user, input.subjectId) ||
    !getCategory(user, input.categoryId)
  )
    return res
      .status(404)
      .json({ error: "Disciplina ou categoria não encontrada." });
  const activity = data.createActivity(user, input);
  return res
    .location("/activities/" + activity.id)
    .status(201)
    .json(activity);
});
activitiesRouter.patch("/:id", (req, res) => {
  const id = parseId(req.params.id),
    user = res.locals.user.id;
  if (!id) return res.status(400).json({ error: "ID inválido." });
  const activity = data.getActivity(user, id);
  if (!activity)
    return res.status(404).json({ error: "Atividade não encontrada." });
  const body: unknown = req.body;
  const input =
    isObject(body) && allowed(body, fields)
      ? validate({ ...activity, ...body })
      : undefined;
  if (!input)
    return res.status(400).json({ error: "Dados da atividade inválidos." });
  if (
    !getSubject(user, input.subjectId) ||
    !getCategory(user, input.categoryId)
  )
    return res
      .status(404)
      .json({ error: "Disciplina ou categoria não encontrada." });
  return res.json(data.updateActivity(user, id, input));
});
activitiesRouter.delete("/:id", (req, res) => {
  const id = parseId(req.params.id),
    user = res.locals.user.id;
  if (!id) return res.status(400).json({ error: "ID inválido." });
  if (!data.getActivity(user, id))
    return res.status(404).json({ error: "Atividade não encontrada." });
  data.deleteActivity(user, id);
  return res.status(204).end();
});
