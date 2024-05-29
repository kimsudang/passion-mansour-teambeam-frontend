import api from "@/app/_api/api";
import { AxiosError } from "axios";

const token = localStorage.getItem("Authorization");

// 프로젝트 리스트 조회
export const getPorjectList = async (url: string) => {
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

// 프로젝트 생성
export const postPorject = async (
  url: string,
  data: { title: string; content: string }
) => {
  try {
    const res = await api.post(
      url,
      {
        projectName: data.title,
        description: data.content,
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
