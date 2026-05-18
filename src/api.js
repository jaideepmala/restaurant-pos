const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const API_ORIGIN = isLocal
  ? "http://127.0.0.1:5000"
  : "https://restaurant-pos-backend-816k.onrender.com";

export const API_BASE = API_ORIGIN + "/api";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};
