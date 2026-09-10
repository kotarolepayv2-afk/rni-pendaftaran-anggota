const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function getAdminToken() {
  return localStorage.getItem("rni_admin_token");
}

export function setAdminToken(token) {
  localStorage.setItem("rni_admin_token", token);
}

export function clearAdminToken() {
  localStorage.removeItem("rni_admin_token");
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getAdminToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data.error || "Terjadi kesalahan. Silakan coba lagi.";
    const error = new Error(message);
    error.details = data.details;
    error.status = res.status;
    throw error;
  }

  return data;
}

export const api = {
  daftar: (payload) => request("/pendaftaran", { method: "POST", body: payload }),
  getKtp: (id) => request(`/ktp/${encodeURIComponent(id)}`),

  adminLogin: (username, password) =>
    request("/admin/login", { method: "POST", body: { username, password } }),
  adminDashboard: () => request("/admin/dashboard", { auth: true }),
  adminMembers: (query = "") =>
    request(`/admin/members${query ? `?query=${encodeURIComponent(query)}` : ""}`, { auth: true }),
  adminMemberDetail: (id) => request(`/admin/members/${encodeURIComponent(id)}`, { auth: true }),
  adminMemberUpdate: (id, payload) =>
    request(`/admin/members/${encodeURIComponent(id)}`, { method: "PUT", body: payload, auth: true }),
};
