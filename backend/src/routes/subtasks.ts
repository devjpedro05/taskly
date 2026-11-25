import { Router } from "express";
import * as data from "../database/subtasks.js";
import { getActivity } from "../database/activities.js";
import { parseId, isObject, allowed, text } from "../validation.js";
export const subtasksRouter = Router({ mergeParams: true });
subtasksRouter.use((req, res, next) => {
  const id = parseId(req.params.activityId as string);
  if (!id) return res.status(400).json({ error: "ID inválido." });
  if (!getActivity(res.locals.user.id, id))
    return res.status(404).json({ error: "Atividade não encontrada." });
  res.locals.activityId = id;
  next();
});
subtasksRouter.get("/", (_req, res) =>
  res.json(data.listSubtasks(res.locals.activityId)),
);
subtasksRouter.post("/", (req, res) => {
  const body: unknown = req.body;
  if (!isObject(body) || !allowed(body, ["title"]) || !text(body.title))
    return res.status(400).json({ error: "Título da subtarefa inválido." });
  return res
    .status(201)
    .json(data.createSubtask(res.locals.activityId, body.title.trim()));
});
subtasksRouter.patch("/:subtaskId", (req, res) => {
  const id = parseId(req.params.subtaskId as string),
    activity = res.locals.activityId;
  if (!id) return res.status(400).json({ error: "ID inválido." });
  const current = data.getSubtask(activity, id);
  if (!current)
    return res.status(404).json({ error: "Subtarefa não encontrada." });
  const body: unknown = req.body;
  if (!isObject(body) || !allowed(body, ["title", "completed"]))
    return res.status(400).json({ error: "Subtarefa inválida." });
  const value = { ...current, ...body };
  if (!text(value.title) || typeof value.completed !== "boolean")
    return res.status(400).json({ error: "Subtarefa inválida." });
  return res.json(
    data.updateSubtask(activity, id, value.title.trim(), value.completed),
  );
});
subtasksRouter.delete("/:subtaskId", (req, res) => {
  const id = parseId(req.params.subtaskId as string),
    activity = res.locals.activityId;
  if (!id) return res.status(400).json({ error: "ID inválido." });
  if (!data.getSubtask(activity, id))
    return res.status(404).json({ error: "Subtarefa não encontrada." });
  data.deleteSubtask(activity, id);
  return res.status(204).end();
});
