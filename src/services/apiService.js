export async function httpAPIBase(method, endpoint, body, headers = {}) {
  const token = localStorage.getItem("token");
  const isFormData = body instanceof FormData;

  const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
    method,
    headers: {
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
       credentials: "include",
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (err) {
      console.warn("Error al parsear respuesta JSON:", err);
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const httpAPIPost = (endpoint, body, headers) =>
  httpAPIBase("POST", endpoint, body, headers);

export const httpAPIGet = (endpoint, headers) =>
  httpAPIBase("GET", endpoint, undefined, headers);

export const httpAPIPut = (endpoint, body, headers) =>
  httpAPIBase("PUT", endpoint, body, headers);

export const httpAPIDelete = (endpoint, headers) =>
  httpAPIBase("DELETE", endpoint, undefined, headers);

export const httpAPIPatch = (endpoint, body, headers) =>
  httpAPIBase("PATCH", endpoint, body, headers);
