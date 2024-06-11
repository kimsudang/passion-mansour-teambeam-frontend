import api from "@/app/_api/api";
import { AxiosError } from "axios";

// 전체 북마크 리스트 조회
export const getBookmarkList = async (url: string, token: string) => {
  try {
    const res = await api.get(url, {
      headers: {
        Authorization: token,
      },
      withCredentials: true,
    });

    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching calendar events:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching calendar events:", error);
    }
    throw error;
  }
};

// 북마크 상세 조회
export const getBookmarkDetail = async (url: string, token: string) => {
  try {
    const res = await api.get(url, {
      headers: {
        Authorization: token,
      },
      withCredentials: true,
    });

    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching calendar events:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching calendar events:", error);
    }
    throw error;
  }
};

// 북마크 등록
export const postBookmark = async (url: string, token: string) => {
  try {
    const res = await api.post(
      url,
      {},
      {
        headers: {
          Authorization: token,
        },
        withCredentials: true,
      }
    );

    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching calendar events:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching calendar events:", error);
    }
    throw error;
  }
};

// 북마크 제거
export const deleteBookmark = async (url: string, token: string) => {
  try {
    const res = await api.delete(url, {
      headers: {
        Authorization: token,
      },
      withCredentials: true,
    });

    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching calendar events:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching calendar events:", error);
    }
    throw error;
  }
};
