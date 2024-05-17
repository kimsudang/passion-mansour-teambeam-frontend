'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import '../styles/main.scss';

const FullCalendarComponent: React.FC = () => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      }}
      events={[
        { title: 'All Day Event', start: '2024-05-01' },
        { title: 'Long Event', start: '2024-05-07', end: '2024-05-10' },
        { title: 'Conference', start: '2024-05-11', end: '2024-05-13' },
        { title: 'Meeting', start: '2024-05-12T10:30:00', end: '2024-05-12T12:30:00' },
        { title: 'Lunch', start: '2024-05-12T12:00:00' },
        { title: 'Birthday Party', start: '2024-05-13T07:00:00' },
        { title: 'Repeating Event', start: '2024-05-14T16:00:00' },
      ]}
      editable={true}
      selectable={true}
    />
  );
};

export default FullCalendarComponent;
