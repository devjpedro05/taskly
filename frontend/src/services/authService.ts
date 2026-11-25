import { api } from "./api";
import type { User } from "../types/domain";
export async function me(): Promise<User> {
  return (await api("/auth/me")).json();
}
export async function login(email: string, password: string): Promise<User> {
  return (
    await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  ).json();
}
export async function register(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  return (
    await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
  ).json();
}
export async function logout() {
  await api("/auth/logout", { method: "POST" });
}
