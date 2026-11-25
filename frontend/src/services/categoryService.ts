import { api } from "./api";
import type { Category } from "../types/domain";
export async function getCategories(): Promise<Category[]> {
  return (await api("/categories")).json();
}
export async function saveCategory(id: number | null, name: string) {
  return (
    await api("/categories" + (id ? "/" + id : ""), {
      method: id ? "PATCH" : "POST",
      body: JSON.stringify({ name }),
    })
  ).json();
}
export async function deleteCategory(id: number) {
  await api("/categories/" + id, { method: "DELETE" });
}
