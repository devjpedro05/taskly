import { db } from "./db.js";
import type { Activity, ActivityInput } from "../types.js";
const select = `SELECT a.id,a.title,a.description,a.subject_id AS subjectId,a.category_id AS categoryId,
  s.name AS subject,c.name AS category,a.due_date AS dueDate,
  substr(a.due_date,9,2)||'/'||substr(a.due_date,6,2)||'/'||substr(a.due_date,1,4) AS dueDateLabel,
  a.priority,a.status FROM activities a
  JOIN subjects s ON s.id=a.subject_id AND s.user_id=a.user_id
  JOIN categories c ON c.id=a.category_id AND c.user_id=a.user_id WHERE a.user_id=?`;
export function listActivities(user: number) {
  return db.prepare(select).all(user) as Activity[];
}
export function getActivity(user: number, id: number) {
  return db.prepare(select + " AND a.id=?").get(user, id) as
    Activity | undefined;
}
export function createActivity(user: number, data: ActivityInput) {
  const result = db
    .prepare(
      `INSERT INTO activities(user_id,title,description,subject_id,category_id,due_date,priority,status)
    VALUES(?,?,?,?,?,?,?,?)`,
    )
    .run(
      user,
      data.title,
      data.description,
      data.subjectId,
      data.categoryId,
      data.dueDate,
      data.priority,
      data.status,
    );
  return getActivity(user, Number(result.lastInsertRowid))!;
}
export function updateActivity(user: number, id: number, data: ActivityInput) {
  db.prepare(
    `UPDATE activities SET title=?,description=?,subject_id=?,category_id=?,due_date=?,priority=?,status=?
    WHERE id=? AND user_id=?`,
  ).run(
    data.title,
    data.description,
    data.subjectId,
    data.categoryId,
    data.dueDate,
    data.priority,
    data.status,
    id,
    user,
  );
  return getActivity(user, id)!;
}
export function deleteActivity(user: number, id: number) {
  db.prepare("DELETE FROM activities WHERE id=? AND user_id=?").run(id, user);
}
