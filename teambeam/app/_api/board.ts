import api from "@/app/_api/api";
import { AxiosError } from "axios";

const token = localStorage.getItem("Authorization");

type CellType = {
  key: string;
  value: string;
};

// 전체 게시판 리스트 조회
export const getBoardList = async (url: string) => {
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

// 전체 게시글 리스트 조회
export const getPostList = async (url: string) => {
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

// 게시글 상세 상세 조회
export const getPostDetail = async (url: string) => {
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

// 게시글 - 태그별 조회
export const getPostTagList = async (url: string) => {
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

// 게시글 - 전체 태그 조회
export const getPostTag = async (url: string) => {
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

// 게시글 수정
export const editPost = async (
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

// 게시글 삭제
export const deletePost = async (url: string) => {
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

// 댓글 조회
export const getComment = async (url: string) => {
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

// 댓글 등록
export const postComment = async (url: string, data: { content: string }) => {
  try {
    const res = await api.post(
      url,
      {
        content: data.content,
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
