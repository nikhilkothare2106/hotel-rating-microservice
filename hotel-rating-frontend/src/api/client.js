const STORAGE_KEY = 'gatewayBaseUrl'
const DEFAULT_BASE_URL = 'http://localhost:8765'

export function getBaseUrl() {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_BASE_URL
}

export function setBaseUrl(url) {
  localStorage.setItem(STORAGE_KEY, url.replace(/\/+$/, ''))
}

export function resetBaseUrl() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getDefaultBaseUrl() {
  return DEFAULT_BASE_URL
}

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, options = {}) {
  const base = getBaseUrl()
  const url = `${base}${path}`
  let response
  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    })
  } catch (err) {
    throw new ApiError(
      `Could not reach the gateway at ${base}. Check that it's running and that the URL in Settings is correct.`,
      0
    )
  }

  if (!response.ok) {
    let detail = ''
    try {
      const body = await response.json()
      detail = body.message || body.error || JSON.stringify(body)
    } catch {
      detail = response.statusText
    }
    throw new ApiError(`Request failed (${response.status}): ${detail}`, response.status)
  }

  if (response.status === 204) return null
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}

export { ApiError }
