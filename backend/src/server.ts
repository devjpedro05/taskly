import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import "./database/db.js";
import { frontendOrigin, checkOrigin, requireUser } from "./auth.js";
import { authRouter } from "./routes/auth.js";
import { subjectsRouter } from "./routes/subjects.js";
import { categoriesRouter } from "./routes/categories.js";
import { activitiesRouter } from "./routes/activities.js";
import { subtasksRouter } from "./routes/subtasks.js";
const app = express();
app.use(cors({ origin: frontendOrigin, credentials: true }));
app.use(checkOrigin);
app.use(express.json({ limit: "32kb" }));
app.use("/auth", authRouter);
app.use(requireUser);
app.use("/subjects", subjectsRouter);
app.use("/categories", categoriesRouter);
app.use("/activities/:activityId/subtasks", subtasksRouter);
app.use("/activities", activitiesRouter);
app.use((_req, res) => res.status(404).json({ error: "Rota não encontrada." }));
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (typeof error === "object" && error !== null) {
    if ("type" in error && error.type === "entity.parse.failed")
      return res.status(400).json({ error: "JSON malformado." });
    if ("code" in error && typeof error.code === "string") {
      if (error.code.startsWith("SQLITE_CONSTRAINT"))
        return res
          .status(409)
          .json({
            error:
              "Conflito de dados. Disciplina ou categoria em uso não pode ser excluída; e-mails devem ser únicos.",
          });
      if (error.code.startsWith("SQLITE_"))
        return res
          .status(500)
          .json({ error: "Não foi possível acessar o banco de dados." });
    }
    if ("status" in error && error.status === 413)
      return res.status(413).json({ error: "Requisição muito grande." });
  }
  console.error("Falha interna da API.");
  return res.status(500).json({ error: "Erro interno do servidor." });
});
app.listen(3001, "127.0.0.1", (error) => {
  if (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }
  console.log("Taskly API disponível em http://localhost:3001");
});
