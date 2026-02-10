const API_BASE_URL = "http://localhost:3000";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

// Auth
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: { user: AuthUser; token: string };
}

interface ProfileResponse {
  success: boolean;
  data: { user: AuthUser & { createdAt: string } };
}

export const authApi = {
  signup: (body: { email: string; name: string; password: string }) =>
    request<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  logout: () => request<{ success: boolean }>("/api/auth/logout"),

  profile: () => request<ProfileResponse>("/api/auth/profile"),
};

// Monitors
export interface Monitor {
  id: string;
  url: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  results?: CheckResult[];
}

export interface CheckResult {
  id: string;
  monitorId: string;
  status: "Up" | "Down";
  Location: "USA" | "INDIA";
  responseTimeMs: number | null;
  checkedAt: string;
}

interface MonitorsResponse {
  success: boolean;
  message: string;
  data: { result: Monitor[] };
}

interface MonitorResponse {
  success: boolean;
  data: { result: Monitor };
}

interface ResultsResponse {
  success: boolean;
  data: { results: CheckResult[]; count: number };
}

interface LatestResultResponse {
  success: boolean;
  data: { result: CheckResult };
}

export const monitorApi = {
  create: (url: string) =>
    request<{ success: boolean; data: { monitor: Monitor } }>(
      "/api/monitor/createmonitor",
      { method: "POST", body: JSON.stringify({ url }) }
    ),

  getAll: () => request<MonitorsResponse>("/api/monitor/monitors"),

  getOne: (id: string) =>
    request<MonitorResponse>(`/api/monitor/monitors/${id}`),

  delete: (id: string) =>
    request<{ success: boolean }>(`/api/monitor/monitors/${id}`, {
      method: "DELETE",
    }),

  deleteAll: () =>
    request<{ success: boolean }>("/api/monitor/monitors", {
      method: "DELETE",
    }),
};

export const resultsApi = {
  getAll: (monitorId: string) =>
    request<ResultsResponse>(`/api/results/${monitorId}/results`),

  getLatest: (monitorId: string) =>
    request<LatestResultResponse>(`/api/results/${monitorId}/results/latest`),

  cleanup: (monitorId: string, days = 90) =>
    request<{ success: boolean; message: string }>(
      `/api/results/${monitorId}/results/cleanup?days=${days}`,
      { method: "DELETE" }
    ),
};
