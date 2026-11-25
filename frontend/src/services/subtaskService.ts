import { api } from "./api";
import type { Subtask } from "../types/domain";
const url = (id: number) => "/activities/" + id + "/subtasks";
export async function getSubtasks(id: number): Promise<Subtask[]> {
  return (await api(url(id))).json();
}
export async function createSubtask(
  id: number,
  title: string,
): Promise<Subtask> {
  return (
    await api(url(id), { method: "POST", body: JSON.stringify({ title }) })
  ).json();
}
export async function updateSubtask(
  id: number,
  subtask: number,
  data: Partial<Subtask>,
): Promise<Subtask> {
  return (
    await api(url(id) + "/" + subtask, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  ).json();
}
export async function deleteSubtask(id: number, subtask: number) {
  await api(url(id) + "/" + subtask, { method: "DELETE" });
}
