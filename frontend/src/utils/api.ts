const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface RequestOptions {
  method: string;
  path: string;
  body?: any;
  isMultipart?: boolean;
}

const request = async ({ method, path, body, isMultipart = false }: RequestOptions) => {
  const token = localStorage.getItem('cv_token');
  const headers: Record<string, string> = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isMultipart ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data.data;
};

export const get = (path: string) => request({ method: 'GET', path });
export const post = (path: string, body?: any, isMultipart = false) =>
  request({ method: 'POST', path, body, isMultipart });
export const patch = (path: string, body: any) => request({ method: 'PATCH', path, body });
export const put = (path: string, body: any) => request({ method: 'PUT', path, body });
export const del = (path: string) => request({ method: 'DELETE', path });
