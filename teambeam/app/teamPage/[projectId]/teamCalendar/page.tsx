"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import EventModal from "./components/EventModal";
import "./styles/main.scss";
import {
  fetchCalendarEvents,
  fetchParticipants,
  fetchEventDetails,
  addCalendarEvent,
  deleteCalendarEvent,
} from "@/app/_api/calendar";
import { Participant } from "@/app/teamPage/[projectId]/teamTodo/types";

const FullCalendarComponent = dynamic(
  () => import("./components/FullCalendarComponent"),
  {
    ssr: false,
  }
);

const TeamCalendar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [token, setToken] = useState(""); // 실제 토큰 값 설정
  const [refreshToken, setRefreshToken] = useState(""); // 실제 리프레시 토큰 값 설정
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

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
    const projectId = "1";
    fetchEvents(projectId, year, month);
    fetchParticipantsList(projectId);
  }, [year, month, token, refreshToken, fetchEvents, fetchParticipantsList]);

  const fetchEventDetail = async (projectId: string, scheduleId: string) => {
    try {
      setIsLoading(true); // 로딩 상태 시작
      const event = await fetchEventDetails(
        projectId,
        scheduleId,
        token,
        refreshToken
      );
      setSelectedEvent({
        title: event.title,
        time: event.time,
        location: event.location,
        content: event.content,
        link: event.link,
        assignees: event.scheduleMembers.map((member: any) => ({
          id: member.memberId,
          name: member.memberName,
        })),
        id: event.scheduleId,
      });
      setIsReadOnly(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  const handleAddButtonClick = () => {
    setSelectedEvent(null);
    setIsReadOnly(false);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEventSave = async (event: any) => {
    try {
      const projectId = "1";
      const savedEvent = await addCalendarEvent(projectId, {
        ...event,
        memberId: event.assignees.map(
          (assignee: { id: number }) => assignee.id
        ),
      });
      console.log("Saved event:", savedEvent);

      setEvents((prevEvents) => [
        ...prevEvents,
        {
          id: savedEvent.scheduleId,
          title: savedEvent.title,
          start: savedEvent.time,
          end: savedEvent.time, // 필요한 경우 끝 시간을 따로 설정
          location: savedEvent.location,
          content: savedEvent.content,
          link: savedEvent.link,
          assignees: savedEvent.scheduleMembers.map(
            (member: Participant) => member.id
          ),
        },
      ]);

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleEventDelete = async (scheduleId: number) => {
    try {
      const projectId = "1"; // 실제 프로젝트 ID 사용
      const response = await deleteCalendarEvent(
        projectId,
        scheduleId,
        token,
        refreshToken
      );
      console.log("Delete response:", response);

      // 이벤트 목록에서 삭제된 이벤트 제거
      setEvents(events.filter((e) => e.id !== scheduleId));

      // 모달 창 닫기
      setIsModalOpen(false);

      // 성공 메시지 표시
      alert("일정이 성공적으로 삭제되었습니다.");

      // 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error("Error deleting event:", error);
      // 실패 메시지 표시
      alert("일정 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEventClick = (clickInfo: any) => {
    const projectId = "1"; // 실제 프로젝트 ID 사용
    console.log("Clicked event info:", clickInfo);
    console.log("Event details:", clickInfo.event);
    console.log("Extended Props:", clickInfo.event.extendedProps);

    const eventId = clickInfo.event.id || clickInfo.event.extendedProps.id;
    console.log("Event ID:", eventId);

    if (eventId) {
      fetchEventDetail(projectId, eventId);
    } else {
      console.error("Event ID is undefined");
    }
  };

  return (
    <div className="calendarContainer">
      <div className="calendarHeader">
        <h2 className="calendarTitle">캘린더</h2>
        <button className="addButton" onClick={handleAddButtonClick}>
          일정 추가
        </button>
      </div>
      <FullCalendarComponent events={events} eventClick={handleEventClick} />
      {isModalOpen && !isLoading && (
        <EventModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleEventSave}
          participants={participants}
          readonly={isReadOnly}
          onDelete={handleEventDelete}
          initialEvent={selectedEvent}
        />
      )}
      {isLoading && <div className="loadingIndicator">Loading...</div>}
    </div>
  );
};

export default TeamCalendar;
