'use client';

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import axios from 'axios';
import Link from 'next/link';
import "./layout.scss";
import {
  fetchCalendarEvents,
  fetchParticipants,
  fetchEventDetails,
  addCalendarEvent,
  deleteCalendarEvent,
} from "@/app/_api/calendar";
import { Participant } from "@/app/teamPage/[projectId]/teamTodo/types";


interface ProjectInfo {
  projectName: string;
  description: string;
}

interface Notice {
  postId: number;
  title: string;
  createDate: string;
}



// 프로젝트 정보 API 호출 함수
const fetchProjectInfo = async (projectId: string, token: string | null, refreshToken: string | null): Promise<ProjectInfo | null> => {
  
  try {
    const response = await axios.get(`http://34.22.108.250:8080/api/team/${projectId}/setting`, {
      headers: {
        Authorization: token,
        RefreshToken: refreshToken,
      },
    });
    return response.data.project;
  } catch (error) {
    // alert("프로젝트 정보를 확인할 수 없습니다.");
    console.error("Error fetching project info:", error);
    return null;
  }
};

// 공지사항 API 호출 함수
const fetchNotices = async (projectId: string, token: string | null): Promise<Notice[] | null> => {
  try {
    const response = await axios.get(`http://34.22.108.250:8080/api/team/${projectId}/notice`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data.postResponses;
  } catch (error) {
    // alert('공지사항을 확인할 수 없습니다.');
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
  const token = localStorage.getItem("Authorization") || "";
  const refreshToken = localStorage.getItem("RefreshToken") || "";

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

    // 프로젝트 데이터를 불러오는 함수
    const getProjectData = async () => {
      if (projectId) {
        const projectData = await fetchProjectInfo(projectId, token, refreshToken);
        if (projectData) {
          setProjectInfo(projectData);
        }
      }
    };

    // 공지사항 가져오기
    const getNotices = async () => {
      const noticesData = await fetchNotices(projectId, token);
      if (noticesData) {
        setNotices(noticesData);
      }
    };

    getProjectData();
    getNotices();
    fetchEvents(projectId, year, month);
    fetchParticipantsList(projectId);
  }, [year, month, token, refreshToken, fetchEvents, fetchParticipantsList, projectId]);

  const handleEventClick = (clickInfo: any) => {
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