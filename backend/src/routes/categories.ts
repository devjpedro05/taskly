import { Router } from "express";
import * as data from "../database/categories.js";
import { isObject, allowed, parseId, text } from "../validation.js";
export const categoriesRouter = Router();
categoriesRouter.get("/", (_req, res) =>
  res.json(data.listCategories(res.locals.user.id)),
);
categoriesRouter.post("/", (req, res) => {
  const body: unknown = req.body;
  if (!isObject(body) || !allowed(body, ["name"]) || !text(body.name))
    return res.status(400).json({ error: "Dados inválidos." });
  return res
    .status(201)
    .json(data.createCategory(res.locals.user.id, body.name.trim()));
});
categoriesRouter.patch("/:id", (req, res) => {
  const id = parseId(req.params.id),
    user = res.locals.user.id;
  if (!id) return res.status(400).json({ error: "ID inválido." });
  const current = data.getCategory(user, id);
  if (!current)
    return res.status(404).json({ error: "Registro não encontrado." });
  const body: unknown = req.body;
  if (!isObject(body) || !allowed(body, ["name"]))
    return res.status(400).json({ error: "Dados inválidos." });
  const value = { ...current, ...body };
  if (!text(value.name))
    return res.status(400).json({ error: "Dados inválidos." });
  return res.json(data.updateCategory(user, id, value.name.trim()));
});
categoriesRouter.delete("/:id", (req, res) => {
  const id = parseId(req.params.id),
    user = res.locals.user.id;
  if (!id) return res.status(400).json({ error: "ID inválido." });
  if (!data.getCategory(user, id))
    return res.status(404).json({ error: "Registro não encontrado." });
  data.deleteCategory(user, id);
  return res.status(204).end();
});
