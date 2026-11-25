import { db } from "./db.js";
import type { StoredUser, User } from "../types.js";
export function findUserByEmail(email: string) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as
    StoredUser | undefined;
}
export function findUser(id: number) {
  return db
    .prepare("SELECT id, name, email FROM users WHERE id = ?")
    .get(id) as User | undefined;
}
export const createUser = db.transaction(
  (name: string, email: string, hash: string) => {
    const result = db
      .prepare("INSERT INTO users(name,email,password_hash) VALUES(?,?,?)")
      .run(name, email, hash);
    const id = Number(result.lastInsertRowid);
    const insert = db.prepare(
      "INSERT INTO categories(user_id,name) VALUES(?,?)",
    );
    for (const category of ["Trabalho", "Prova", "Exercício", "Projeto"])
      insert.run(id, category);
    return findUser(id)!;
  },
);
