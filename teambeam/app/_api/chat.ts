import axios, { AxiosError } from "axios";
import api from "@/app/_api/api";

// 로컬 스토리지에서 토큰을 가져오는 함수
const getToken = () => {
  const token = localStorage.getItem("Authorization");
  if (!token) {
    throw new Error("Authorization token is missing");
  }
  return token;
};

const getRefreshToken = () => {
  const refreshToken = localStorage.getItem("RefreshToken");
  if (!refreshToken) {
    throw new Error("Refresh token is missing");
  }
  return refreshToken;
};

const getMemberId = () => {
  const memberId = localStorage.getItem("MemberId");
  if (!memberId) {
    throw new Error("Member ID is missing");
  }
  return memberId;
};

export type Participant = {
  id: string;
  name: string;
  profileImage: string;
};

// 참가자 조회 함수
export const fetchParticipants = async (
  projectId: string
): Promise<Participant[]> => {
  try {
    const token = getToken();

    const response = await api.get(`/team/${projectId}/joinMember`, {
      headers: {
        Authorization: token,
      },
    });

    if (response.data && response.data.joinMemberList) {
      const participants: Participant[] = response.data.joinMemberList.map(
        (member: any) => ({
          id: String(member.memberId),
          name: member.memberName,
          profileImage: member.profileImg || "/img/memberImage.jpeg",
        })
      );
      return participants;
    } else {
      throw new Error("Invalid response data format");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching participants:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching participants:", error);
    }
    throw error;
  }
};

// 프로필 이미지 조회 함수
export const fetchProfileImage = async (memberId: string): Promise<string> => {
  try {
    const token = getToken();
    const refreshToken = getRefreshToken();

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/member/profileImage/${memberId}`,
      {
        headers: {
          Authorization: token,
          RefreshToken: refreshToken,
        },
      }
    );

    if (response.data && response.data.profileImage) {
      const imageData = response.data.profileImage;
      if (imageData.startsWith("data:image")) {
        return imageData;
      } else {
        return "/img/memberImage.jpeg";
      }
    } else {
      return "/img/memberImage.jpeg";
    }
  } catch (error) {
    console.error("Error fetching profile image:", error);
    return "/img/memberImage.jpeg";
  }
};

// 메시지 조회 함수
export const fetchMessages = async (projectId: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/team/chat/${projectId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// 사용자 정보 조회 함수
export const getUserInfo = async (projectId: string, memberId: string) => {
  const participants = await fetchParticipants(projectId);
  return participants.find(
    (participant: Participant) => participant.id === memberId
  );
};

// 답글 조회 함수
export const fetchComments = async (projectId: string, messageId: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/team/chat/${projectId}/${messageId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};