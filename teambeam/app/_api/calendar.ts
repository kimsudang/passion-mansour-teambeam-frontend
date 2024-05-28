import api from "@/app/_api/api";
import { AxiosError } from "axios";

// 캘린더 이벤트 조회 함수
export const fetchCalendarEvents = async (
  projectId: string,
  year: number,
  month: number
) => {
  try {
    const response = await api.get(
      `/team/${projectId}/calendar/month?year=${year}&month=${month}`,
      {
        headers: {
          accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
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
  scheduleId: string
) => {
  try {
    const response = await api.get(
      `/team/${projectId}/calendar/${scheduleId}`,
      {
        headers: {
          accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
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
    const response = await api.get(`/team/${projectId}/joinMember`, {
      headers: {
        accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
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

// 캘린더 이벤트 추가 함수
export const addCalendarEvent = async (
  projectId: string,
  event: {
    title: string;
    time: string;
    location: string;
    content: string;
    link: string;
    memberId: number[];
  }
) => {
  try {
    const response = await api.post(`/team/${projectId}/calendar`, event, {
      headers: {
        accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
      },
    });

    console.log("Add calendar event response:", response.data);

    if (response.data && response.data.scheduleId) {
      return response.data; // 추가된 이벤트 데이터
    } else {
      throw new Error("Invalid response data format");
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
