import { db } from "./db.js";
import type { Subtask } from "../types.js";
function map(row: { id: number; title: string; completed: number }): Subtask {
  return { ...row, completed: Boolean(row.completed) };
}
export function listSubtasks(activity: number) {
  const rows = db
    .prepare("SELECT id,title,completed FROM subtasks WHERE activity_id=?")
    .all(activity) as { id: number; title: string; completed: number }[];
  return rows.map(map);
}
export function getSubtask(activity: number, id: number) {
  const row = db
    .prepare(
      "SELECT id,title,completed FROM subtasks WHERE activity_id=? AND id=?",
    )
    .get(activity, id) as
    { id: number; title: string; completed: number } | undefined;
  return row ? map(row) : undefined;
}
export function createSubtask(activity: number, title: string) {
  const result = db
    .prepare("INSERT INTO subtasks(activity_id,title) VALUES(?,?)")
    .run(activity, title);
  return getSubtask(activity, Number(result.lastInsertRowid))!;
}
export function updateSubtask(
  activity: number,
  id: number,
  title: string,
  completed: boolean,
) {
  db.prepare(
    "UPDATE subtasks SET title=?,completed=? WHERE activity_id=? AND id=?",
  ).run(title, Number(completed), activity, id);
  return getSubtask(activity, id)!;
}
export function deleteSubtask(activity: number, id: number) {
  db.prepare("DELETE FROM subtasks WHERE activity_id=? AND id=?").run(
    activity,
    id,
  );
}
