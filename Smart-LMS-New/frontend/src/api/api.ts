const BASE_URL = "/api/v1";

const getToken = () => localStorage.getItem("smart_lms_token");

const parseJsonResponse = async (response: Response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const request = async (
  path: string,
  options: {
    method: string;
    body?: any;
  },
) => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const errorMessage =
      typeof data === "object" && data !== null && "message" in data
        ? (data as any).message
        : response.statusText;
    throw new Error(errorMessage || "Request failed");
  }

  return { data };
};

const api = {
  get: (path: string) => request(path, { method: "GET" }),
  post: (path: string, body?: any) => request(path, { method: "POST", body }),
  put: (path: string, body?: any) => request(path, { method: "PUT", body }),
  delete: (path: string, body?: any) => request(path, { method: "DELETE", body }),
  patch: (path: string, body?: any) => request(path, { method: "PATCH", body }),
};

export default api;
