import { api } from "./api";
import type { Subject } from "../types/domain";
export async function getSubjects(): Promise<Subject[]> {
  return (await api("/subjects")).json();
}
export async function saveSubject(
  id: number | null,
  name: string,
  professor: string,
) {
  return (
    await api("/subjects" + (id ? "/" + id : ""), {
      method: id ? "PATCH" : "POST",
      body: JSON.stringify({ name, professor }),
    })
  ).json();
}
export async function deleteSubject(id: number) {
  await api("/subjects/" + id, { method: "DELETE" });
}
