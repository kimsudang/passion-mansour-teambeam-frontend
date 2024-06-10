"use client";

import React, { useEffect, useState, useCallback } from "react";
import "./layout.scss";
import { getTodos, Todo, fetchCalendarEvents } from "@/app/_api/todayTodo";
import dynamic from "next/dynamic";

interface ProjectTodos {
  projectName: string;
  todos: Todo[];
}

// 캘린더
const FullCalendarComponent = dynamic(
  () => import("../../teamPage/[projectId]/teamCalendar/components/FullCalendarComponent"),
  {
    ssr: false,
  }
);

// 캘린더 이벤트를 클릭할 때 호출되는 함수
const handleEventClick = (clickInfo: any) => {
  console.log("Event clicked, but no action taken.");
};

const PrivatePage: React.FC = () => {
  const [todayDate, setTodayDate] = useState<string>("");
  const [userId, setUserId] = useState<string>();
  const [projectTodos, setProjectTodos] = useState<ProjectTodos[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 캘린더
  const [events, setEvents] = useState<any[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  // const [calendarData, setCalendarData] = useState<CalendarData | null>(null);

  const fetchEvents = useCallback(
    async (userId:string, year: number, month: number) => {
      try {
        const events = await fetchCalendarEvents(
          userId,
          year,
          month,
        );
        setEvents(events);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError('일정을 가져오는 중 오류가 발생했습니다.');
      }
    },
    []
  );

  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    setTodayDate(date);
    
    const storedUserId = localStorage.getItem("MemberId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchTodos = async () => {
        try {
          const todos = await getTodos(userId, todayDate);
          setProjectTodos(todos);
        } catch (err) {
          console.log(err);
          setError('할 일을 가져오는 중 오류가 발생했습니다.');
        }
      };

      fetchTodos();
      fetchEvents(userId, year, month);
    }
  }, [userId, todayDate, year, month, fetchEvents]);

  return (
    <div className="privateContainer">
      <div className="header">
        <p>OOO님의 일정 및 할 일</p>
        <p>오늘은 {todayDate} 입니다.</p>
      </div>
      <div className="todoContainerWrapper">
      {error && <div className="error">{error}</div>}
        <div className="todoContainer">
          {projectTodos.map((project, index) => (
            <div key={index} className="projectContainer">
              <h2>{project.projectName}</h2>
              <div className="todoContainer">
                {project.todos.map((todo) => (
                  <div key={todo.topTodoId} className={`todoItem ${todo.status ? 'completed' : ''}`}>
                    <p>{todo.title}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="calendar">
        <FullCalendarComponent events={events} eventClick={handleEventClick} />
      </div>
    </div>
  );
};

export default PrivatePage;