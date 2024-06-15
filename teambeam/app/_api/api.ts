import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("Authorization");
    const refreshToken = localStorage.getItem("RefreshToken");

    if (accessToken && refreshToken) {
      config.headers.Authorization = `${accessToken}`;
      config.headers.RefreshToken = `${refreshToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return error;
  }
);

export default api;
