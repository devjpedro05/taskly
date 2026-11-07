import type { Activity, NewActivity } from "../types/domain";

const API_URL = "http://localhost:3001";

export async function getActivities(): Promise<Activity[]> {
  const response = await fetch(`${API_URL}/activities`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar as atividades.");
  }

  return response.json();
}

export async function createActivity(activity: NewActivity): Promise<Activity> {
  const response = await fetch(`${API_URL}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  });

  if (!response.ok) {
    throw new Error("Não foi possível enviar a atividade.");
  }

  return response.json();
}
