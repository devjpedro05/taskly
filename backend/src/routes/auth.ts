import { Router } from "express";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "../database/users.js";
import { cookieOptions, requireUser, setSession } from "../auth.js";
import { isObject, text } from "../validation.js";
export const authRouter = Router();

authRouter.post("/register", async (request, response) => {
  const body: unknown = request.body;
  if (
    !isObject(body) ||
    !text(body.name) ||
    typeof body.email !== "string" ||
    body.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) ||
    typeof body.password !== "string" ||
    body.password.length < 8 ||
    Buffer.byteLength(body.password, "utf8") > 72
  ) {
    return response
      .status(400)
      .json({ error: "Informe nome, e-mail válido e senha de 8 a 72 bytes." });
  }
  const email = body.email.trim().toLowerCase();
  if (findUserByEmail(email))
    return response.status(409).json({ error: "E-mail já cadastrado." });
  const hash = await bcrypt.hash(body.password, 12);
  return response.status(201).json(createUser(body.name.trim(), email, hash));
});
authRouter.post("/login", async (request, response) => {
  const body: unknown = request.body;
  if (
    !isObject(body) ||
    typeof body.email !== "string" ||
    typeof body.password !== "string" ||
    Buffer.byteLength(body.password) > 72
  ) {
    return response.status(401).json({ error: "E-mail ou senha inválidos." });
  }
  const user = findUserByEmail(body.email.trim().toLowerCase());
  if (!user || !(await bcrypt.compare(body.password, user.password_hash)))
    return response.status(401).json({ error: "E-mail ou senha inválidos." });
  setSession(response, user.id);
  return response.json({ id: user.id, name: user.name, email: user.email });
});
authRouter.get("/me", requireUser, (_request, response) =>
  response.json(response.locals.user),
);
authRouter.post("/logout", (_request, response) => {
  response.clearCookie("taskly_session", cookieOptions);
  return response.status(204).end();
});
