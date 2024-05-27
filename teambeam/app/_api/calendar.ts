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

    const events = response.data.data.schedules.map((schedule: any) => ({
      title: schedule.title,
      start: schedule.startDate,
      end: schedule.endDate,
    }));

    return events;
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

// 참가자 조회 함수
export const fetchParticipants = async (projectId: string) => {
  try {
    const response = await api.get(`/api/team/${projectId}/joinMember`, {
      headers: {
        accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
      },
    });

    console.log("API Response for Participants:", response.data);

    const participants = response.data.joinMemberList.map((member: any) => ({
      id: String(member.memberId),
      name: member.memberName,
    }));

    return participants;
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
