import api from "@/app/_api/api";
import { AxiosError } from "axios";

const token = localStorage.getItem("Authorization");

// 메모 리스트 조회
export const getMemoList = async (url: string) => {
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

// 메모 리스트 상세 조회
export const getMemoDetailList = async (url: string) => {
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

// 메모 생성
export const postMemo = async (
  url: string,
  data: { title: string; content: string }
) => {
  try {
    const res = await api.post(
      url,
      {
        memoTitle: data.title,
        memoContent: data.content,
      },
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

// 메모 삭제
export const deleteMemo = async (url: string) => {
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

// 메모 수정
export const editMemo = async (
  url: string,
  data: { memoTitle: string; memoContent: string }
) => {
  try {
    const res = await api.patch(url, data, {
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
