"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import EventModal from "./components/EventModal";
import "./styles/main.scss";
import { fetchCalendarEvents, fetchParticipants } from "@/app/_api/calendar";
import { Participant } from "@/app/teamPage/teamTodo/types";

const FullCalendarComponent = dynamic(
  () => import("./components/FullCalendarComponent"),
  {
    ssr: false,
  }
);

const TeamCalendar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleAddButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEventSave = (event: any) => {
    setEvents([...events, event]);
  };

  return (
    <div className="calendarContainer">
      <div className="calendarHeader">
        <h2 className="calendarTitle">캘린더</h2>
        <button className="addButton" onClick={handleAddButtonClick}>
          일정 추가
        </button>
      </div>
      <FullCalendarComponent events={events} />
      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleEventSave}
        participants={participants}
      />
    </div>
  );
};

export default TeamCalendar;
