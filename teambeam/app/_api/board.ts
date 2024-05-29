import api from "@/app/_api/api";
import { AxiosError } from "axios";

// 게시글 조회
export const getPostList = async (url: string) => {
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

// 게시글 상세 상세 조회
export const getPostDetail = async (url: string) => {
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

// 게시글 생성
export const postAddPost = async (
  url: string,
  data: {
    title: string;
    content: string;
    postType: string;
    notice: boolean;
    postTagIds: number[];
  }
) => {
  try {
    const res = await api.post(
      url,
      {
        title: data.title,
        content: data.content,
        postType: data.postType,
        notice: data.notice,
        postTagIds: data.postTagIds,
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
