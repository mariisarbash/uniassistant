const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const api = {
  get: (endpoint) => fetch(`${API_URL}${endpoint}`),
  post: (endpoint, data) => fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  put: (endpoint, data) => fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  patch: (endpoint, data) => fetch(`${API_URL}${endpoint}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  delete: (endpoint) => fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE'
  })
};