const base = "http://localhost:3001";
export async function api(path: string, options: RequestInit = {}) {
  let response: Response;
  try {
    response = await fetch(base + path, {
      ...options,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new Error(
      "Não foi possível comunicar com a API. Verifique o servidor.",
    );
  }
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith("/auth/"))
      window.location.assign("/login");
    const body = await response
      .json()
      .catch(() => ({ error: "Falha na requisição." }));
    throw new Error(body.error || "Falha na requisição.");
  }
  return response;
}
