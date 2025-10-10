const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

async function post(path: string, body: any) {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body),
  });
  return { data: await res.json(), status: res.status, ok: res.ok };
}

async function get(path: string) {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(BASE + path, {
    headers: {
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
  });
  return { data: await res.json(), status: res.status, ok: res.ok };
}

async function put(path: string, body: any) {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(BASE + path, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body),
  });
  return { data: await res.json(), status: res.status, ok: res.ok };
}

async function del(path: string) {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(BASE + path, {
    method: "DELETE",
    headers: {
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
  });
  return { data: await res.json(), status: res.status, ok: res.ok };
}

export const backendClient = { post, get, put, delete: del };
