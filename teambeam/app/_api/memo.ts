import api from "@/app/_api/api";
import { AxiosError } from "axios";

// 메모 리스트 조회
export const getMemoList = async (url: string) => {
  try {
    const res = await api.get(url, {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
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
        Authorization: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
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

// 프로젝트 생성
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
          Authorization: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
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
