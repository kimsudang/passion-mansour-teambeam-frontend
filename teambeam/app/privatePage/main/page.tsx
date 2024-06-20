"use client";

import React, { useEffect, useState, useCallback } from "react";
import "./layout.scss";
import { getTodos, Project, Todo, Assignee, fetchCalendarEvents, updateTodoStatus } from "@/app/_api/todayTodo";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import TodoMemoModal from "../_components/TodoMemoModal";

// 캘린더
const FullCalendarComponent = dynamic(
  () =>
    import(
      "../../teamPage/[projectId]/teamCalendar/components/FullCalendarComponent"
    ),
  {
    ssr: false,
  }
);

const PrivatePage: React.FC = () => {
  const router = useRouter();
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [userId, setUserId] = useState<string>();
  const [projectTodos, setProjectTodos] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 캘린더
  const [events, setEvents] = useState<any[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

   // 투두 데이터를 가져오는 함수
   const fetchTodos = useCallback(
    async (userId: string, date: string) => {
      try {
        const todos = await getTodos(userId, date);
        console.log("Fetched todos:", todos);

        setProjectTodos(todos);
      } catch (err) {
        console.log(err);
        setError('할 일을 가져오는 중 오류가 발생했습니다.');
      }
    },
    []
  );

  const fetchEvents = useCallback(
    async (userId: string, year: number, month: number) => {
      try {
        const events = await fetchCalendarEvents(userId, year, month);
        setEvents(events);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError('일정을 가져오는 중 오류가 발생했습니다.');
      }
    },
    []
  );

  // 투두 상태 변경 핸들러
  const handleTodoStatusChange = async (projectIndex: number, todoIndex: number) => {
    const updatedTodos = [...projectTodos];
    const todo = updatedTodos[projectIndex].todos[todoIndex];
    const newStatus = !todo.status;

    try {
      await updateTodoStatus(todo, todo.bottomTodoId, newStatus);
      todo.status = newStatus;
      setProjectTodos(updatedTodos);
      console.log(`Todo status changed: ${todo.title}, new status: ${todo.status}`);
      await fetchTodos(userId!, date);
    } catch (error) {
      console.error("Error updating todo status:", error);
      setError('투두 상태를 업데이트하는 중 오류가 발생했습니다.');
    }
  };

  const handleTodoClick = (todoId: number) => {
    setSelectedTodoId(todoId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTodoId(null);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("MemberId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTodos(userId, date);
      fetchEvents(userId, year, month);
    }
  }, [userId, date, year, month, fetchTodos, fetchEvents]);

  const handlePreviousDay = () => {
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    setDate(previousDay.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    setDate(nextDay.toISOString().split("T")[0]);
  };

  // 캘린더 이벤트를 클릭할 때 호출되는 함수
  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id || clickInfo.event.extendedProps.id;
    const projectId = clickInfo.event.extendedProps.projectId;
    if (clickInfo.event.extendedProps.schedule) {
      router.push(`/teamPage/${projectId}/teamCalendar`);
    }
    if (clickInfo.event.extendedProps.todo) {
      // 투두 이벤트 클릭 시 투두리스트 페이지로 이동
      router.push(`/teamPage/${projectId}/teamTodo?todoId=${eventId}`);
    } else if (eventId || projectId) {
      console.error("Event ID is undefined");
    }
  };

  return (
    <div className='privateContainer'>
      <div className='header'>
        <p>{date}</p>
        <div className='dateNavigation'>
          <button className="before" onClick={handlePreviousDay}>전날</button>
          <button
            className="today" 
            onClick={() => setDate(new Date().toISOString().split("T")[0])}
          >
            오늘
          </button>
          <button className="after" onClick={handleNextDay}>다음날</button>
        </div>
      </div>
      <div className='todoContainerWrapper'>
        <div className='myTodoContainer'>
          {projectTodos.length === 0 ||
          projectTodos.every((project) => project.todos.length === 0) ? (
            <p className='noTodos'> {date} 할 일이 존재하지 않습니다.</p>
          ) : (
            projectTodos
              .filter((project) => project.todos.length > 0)
              .map((project, projectIndex) => (
                <div key={projectIndex} className='projectContainer'>
                  <h2 className='todoTitle'>{project.projectName}</h2>
                  <div className='todoList'>
                    {project.todos.map((todo, todoIndex) => (
                      <button
                        key={todo.topTodoId}
                        className={`todoItem ${!todo.status ? "completed" : ""}`}
                      >
                        <div className='checkTodoTitle'>
                          <input
                            type='checkbox'
                            checked={!todo.status}
                            onChange={() =>
                              handleTodoStatusChange(projectIndex, todoIndex)
                            }
                          />
                          <p
                            className='bottomTodoTitle'
                            onClick={() => handleTodoClick(todo.bottomTodoId)}
                          >
                            {todo.title}
                          </p>
                        </div>
                        <p className='bottomTodoDate'>
                          {todo.startDate} ~ {todo.endDate}
                        </p>
                        <div className='assignees'>
                          {Array.isArray(todo.assignees) ? (
                            todo.assignees.map((assignee) => (
                              <p key={assignee.memberId}>
                                {assignee.memberName}
                              </p>
                            ))
                          ) : (
                            <p>{todo.assignees.memberName}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
      <div className='calendar'>
        <FullCalendarComponent events={events} eventClick={handleEventClick} />
      </div>
      {selectedTodoId && (
        <TodoMemoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          bottomTodoId={selectedTodoId}
        />
      )}
    </div>
  );
};

export default PrivatePage;
