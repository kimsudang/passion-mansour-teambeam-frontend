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

  useEffect(() => {
    const projectId = "1";
    fetchEvents(projectId);
    fetchParticipantsList(projectId);
  }, []);

  const fetchEvents = async (projectId: string) => {
    try {
      const events = await fetchCalendarEvents(projectId, 2024, 5);
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
        assignees: event.scheduleMembers.map((member: any) => member.memberId),
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
    const projectId = "1"; // 실제 프로젝트 ID 사용
    try {
      const savedEvent = await addCalendarEvent(projectId, event);
      setEvents([
        ...events,
        {
          ...savedEvent,
          start: savedEvent.time,
          end: savedEvent.time,
        },
      ]);
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
