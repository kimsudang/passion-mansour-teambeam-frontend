import api from "@/app/_api/api";
import axios, { AxiosError } from "axios";

// 로컬 스토리지에서 토큰을 가져오는 함수
const getToken = () => {
  const token = localStorage.getItem("Authorization");
  if (!token) {
    throw new Error("Authorization token is missing");
  }
  return token;
};

const getRefreshToken = () => {
  const token = localStorage.getItem("RefreshToken");
  if (!token) {
    throw new Error("Refresh token is missing");
  }
  return token;
};

// 캘린더 이벤트 조회 함수
export const fetchCalendarEvents = async (
  projectId: string,
  year: number,
  month: number,
  token: string,
  refreshToken: string
) => {
  try {
    const response = await axios.get(
      `http://34.22.108.250:8080/api/team/${projectId}/calendar/month`,
      {
        params: { year, month },
        headers: {
          Authorization: token,
          RefreshToken: refreshToken,
        },
      }
    );

    console.log("Calendar events response:", response.data);

    if (response.data && response.data.status === "200") {
      const scheduleEvents = response.data.schedules.map((schedule: any) => ({
        id: schedule.scheduleId,
        title: schedule.title,
        start: schedule.time,
        end: schedule.time,
        location: schedule.location,
        content: schedule.content,
        link: schedule.link,
        assignees: schedule.scheduleMembers.map(
          (member: any) => member.memberId
        ),
      }));

      const todoEvents = response.data.topTodos.map((todo: any) => ({
        id: todo.topTodoId,
        title: todo.title,
        start: todo.startDate,
        end: todo.endDate,
        todo: true,
      }));

      return [...scheduleEvents, ...todoEvents];
    } else {
      throw new Error("Invalid response data format");
    }
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

// 캘린더 이벤트 상세 조회 함수
export const fetchEventDetails = async (
  projectId: string,
  scheduleId: string,
  token: string,
  refreshToken: string
) => {
  try {
    const response = await api.get(
      `/team/${projectId}/calendar/${scheduleId}`,
      {
        headers: {
          Authorization: token,
          RefreshToken: refreshToken,
        },
      }
    );

    console.log("Event details response:", response.data);

    if (response.data && response.data.data) {
      return response.data.data; // 상세 조회한 이벤트 데이터
    } else {
      throw new Error("Invalid response data format");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching event details:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching event details:", error);
    }
    throw error;
  }
};

// 참가자 조회 함수
export const fetchParticipants = async (projectId: string) => {
  try {
    const token = getToken();

    const response = await api.get(`/team/${projectId}/joinMember`, {
      headers: {
        Authorization: token,
      },
    });

    console.log("Participants response:", response.data);

    if (response.data && response.data.joinMemberList) {
      const participants = response.data.joinMemberList.map((member: any) => ({
        id: String(member.memberId),
        name: member.memberName,
      }));
      return participants;
    } else {
      throw new Error("Invalid response data format");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
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

export const addCalendarEvent = async (
  projectId: string,
  event: {
    title: string;
    time: string;
    location?: string;
    content?: string;
    link?: string;
    memberId: number[];
  }
) => {
  try {
    console.log("Adding event:", event);

    if (!event.title || !event.time) {
      throw new Error("일정명과 일시는 필수 입력 항목입니다.");
    }

    const response = await api.post(`/team/${projectId}/calendar`, {
      title: event.title,
      time: event.time,
      location: event.location || "",
      content: event.content || "",
      link: event.link || "",
      memberId: event.memberId,
    });

    console.log("Add calendar event response:", response.data);

    if (response.data && response.data.scheduleId) {
      return response.data;
    } else {
      throw new Error("응답 데이터 형식이 유효하지 않습니다");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error adding calendar event:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error adding calendar event:", error);
    }
    throw error;
  }
};

// 일정 삭제 함수
export const deleteCalendarEvent = async (
  projectId: string,
  scheduleId: number,
  token: string,
  refreshToken: string
) => {
  try {
    const response = await api.delete(
      `/team/${projectId}/calendar/${scheduleId}`,
      {
        headers: {
          Authorization: token,
          RefreshToken: refreshToken,
        },
      }
    );

    console.log("Delete calendar event response:", response.data);

    // 응답 데이터가 없거나 status가 200일 경우 성공으로 처리
    if (!response.data || (response.data && response.data.status === 200)) {
      return response.data; // 삭제된 일정 데이터 반환
    } else {
      console.log("Response data:", response.data);
      throw new Error("Invalid response data format");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error deleting calendar event:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error deleting calendar event:", error);
    }
    throw error;
  }
};
