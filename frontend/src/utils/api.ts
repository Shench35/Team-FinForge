const BASE = 'https://4184-102-89-76-190.ngrok-free.app';

interface RequestOptions {
  method: string;
  path: string;
  body?: any;
  isMultipart?: boolean;
}

export const request = async <T>({ method, path, body, isMultipart = false }: RequestOptions): Promise<T> => {
  const token = localStorage.getItem('finforge_token');
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
    throw new Error(data.message || 'Request failed');
  }
  return data as T;
};

export const get = (path: string) => request({ method: 'GET', path });
export const post = (path: string, body?: any, isMultipart = false) =>
  request({ method: 'POST', path, body, isMultipart });
export const patch = (path: string, body: any) => request({ method: 'PATCH', path, body });
export const put = (path: string, body: any) => request({ method: 'PUT', path, body });
export const del = (path: string) => request({ method: 'DELETE', path });
