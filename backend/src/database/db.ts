import Database from "better-sqlite3";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
export const databasePath = resolve(
  root,
  process.env.DB_PATH || "data/taskly.sqlite",
);
mkdirSync(dirname(databasePath), { recursive: true });
export const db = new Database(databasePath);
db.pragma("foreign_keys = ON");
db.pragma("busy_timeout = 5000");
db.exec(readFileSync(resolve(root, "schema.sql"), "utf8"));
