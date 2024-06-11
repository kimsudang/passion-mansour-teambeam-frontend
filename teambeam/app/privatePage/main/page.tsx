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

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

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

  const handleTodoClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTodo(null);
  };

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

      fetchTodos(userId, todayDate);
      fetchEvents(userId, year, month);
    }
  }, [userId, todayDate, year, month, fetchEvents]);

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

  return (
    <div className="privateContainer">
      <div className="header">
        <p>{getUserName()}님</p>        
        <p>오늘은 {todayDate} 입니다.</p>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="todoContainerWrapper">
        <div className="myTodoContainer">
          {projectTodos
          .filter(project => project.todos.length > 0)
          .map((project, projectIndex) => (
            <div key={projectIndex} className="projectContainer">
              <h2 className="todoTitle">{project.projectName}</h2>
              <div className="todoList">
                {project.todos.map((todo, todoIndex) => (
                  <button 
                    key={todo.topTodoId} 
                    className={`todoItem ${todo.status ? 'completed' : ''}`}
                    onClick={() => handleTodoClick(todo)}
                  >
                     <div className="checkTodoTitle">
                      <input 
                        type="checkbox" 
                        checked={todo.status} 
                        onChange={() => handleTodoStatusChange(projectIndex, todoIndex)} 
                        />
                      <p className="bottomTodoTitle">{todo.title}</p>
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
          ))}
        </div>
      </div>
      <div className="calendar">
        <FullCalendarComponent events={events} eventClick={handleEventClick} />
      </div>
      <TodoMemoModal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedTodo && (
          <>
            <h2>TODO 이름</h2>
            <p>기간: {selectedTodo.startDate} ~ {selectedTodo.endDate}</p>
            <p>내용: {selectedTodo.title}</p>
            <p>태그: </p>
            <div className="tags">
              <span className="tag">고정</span>
              <span className="tag">중요</span>
              <span className="tag">회의</span>
            </div>
            <p>메모</p>
            <textarea className="memoArea" placeholder="메모 작성" />
            <button className="saveButton">저장</button>
          </>
        )}
      </TodoMemoModal>
    </div>
  );
};

export default PrivatePage;