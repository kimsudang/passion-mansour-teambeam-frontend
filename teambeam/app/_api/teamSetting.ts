import api from "@/app/_api/api";
import { AxiosError } from "axios";

const getTokenHeaders = () => ({
  Authorization: localStorage.getItem('Authorization'),
  RefreshToken: localStorage.getItem('RefreshToken'),
});

// 프로젝트 정보 API 호출 함수
export const fetchProjectInfo = async (projectId:string) => {
  try {
    const response = await api.get(`/team/${projectId}/setting`, {
      headers: getTokenHeaders(),
    });
    return response.data.project;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error fetching project info:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error fetching project info:", error);
    }
    alert("프로젝트 정보를 확인할 수 없습니다.");
    return null;
  }
};

// 프로젝트 정보 업데이트 API 호출 함수
export const updateProjectInfo = async (projectId: string, projectInfo: ProjectInfo) => {
  try {
    await api.patch(`/team/${projectId}/setting`, projectInfo, {
      headers: getTokenHeaders(),
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error updating project info:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error updating project info:", error);
    }
    alert("프로젝트 정보를 업데이트할 수 없습니다.");
  }
};

// 멤버 정보 API 호출 함수
export const fetchMembersInfo = async (projectId:string) => {
  try {
    const response = await api.get(`/team/${projectId}/joinMember`, {
      headers: getTokenHeaders(),
    });
    return response.data.joinMemberList;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error fetching members info:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error fetching members info:", error);
    }
    alert("멤버 정보를 확인할 수 없습니다.");
    return [];
  }
};

// 멤버 역할 변경 API 호출 함수
export const updateMemberRoles = async (projectId: string, memberRoles: { memberId: number; memberRole: string; }[]) => {
  try {
    console.log("API Request - Update Member Roles:", { members: memberRoles });
    await api.patch(`/team/${projectId}/setting/role`, 
      { members: memberRoles }, 
      {
        headers: getTokenHeaders(),
      }
    );
    alert("작무를 업데이트 했습니다.");
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error updating member roles:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error updating member roles:", error);
    }
    alert("멤버 역할을 업데이트할 수 없습니다.");
  }
};

// 멤버 권한 변경 API 호출 함수
export const updateMemberRole = async (projectId:string, memberId:number) => {
  try {
    const response = await api.patch(`/team/${projectId}/setting/master`, 
      { memberId }, 
      {
        headers: getTokenHeaders(),
      }
    );
    return response.data.joinMemberList; // 성공 시 업데이트된 멤버 리스트 반환
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error updating member role:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error updating member role:", error);
    }
    alert("멤버 권한을 업데이트할 수 없습니다.");
    return [];
  }
};

// 팀원 초대 API 호출 함수
export const inviteMember = async (projectId:string, mail:string) => {
  try {
    await api.post(`/team/${projectId}/setting/member`, { mail }, {
      headers: getTokenHeaders(),
    });
    return { success: true, message: '메일 전송이 성공했습니다.' };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error inviting member:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error inviting member:", error);
    }
    return { success: false, message: '메일 전송에 실패했습니다.' };
  }
};


// 프로젝트의 모든 태그 불러오는 api 호출 함수
export const fetchProjectTags = async (projectId: string) => {
  try {
    const response = await api.get(`/team/${projectId}/tag`, {
      headers: getTokenHeaders(),
    });
    console.log("tag list: ", response.data.tagResponses);
    return response.data.tagResponses;
  } catch (error) {
    console.error("Failed to fetch project tags:", error);
    return [];
  }
};