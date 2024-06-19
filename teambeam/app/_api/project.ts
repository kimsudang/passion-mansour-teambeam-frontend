import api from "@/app/_api/api";
import { AxiosError } from "axios";

// 프로젝트 정보 조회
export const getPorjectDetail = async (url: string) => {
  try {
    const res = await api.get(url);

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

// 프로젝트 리스트 조회
export const getPorjectList = async (url: string) => {
  try {
    const res = await api.get(url);

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
export const postPorject = async (
  url: string,
  data: { title: string; content: string }
) => {
  try {
    const res = await api.post(url, {
      projectName: data.title,
      description: data.content,
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
