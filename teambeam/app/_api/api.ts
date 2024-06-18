import axios from "axios";
import useUserStore from "@/app/_store/useUserStore";

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
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (config && config._retry) {
      return Promise.reject(error);
    }

    if (!response || response.status !== 401) {
      return Promise.reject(error);
    }

    config._retry = true; // 무한 재요청 방지

    if (response.status === 401) {
      try {
        const _res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/refresh`,
          {},
          {
            headers: {
              RefreshToken: `${localStorage.getItem("RefreshToken")}`,
            },
          }
        );

        if (_res.status === 200) {
          const newAccessToken = _res.headers.authorization;
          localStorage.setItem("Authorization", newAccessToken);

          useUserStore
            .getState()
            .setUser(
              newAccessToken,
              localStorage.getItem("RefreshToken"),
              localStorage.getItem("MemberId")
            );
          config.headers["Authorization"] = newAccessToken;
        }

        return api(config); // 재요청
      } catch (err) {
        console.error("Token refresh failed, logging out...");
        localStorage.removeItem("Authorization");
        localStorage.removeItem("RefreshToken");
        localStorage.removeItem("MemberId");
        useUserStore.getState().clearUser();
        window.location.href = "/user/login";
        return Promise.reject(error);
      }
    }
  }
);

export default api;
