import api from "@/app/_api/api";

export interface ProjectInfo {
  projectName: string;
  description: string;
}

export interface Notice {
  postId: number;
  title: string;
  createDate: string;
}

// 프로젝트 정보 API 호출 함수
export const fetchProjectInfo = async (projectId: string, token: string, refreshToken: string): Promise<ProjectInfo | null> => {
  try {
    const response = await api.get(`/team/${projectId}/setting`, {
      headers: {
        Authorization: token,
        RefreshToken: refreshToken,
      },
    });
    return response.data.project;
  } catch (error) {
    console.error("Error fetching project info:", error);
    return null;
  }
};

// 공지사항 API 호출 함수
export const fetchNotices = async (projectId: string, token: string): Promise<Notice[] | null> => {
  try {
    const response = await api.get(`/team/${projectId}/notice`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data.postResponses;
  } catch (error) {
    console.error('Error fetching notices:', error);
    return null;
  }
};