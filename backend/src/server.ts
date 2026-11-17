import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { activitiesRouter } from "./routes/activities.js";

const app = express();
const port = 3001;

app.use(cors({
  origin: /^http:\/\/(localhost|127\.0\.0\.1):\d+$/,
  methods: ["GET", "HEAD", "POST", "PATCH", "DELETE"],
}));
app.use(express.json());
app.use("/activities", activitiesRouter);

app.use((_request, response) => {
  response.status(404).json({ error: "Rota não encontrada." });
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (typeof error === "object" && error !== null) {
    if ("type" in error && error.type === "entity.parse.failed") {
      return response.status(400).json({ error: "JSON malformado." });
    }
    if ("status" in error && typeof error.status === "number" && error.status >= 400 && error.status < 500) {
      return response.status(error.status).json({ error: "Requisição inválida." });
    }
  }

  console.error(error);
  return response.status(500).json({ error: "Erro interno do servidor." });
});

app.listen(port, "127.0.0.1", (error) => {
  if (error) {
    console.error("Não foi possível iniciar a API:", error.message);
    process.exitCode = 1;
    return;
  }
  console.log(`Taskly API disponível em http://localhost:${port}`);
});
