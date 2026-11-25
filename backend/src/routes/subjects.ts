import { Router } from "express";
import * as data from "../database/subjects.js";
import { isObject, allowed, parseId, text } from "../validation.js";
export const subjectsRouter = Router();
subjectsRouter.get("/", (_req, res) =>
  res.json(data.listSubjects(res.locals.user.id)),
);
subjectsRouter.post("/", (req, res) => {
  const body: unknown = req.body;
  if (
    !isObject(body) ||
    !allowed(body, ["name", "professor"]) ||
    !text(body.name) ||
    (body.professor !== undefined &&
      (typeof body.professor !== "string" || body.professor.length > 200))
  )
    return res.status(400).json({ error: "Dados inválidos." });
  return res
    .status(201)
    .json(
      data.createSubject(
        res.locals.user.id,
        body.name.trim(),
        typeof body.professor === "string" ? body.professor.trim() : "",
      ),
    );
});
subjectsRouter.patch("/:id", (req, res) => {
  const id = parseId(req.params.id),
    user = res.locals.user.id;
  if (!id) return res.status(400).json({ error: "ID inválido." });
  const current = data.getSubject(user, id);
  if (!current)
    return res.status(404).json({ error: "Registro não encontrado." });
  const body: unknown = req.body;
  if (!isObject(body) || !allowed(body, ["name", "professor"]))
    return res.status(400).json({ error: "Dados inválidos." });
  const value = { ...current, ...body };
  if (
    !text(value.name) ||
    typeof value.professor !== "string" ||
    value.professor.length > 200
  )
    return res.status(400).json({ error: "Dados inválidos." });
  return res.json(
    data.updateSubject(user, id, value.name.trim(), value.professor.trim()),
  );
});
subjectsRouter.delete("/:id", (req, res) => {
  const id = parseId(req.params.id),
    user = res.locals.user.id;
  if (!id) return res.status(400).json({ error: "ID inválido." });
  if (!data.getSubject(user, id))
    return res.status(404).json({ error: "Registro não encontrado." });
  data.deleteSubject(user, id);
  return res.status(204).end();
});
