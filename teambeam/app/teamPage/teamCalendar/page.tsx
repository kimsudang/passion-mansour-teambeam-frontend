"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import EventModal from "./components/EventModal";
import "./styles/main.scss";
import {
  fetchCalendarEvents,
  fetchParticipants,
  fetchEventDetails,
  addCalendarEvent,
} from "@/app/_api/calendar";
import { Participant } from "@/app/teamPage/teamTodo/types";

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

  useEffect(() => {
    const projectId = "1";
    fetchEvents(projectId, year, month);
    fetchParticipantsList(projectId);
  }, [year, month]);

  const fetchEvents = async (
    projectId: string,
    year: number,
    month: number
  ) => {
    try {
      const events = await fetchCalendarEvents(projectId, year, month);
      setEvents(events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchParticipantsList = async (projectId: string) => {
    try {
      const participants = await fetchParticipants(projectId);
      console.log("Fetched Participants:", participants);
      setParticipants(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const fetchEventDetail = async (projectId: string, scheduleId: string) => {
    try {
      const event = await fetchEventDetails(projectId, scheduleId);
      setSelectedEvent({
        title: event.title,
        time: event.time,
        location: event.location,
        content: event.content,
        link: event.link,
        assignees: event.scheduleMembers.map(
          (member: Participant) => member.id
        ), // id 사용
        id: event.scheduleId,
      });
      setIsReadOnly(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching event details:", error);
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
        memberId: event.assignees,
      });
      console.log("Saved event:", savedEvent);

      // 기존 이벤트 목록에 새 이벤트 추가
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
          ), // id 사용
        },
      ]);

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    const projectId = "1"; // 실제 프로젝트 ID 사용
    console.log("Clicked event info:", clickInfo);
    const eventId =
      clickInfo.event.extendedProps.id ||
      clickInfo.event.extendedProps.scheduleId;
    if (eventId) {
      fetchEventDetail(projectId, eventId);
    } else {
      console.error("Event ID is undefined");
    }
  };

  const handleEventDelete = () => {
    if (selectedEvent) {
      setEvents(events.filter((e) => e.id !== selectedEvent.id));
      setIsModalOpen(false);
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
      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleEventSave}
        participants={participants}
        readonly={isReadOnly}
        onDelete={handleEventDelete}
        initialEvent={selectedEvent}
      />
    </div>
  );
};

export default TeamCalendar;
