"use client";

import React, { useEffect, useState, useCallback } from "react";
import "./layout.scss";
import { getTodos, Todo, fetchCalendarEvents } from "@/app/_api/todayTodo";
import dynamic from "next/dynamic";
import TodoMemoModal from "../_components/TodoMemoModal";

interface ProjectTodos {
  projectName: string;
  todos: Todo[];
}

interface Assignee {
  memberId: number;
  memberName: string;
}

// 캘린더
const FullCalendarComponent = dynamic(
  () => import("../../teamPage/[projectId]/teamCalendar/components/FullCalendarComponent"),
  {
    ssr: false,
  }
);

// 캘린더 이벤트를 클릭할 때 호출되는 함수
const handleEventClick = () => {
  console.log("Event clicked, but no action taken.");
};

const PrivatePage: React.FC = () => {
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [userId, setUserId] = useState<string>();
  const [projectTodos, setProjectTodos] = useState<ProjectTodos[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 캘린더
  const [events, setEvents] = useState<any[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  
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

  const handleTodoStatusChange = async (projectIndex: number, todoIndex: number) => {
    const updatedTodos = [...projectTodos];
    const todo = updatedTodos[projectIndex].todos[todoIndex];
    todo.status = !todo.status;
    setProjectTodos(updatedTodos);
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
      const fetchTodos = async (userId: string, date: string) => {
        try {
          const todos = await getTodos(userId, date);
          console.log("Fetched todos:", todos);
          setProjectTodos(todos);
        } catch (err) {
          console.log(err);
          setError('할 일을 가져오는 중 오류가 발생했습니다.');
        }
      };

      fetchTodos(userId, date);
      fetchEvents(userId, year, month);
    }
  }, [userId, date, year, month, fetchEvents]);

  const getUserName = () => {
    if (!userId) return "사용자";
    for (const project of projectTodos) {
      for (const todo of project.todos) {
        const assignees = Array.isArray(todo.assignees) ? todo.assignees : [todo.assignees];
        const assignee = assignees.find(assignee => assignee.memberId.toString() === userId);
        if (assignee) {
          return assignee.memberName;
        }
      }
    }
    return "사용자";
  };

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

  return (
    <div className="privateContainer">
      <div className="header">
        <p>{getUserName()}님</p>        
        <p>{date}</p>
        <div className="dateNavigation">
          <button onClick={handlePreviousDay}>전날</button>
          <button onClick={() => setDate(new Date().toISOString().split("T")[0])}>오늘</button>
          <button onClick={handleNextDay}>다음날</button>
        </div>
      </div>
      <div className="todoContainerWrapper">
        <div className="myTodoContainer">
        {projectTodos.length === 0 || projectTodos.every(project => project.todos.length === 0) ? (
            <p className="noTodos"> {date} 할 일이 존재하지 않습니다.</p>
          ) : (
          projectTodos
          .filter(project => project.todos.length > 0)
          .map((project, projectIndex) => (
            <div key={projectIndex} className="projectContainer">
              <h2 className="todoTitle">{project.projectName}</h2>
              <div className="todoList">
                {project.todos.map((todo, todoIndex) => (
                  <button 
                    key={todo.topTodoId} 
                    className={`todoItem ${todo.status ? 'completed' : ''}`}
                  >
                     <div className="checkTodoTitle">
                      <input 
                        type="checkbox" 
                        checked={todo.status} 
                        onChange={() => handleTodoStatusChange(projectIndex, todoIndex)} 
                        />
                      <p className="bottomTodoTitle" onClick={() => handleTodoClick(todo.bottomTodoId)}>{todo.title}</p>
                    </div>
                    <p className="bottomTodoDate">{todo.startDate} ~ {todo.endDate}</p>
                    <div className="assignees">
                      {Array.isArray(todo.assignees) ? (
                        todo.assignees.map(assignee => <p key={assignee.memberId}>{assignee.memberName}</p>)
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
      <div className="calendar">
        <FullCalendarComponent events={events} eventClick={handleEventClick} />
      </div>
      {selectedTodoId && (
        <TodoMemoModal isOpen={isModalOpen} onClose={handleCloseModal} bottomTodoId={selectedTodoId} />
      )}
    </div>
  );
};

export default PrivatePage;