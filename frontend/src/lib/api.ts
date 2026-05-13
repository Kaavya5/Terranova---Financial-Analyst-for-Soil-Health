export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Auth ──────────────────────────────────────────────────────────────────────
export async function getAuthToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export async function login(): Promise<string | null> {
  try {
    const formData = new URLSearchParams();
    formData.append("username", "admin@terranova.com");
    formData.append("password", "password123");

    const response = await fetch(`${API_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      return data.access_token;
    } else if (response.status === 401) {
      // Auto-create demo user if not exists
      await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@terranova.com",
          password: "password123",
          full_name: "Demo User",
        }),
      });
      return await login();
    }
  } catch (error) {
    console.error("Auth error:", error);
  }
  return null;
}

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let token = await getAuthToken();
  if (!token) token = await login();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    token = await login();
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return response;
}

// ─── Soil Prediction ──────────────────────────────────────────────────────────
export interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  area_ha?: number;
  market_price_per_kg?: number;
}

export async function submitPrediction(data: SoilData) {
  const response = await authFetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      N: data.nitrogen,
      P: data.phosphorus,
      K: data.potassium,
      pH: data.ph,
      temperature: data.temperature,
      humidity: data.humidity,
      rainfall: data.rainfall,
      area_ha: data.area_ha || 1,
      market_price_per_kg: data.market_price_per_kg,
    }),
  });

  if (!response.ok) throw new Error("Failed to generate prediction");
  return await response.json();
}

// ─── Reports ──────────────────────────────────────────────────────────────────
export interface ReportListItem {
  id: string;
  recommended_crop: string;
  crop_confidence: number;
  total_cost: number;
  expected_profit: number;
  roi_percentage: number;
  field_area_hectares: number;
  created_at: string;
}

export interface ReportDetail extends ReportListItem {
  fertilizer_cost: number;
  seed_cost: number;
  labor_cost: number;
  irrigation_cost: number;
  pesticide_cost: number;
  machinery_cost: number;
  other_costs: number;
  expected_revenue: number;
  market_price_per_kg: number;
  expected_yield_kg: number;
  cost_confidence: number;
  fertilizer_recommendations: Record<string, unknown>;
  alternative_crops: Array<{ crop: string; confidence: number }>;
  yield_kg_per_ha: number;
}

export async function getReports(skip = 0, limit = 20): Promise<ReportListItem[]> {
  const response = await authFetch(`${API_URL}/reports?skip=${skip}&limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch reports");
  return await response.json();
}

export async function getReportDetail(reportId: string): Promise<ReportDetail> {
  const response = await authFetch(`${API_URL}/reports/${reportId}`);
  if (!response.ok) throw new Error("Failed to fetch report detail");
  return await response.json();
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
export async function sendChatMessage(message: string, context?: { prediction_id?: string }) {
  const response = await authFetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, ...context }),
  });

  if (!response.ok) throw new Error("Failed to send message");
  return await response.json();
}
