import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import "../styles/main.scss";

type FullCalendarComponentProps = {
  events: { title: string; start: string; end: string }[];
};

const FullCalendarComponent: React.FC<FullCalendarComponentProps> = ({
  events,
}) => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      initialView='dayGridMonth'
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      events={events}
      editable={true}
      selectable={true}
    />
  );
};

export default FullCalendarComponent;
