import { db } from "./db.js";
import type { Category } from "../types.js";
export function listCategories(user: number) {
  return db
    .prepare("SELECT id,name FROM categories WHERE user_id=?")
    .all(user) as Category[];
}
export function getCategory(user: number, id: number) {
  return db
    .prepare("SELECT id,name FROM categories WHERE id=? AND user_id=?")
    .get(id, user) as Category | undefined;
}
export function createCategory(user: number, name: string) {
  const result = db
    .prepare("INSERT INTO categories(user_id,name) VALUES(?,?)")
    .run(user, name);
  return getCategory(user, Number(result.lastInsertRowid))!;
}
export function updateCategory(user: number, id: number, name: string) {
  db.prepare("UPDATE categories SET name=? WHERE id=? AND user_id=?").run(
    name,
    id,
    user,
  );
  return getCategory(user, id)!;
}
export function deleteCategory(user: number, id: number) {
  db.prepare("DELETE FROM categories WHERE id=? AND user_id=?").run(id, user);
}
