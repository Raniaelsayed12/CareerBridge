import axios from "axios";

const STORAGE_KEY = "careerbridge-user";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

function getStoredUser() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);

    if (!value) {
      return null;
    }

    const user = JSON.parse(value);

    if (!user || typeof user !== "object") {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Could not read stored user:", error);
    localStorage.removeItem(STORAGE_KEY);

    return null;
  }
}

api.interceptors.request.use(
    (config) => {
      const user = getStoredUser();

      if (user?._id) {
        /*
          Send userId as a query parameter.
          This also works for GET, POST, PUT and DELETE.
        */
        config.params = {
          ...(config.params || {}),
          userId: user._id,
        };

        /*
          Also include userId in request bodies.
        */
        if (
            ["post", "put", "patch"].includes(
                config.method?.toLowerCase()
            )
        ) {
          config.data = {
            ...(config.data || {}),
            userId: user._id,
          };
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error.response) {
        console.error(
            "CareerBridge backend is not reachable:",
            error.message
        );
      } else {
        console.error("Backend error:", {
          status: error.response.status,
          message:
              error.response.data?.message ||
              error.message,
          url: error.config?.url,
        });
      }

      return Promise.reject(error);
    }
);

export default api;