import { api } from "./api";
import type { Activity, NewActivity } from "../types/domain";
export async function getActivities(): Promise<Activity[]> {
  return (await api("/activities")).json();
}
export async function getActivity(id: number): Promise<Activity> {
  return (await api("/activities/" + id)).json();
}
export async function createActivity(data: NewActivity): Promise<Activity> {
  return (
    await api("/activities", { method: "POST", body: JSON.stringify(data) })
  ).json();
}
export async function updateActivity(
  id: number,
  data: Partial<NewActivity>,
): Promise<Activity> {
  return (
    await api("/activities/" + id, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  ).json();
}
export async function deleteActivity(id: number) {
  await api("/activities/" + id, { method: "DELETE" });
}
