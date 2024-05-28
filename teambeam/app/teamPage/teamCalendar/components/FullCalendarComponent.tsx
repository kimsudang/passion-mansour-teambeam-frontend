import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import "../styles/main.scss";

type FullCalendarComponentProps = {
  events: {
    id: string;
    title: string;
    start: string;
    end: string;
    location: string;
    content: string;
    link: string;
  }[];
  eventClick: (event: any) => void;
};

const FullCalendarComponent: React.FC<FullCalendarComponentProps> = ({
  events,
  eventClick,
}) => {
  console.log("Events data:", events); // 이벤트 데이터 확인
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek",
      }}
      events={events.map((event) => ({
        ...event,
        extendedProps: {
          ...event,
        },
      }))}
      editable={true}
      selectable={true}
      eventClick={({ event }) => eventClick(event)} // 수정된 부분
    />
  );
};

export default FullCalendarComponent;
