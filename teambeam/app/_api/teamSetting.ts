import api from "@/app/_api/api";
import { AxiosError } from "axios";

// 프로젝트 정보 인터페이스 정의
export interface ProjectInfo {
  projectName: string;
  description: string;
  projectStatus: string;
}

// 멤버 정보 인터페이스 정의
export interface MemberInfo {
  memberId: number;
  memberName: string;
  mail: string;
  memberRole: string;
  host: boolean;
  profileImage: string;
}

// 태그 정보 인터페이스 정의
export interface TagInfo {
  tagId: number;
  tagName: string;
  tagCategory: string;
  projectId: number;
}

const getTokenHeaders = () => ({
  Authorization: localStorage.getItem('Authorization'),
  RefreshToken: localStorage.getItem('RefreshToken'),
});


// 에러 처리 핸들러
const handleApiError = (error: unknown, errorMessage: string) => {
  if (error instanceof AxiosError) {
    console.error(`${errorMessage}:`, error.response?.data || error.message);
  } else {
    console.error(`Unexpected error: ${errorMessage}`, error);
  }
};

// 프로젝트 정보 API 호출 함수
export const fetchProjectInfo = async (projectId:string) => {
  try {
    const response = await api.get(`/team/${projectId}/setting`, {
      headers: getTokenHeaders(),
    });
    return response.data.project;
  } catch (error) {
    handleApiError(error, "프로젝트 정보를 확인할 수 없습니다.");
    alert( "프로젝트 정보를 확인할 수 없습니다.");
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
    handleApiError(error, "프로젝트 정보를 업데이트할 수 없습니다.");
    alert("프로젝트 정보를 업데이트할 수 없습니다.");
  }
};

// 멤버 정보 API 호출 함수
export const fetchMembersInfo = async (projectId:string) => {
  try {
    const response = await api.get(`/team/${projectId}/joinMember`, {
      headers: getTokenHeaders(),
    });
    console.log( response.data.joinMemberList);
    return response.data.joinMemberList;
  } catch (error) {
    handleApiError(error, "멤버 정보를 확인할 수 없습니다.");
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
    console.log("직무 업데이트 성공.");
  } catch (error) {
    handleApiError(error, "멤버 역할을 업데이트할 수 없습니다.");
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
    handleApiError(error, "멤버 권한을 업데이트할 수 없습니다.");
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
    handleApiError(error, '메일 전송에 실패했습니다.');
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
    handleApiError(error, "태그 정보를 불러올 수 없습니다.");
    return [];
  }
};

// 태그 추가 API 호출 함수
export const createTag = async (projectId: string, tagName: string, tagCategory: string | null) => {
  try {
    const response = await api.post(`/team/${projectId}/tag`, 
      { tagName, tagCategory }, 
      {
        headers: getTokenHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "태그를 추가할 수 없습니다.");
  }
};

// 태그 삭제 API 호출 함수
export const deleteTag = async (projectId: string, tagId: number) => {
  try {
    await api.delete(`/team/${projectId}/tag/${tagId}`, {
      headers: getTokenHeaders(),
    });
  } catch (error) {
    handleApiError(error, "태그를 삭제할 수 없습니다.");
  }
};

// 멤버 삭제 API 호출 함수
export const deleteMember = async (projectId: string, memberId: number) => {
  try {
    const response = await api.delete(`/team/${projectId}/setting/member`, {
      headers: getTokenHeaders(),
      data: { memberId },
    });
    return response.data.joinMemberList;
  } catch (error) {
    handleApiError(error, "멤버를 삭제할 수 없습니다.");
    alert("멤버를 삭제할 수 없습니다.");
    return [];
  }
};

// 프로젝트 삭제 API 호출 함수
export const deleteProject = async (projectId: string) => {
  try {
    await api.delete(`/team/project/${projectId}`, {
      headers: getTokenHeaders(),
    });
    alert("프로젝트가 삭제되었습니다.");
  } catch (error) {
    handleApiError(error, "프로젝트를 삭제할 수 없습니다.");
    alert("프로젝트를 삭제할 수 없습니다.");
  }
};