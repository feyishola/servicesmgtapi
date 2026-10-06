export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Thin wrapper around fetch for the { response, payload } envelope the API uses.
// Resolves with the payload, rejects with an ApiError whose message is user-facing.
export async function api(path, { method = "GET", body, token, signal } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}/api/v1${path}`, {
      method,
      signal,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new ApiError("We can't reach the server right now. Check your connection and try again.", 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.response) {
    const message = typeof data.payload === "string" ? data.payload : "Something went wrong. Please try again.";
    throw new ApiError(message, res.status);
  }
  return data.payload;
}
