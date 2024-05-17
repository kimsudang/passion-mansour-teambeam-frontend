import React from "react";
import dynamic from "next/dynamic";
import "./styles/main.scss";

const FullCalendarComponent = dynamic(
  () => import("./components/FullCalendarComponent"),
  { ssr: false }
);

const teamCalendar: React.FC = () => {
  return (
    <div className="calendarContainer">
      <div className="calendarHeader">
        <h2 className="calendarTitle">캘린더</h2>
        <button className="addButton">일정 추가</button>
      </div>

      <FullCalendarComponent />
    </div>
  );
};

export default teamCalendar;
