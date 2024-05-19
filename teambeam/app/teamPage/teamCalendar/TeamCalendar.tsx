"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import EventModal from "./components/EventModal";
import "./styles/main.scss";

const FullCalendarComponent = dynamic(() => import("./components/FullCalendarComponent"), {
  ssr: false,
});

const TeamCalendar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([
    { title: "All Day Event", start: "2024-05-01" },
    { title: "Long Event", start: "2024-05-07", end: "2024-05-10" },
    { title: "Conference", start: "2024-05-11", end: "2024-05-13" },
    {
      title: "Meeting",
      start: "2024-05-12T10:30:00",
      end: "2024-05-12T12:30:00",
    },
    { title: "Lunch", start: "2024-05-12T12:00:00" },
    { title: "Birthday Party", start: "2024-05-13T07:00:00" },
    { title: "Repeating Event", start: "2024-05-14T16:00:00" },
  ]);

  const handleAddButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEventSave = (event: {
    title: string;
    start: string;
    end: string;
  }) => {
    setEvents([...events, event]);
  };

  return (
    <div className='calendarContainer'>
      <div className='calendarHeader'>
        <h2 className='calendarTitle'>캘린더</h2>
        <button className='addButton' onClick={handleAddButtonClick}>
          일정 추가
        </button>
      </div>
      <FullCalendarComponent events={events} />
      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleEventSave}
      />
    </div>
  );
};

export default TeamCalendar;