'use client';

import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import axios from 'axios';
import Link from 'next/link';
import "./layout.scss";

interface ProjectInfo {
  projectName: string;
  description: string;
}

interface Notice {
  postId: number;
  title: string;
  createDate: string;
}

import {
  fetchCalendarEvents,
  fetchParticipants,
  fetchEventDetails,
  addCalendarEvent,
  deleteCalendarEvent,
} from "@/app/_api/calendar";
import { Participant } from "@/app/teamPage/[projectId]/teamTodo/types";

// 프로젝트 정보 API 호출 함수
const fetchProjectInfo = async (token: string | null, refreshToken: string | null): Promise<ProjectInfo | null> => {
  try {
    const response = await axios.get(`http://34.22.108.250:8080/api/team/5/setting`, {
      headers: {
        Authorization: token ?? "",
        RefreshToken: refreshToken ?? "",
      },
    });
    return response.data.project;
  } catch (error) {
    alert("프로젝트 정보를 확인할 수 없습니다.");
    console.error("Error fetching project info:", error);
    return null;
  }
};

// 공지사항 API 호출 함수
const fetchNotices = async (token: string | null): Promise<Notice[] | null> => {
  try {
    const response = await axios.get('http://34.22.108.250:8080/api/team/5/notice', {
      headers: {
        Authorization: token ?? '',
      },
    });
    return response.data.postResponses;
  } catch (error) {
    alert('공지사항을 확인할 수 없습니다.');
    console.error('Error fetching notices:', error);
    return null;
  }
};

// 캘린더
const FullCalendarComponent = dynamic(
  () => import("../teamCalendar/components/FullCalendarComponent"),
  {
    ssr: false,
  }
);


const TeamPage: React.FC = () => {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    projectName: "",
    description: "",
  }); 
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [token, setToken] = useState(
    localStorage.getItem("Authorization") || ""
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("RefreshToken") || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = useCallback(
    async (projectId: string, year: number, month: number) => {
      try {
        const events = await fetchCalendarEvents(
          projectId,
          year,
          month,
          token,
          refreshToken
        );
        setEvents(events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    },
    [token, refreshToken]
  );

  const fetchParticipantsList = useCallback(async (projectId: string) => {
    try {
      const participants = await fetchParticipants(projectId);
      console.log("Fetched Participants:", participants);
      setParticipants(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('Authorization');
    const refreshToken = localStorage.getItem('RefreshToken');

    // 프로젝트 정보 가져오기
    const getProjectData = async () => {
      const projectData = await fetchProjectInfo(token, refreshToken);
      if (projectData) {
        setProjectInfo(projectData);
      }
    };

    const getNotices = async () => {
      const noticesData = await fetchNotices(token);
      if (noticesData) {
        setNotices(noticesData);
      }
    };

    getProjectData();
    getNotices();
  }, [year, month, token, refreshToken, fetchEvents, fetchParticipantsList]);

  const handleEventClick = (clickInfo: any) => {
    const projectId = "1"; // 실제 프로젝트 ID 사용
    console.log("Clicked event info:", clickInfo);
    console.log("Event details:", clickInfo.event);
    console.log("Extended Props:", clickInfo.event.extendedProps);

    const eventId = clickInfo.event.id || clickInfo.event.extendedProps.id;
    console.log("Event ID:", eventId);

    if (eventId) {
      // 캘린더 페이지로 이동
      window.location.href = `/teamPage/${projectId}/teamCalendar`;
    } else {
      console.error("Event ID is undefined");
    }
  };

  return (
    <div className="teamDashContainer">
      <div className="title">
        <p>{projectInfo.projectName}</p>
      </div>
      <div className="description">
        <p>프로젝트 설명</p>
        <p>{projectInfo.description}</p>
      </div>
      <div className="notices">
        <p>공지사항</p>
        <ul>
          {notices.map(notice => (
            <li key={notice.postId}>
              <Link className="link" href={`/teamPage/5/teamBoard/5/${notice.postId}`}>
                <p>{notice.title}</p>
                <p>{notice.createDate}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="calendar">
        <Link className="link" href={`/teamPage/5/teamCalendar`}>
          <FullCalendarComponent events={events} eventClick={handleEventClick} />
        </Link>
      </div>
    </div>
  );
};

export default TeamPage;