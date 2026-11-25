import { db } from "./db.js";
import type { Subject } from "../types.js";
const select = `SELECT s.id,s.name,s.professor,
  (SELECT count(*) FROM activities a WHERE a.subject_id=s.id AND a.user_id=s.user_id) AS activityCount,
  (SELECT count(*) FROM activities a WHERE a.subject_id=s.id AND a.user_id=s.user_id AND a.status='PENDING') AS pendingCount
  FROM subjects s WHERE s.user_id = ?`;
export function listSubjects(user: number) {
  return db.prepare(select).all(user) as Subject[];
}
export function getSubject(user: number, id: number) {
  return db.prepare(select + " AND s.id = ?").get(user, id) as
    Subject | undefined;
}
export function createSubject(user: number, name: string, professor: string) {
  const result = db
    .prepare("INSERT INTO subjects(user_id,name,professor) VALUES(?,?,?)")
    .run(user, name, professor);
  return getSubject(user, Number(result.lastInsertRowid))!;
}
export function updateSubject(
  user: number,
  id: number,
  name: string,
  professor: string,
) {
  db.prepare(
    "UPDATE subjects SET name=?, professor=? WHERE id=? AND user_id=?",
  ).run(name, professor, id, user);
  return getSubject(user, id)!;
}
export function deleteSubject(user: number, id: number) {
  db.prepare("DELETE FROM subjects WHERE id=? AND user_id=?").run(id, user);
}
