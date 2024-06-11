'use client';

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from 'next/link';
import "./layout.scss";
import {
  fetchCalendarEvents,
  fetchParticipants,
  fetchEventDetails,
  addCalendarEvent,
  deleteCalendarEvent,
} from "@/app/_api/calendar";
import {
  fetchProjectInfo,
  fetchNotices,
  ProjectInfo,
  Notice
} from "./_components/TeamMainInfo";
import { Participant } from "@/app/teamPage/[projectId]/teamTodo/types";

// 캘린더
const FullCalendarComponent = dynamic(
  () => import("../teamCalendar/components/FullCalendarComponent"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);


const TeamPage: React.FC = () => { 
  const { projectId } = useParams<{ projectId: string }>();
  // 프로젝트 정보 & 공지사항
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    projectName: "",
    description: "",
  }); 
  const [notices, setNotices] = useState<Notice[]>([]);
  // 캘린더
  const [events, setEvents] = useState<any[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const fetchEvents = useCallback(
    async (projectId: string, year: number, month: number, token: string, refreshToken: string) => {
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
    []
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

    if (typeof window !== "undefined") {
      const savedAccessToken = localStorage.getItem("Authorization");
      const savedRefreshToken = localStorage.getItem("RefreshToken");
      
      setToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);
    }

    // 프로젝트 데이터를 불러오는 함수
    const getProjectData = async () => {
      if (projectId && token && refreshToken) {
        const projectData = await fetchProjectInfo(projectId, token, refreshToken);
        if (projectData) {
          setProjectInfo(projectData);
        }
      }
    };

    // 공지사항 가져오기
    const getNotices = async () => {
      if (projectId && token) {
        const noticesData = await fetchNotices(projectId, token);
        if (noticesData) {
          setNotices(noticesData);
        }
      }
    };

    if (projectId && token && refreshToken) {
      fetchEvents(projectId, year, month, token, refreshToken);
      fetchParticipantsList(projectId);
      getProjectData();
      getNotices();
    }
  }, [year, month, token, refreshToken, fetchEvents, fetchParticipantsList, projectId]);

  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id || clickInfo.event.extendedProps.id;

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
        <h1>{projectInfo.projectName}</h1>
      </div>
      <div className="description">
        <p className="subTitle">프로젝트 설명</p>
        <p>{projectInfo.description}</p>
      </div>
      <div className="notices">
        <p  className="subTitle">공지사항</p>
        <ul>
          {notices.map(notice => (
            <li key={notice.postId}>
              <Link className="link" href={`/teamPage/${projectId}/teamBoard/${projectId}/${notice.postId}`}>
                <div className="noticeBox">
                  <p>{notice.title}</p>
                  <p>{notice.createDate}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="calendar">
        <Link className="link" href={`/teamPage/${projectId}/teamCalendar`}>
          <FullCalendarComponent events={events} eventClick={handleEventClick} />
        </Link>
      </div>
    </div>
  );
};

export default TeamPage;