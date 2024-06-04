"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import EventModal from "./components/EventModal";
import "./styles/TeamCalendar.scss";
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
  const [token, setToken] = useState(
    localStorage.getItem("Authorization") || ""
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("RefreshToken") || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : params.projectId;

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
    if (projectId) {
      fetchEvents(projectId, year, month);
      fetchParticipantsList(projectId);
    }
  }, [
    year,
    month,
    token,
    refreshToken,
    fetchEvents,
    fetchParticipantsList,
    projectId,
  ]);

  const fetchEventDetail = async (projectId: string, scheduleId: string) => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
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
      if (!projectId) return; // projectId가 없으면 return
      const savedEvent = await addCalendarEvent(projectId, {
        ...event,
        memberId: event.assignees.map(
          (assignee: { id: number }) => assignee.id
        ),
      });
      console.log("Saved event:", savedEvent);

      // 이벤트 목록 다시 가져오기
      await fetchEvents(projectId, year, month);

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleEventDelete = async (scheduleId: number) => {
    try {
      if (!projectId) return; // projectId가 없으면 return
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
    if (!projectId) return; // projectId가 없으면 return
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
