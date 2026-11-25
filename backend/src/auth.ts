import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { findUser } from "./database/users.js";

export const frontendOrigin =
  process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32)
  throw new Error(
    "Configure JWT_SECRET com pelo menos 32 caracteres aleatórios.",
  );
export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: frontendOrigin.startsWith("https:"),
  path: "/",
};

export function setSession(response: Response, id: number) {
  const token = jwt.sign({}, secret!, {
    subject: String(id),
    expiresIn: "2h",
    algorithm: "HS256",
    issuer: "taskly",
  });
  response.cookie("taskly_session", token, {
    ...cookieOptions,
    maxAge: 2 * 60 * 60 * 1000,
  });
}
export function requireUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  let id: number;
  try {
    const cookie = request.headers.cookie
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("taskly_session="));
    const token = cookie
      ? decodeURIComponent(cookie.slice("taskly_session=".length))
      : "";
    const payload = jwt.verify(token, secret!, {
      algorithms: ["HS256"],
      issuer: "taskly",
    });
    id =
      typeof payload === "object" && typeof payload.sub === "string"
        ? Number(payload.sub)
        : 0;
  } catch {
    return response.status(401).json({ error: "Autenticação necessária." });
  }
  const user = findUser(id);
  if (!user)
    return response.status(401).json({ error: "Autenticação necessária." });
  response.locals.user = user;
  next();
}
export function checkOrigin(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (
    !["GET", "HEAD", "OPTIONS"].includes(request.method) &&
    request.headers.origin !== frontendOrigin
  ) {
    return response
      .status(403)
      .json({ error: "Origem da requisição não permitida." });
  }
  next();
}
