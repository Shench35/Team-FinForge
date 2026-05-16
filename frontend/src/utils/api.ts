const BASE = "https://fond-dory-suitable.ngrok-free.app";

interface RequestOptions {
  method: string;
  path: string;
  body?: any;
  isMultipart?: boolean;
  baseUrl?: string;
  noAuth?: boolean;
}

export const request = async <T>({
  method,
  path,
  body,
  isMultipart = false,
  baseUrl = BASE,
  noAuth = false,
}: RequestOptions): Promise<T> => {
  const token = noAuth ? null : localStorage.getItem("finforge_token");
  const headers: Record<string, string> = {
    ...(token && { Authorization: `Bearer ${token}` }),
    "ngrok-skip-browser-warning": "true",
  };
  const requestBody: BodyInit | undefined = isMultipart
    ? (body as BodyInit | undefined)
    : body !== undefined
      ? JSON.stringify(body)
      : undefined;

  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: requestBody,
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data.detail || data.message || "Request failed";
    throw new Error(errorMessage);
  }
  return data as T;
};

export const get = (path: string) => request({ method: "GET", path });
export const post = (path: string, body?: unknown, isMultipart = false) =>
  request({ method: "POST", path, body, isMultipart });
export const patch = (path: string, body: unknown) =>
  request({ method: "PATCH", path, body });
export const put = (path: string, body: unknown) =>
  request({ method: "PUT", path, body });
export const del = (path: string) => request({ method: "DELETE", path });
