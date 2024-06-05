'use client';

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import "./layout.scss";
import TodoMemoModal from "../_components/TodoMemoModal";
import { Project, Todo, TodoDetails } from "./types"; 
import { fetchCalendarEvents } from "@/app/_api/calendar";

// 예제 데이터
// const initialProjects = [
//   {
//     id: 1,
//     name: "팀캘린더",
//     todos: [
//       { id: 1, date: "2024-05-10", tags: ["회의"], completed: false },
//       { id: 2, date: "2024-05-11", tags: ["개발", "디자인"], completed: false  },
//       { id: 3, date: "2024-05-10", tags: ["회의"], completed: false  },
//       { id: 4, date: "2024-05-11", tags: ["개발", "디자인"], completed: false  },
//       { id: 5, date: "2024-05-10", tags: ["회의"], completed: false  },
//       { id: 6, date: "2024-05-11", tags: ["개발", "디자인"] },
//       { id: 7, date: "2024-05-10", tags: ["회의"] },
//       { id: 8, date: "2024-05-11", tags: ["개발", "디자인"] },
//       { id: 9, date: "2024-05-10", tags: ["회의"] },
//       { id: 10, date: "2024-05-11", tags: ["개발", "디자인"] },
//     ],
//   },
//   {
//     id: 2,
//     name: "프로젝트 1",
//     todos: [
//       { id: 1, date: "2024-05-12", tags: ["기획"] },
//       { id: 2, date: "2024-05-13", tags: ["개발", "테스트"] },
//     ],
//   },
//   {
//     id: 3,
//     name: "프로젝트 2",
//     todos: [
//       { id: 1, date: "2024-05-14", tags: ["회의"] },
//       { id: 2, date: "2024-05-15", tags: ["개발", "리뷰"] },
//     ],
//   },
//   {
//     id: 4,
//     name: "프로젝트 2",
//     todos: [
//       { id: 1, date: "2024-05-14", tags: ["회의"] },
//       { id: 2, date: "2024-05-15", tags: ["개발", "리뷰"] },
//     ],
//   },
//   {
//     id: 5,
//     name: "프로젝트 2",
//     todos: [
//       { id: 1, date: "2024-05-14", tags: ["회의"] },
//       { id: 2, date: "2024-05-15", tags: ["개발", "리뷰"] },
//     ],
//   },
// ];

// 모달 예제 테스트
const mockTodoDetails = {
  topTodoId: 4,
  middleTodoId: 1,
  bottomTodoId: 1,
  title: "프로젝트2 바텀테스트",
  status: false,
  startDate: "2024-05-19",
  endDate: "2024-05-22",
  memo: null,
  assignees: {
    memberId: 1,
    memberName: "홍길동"
  }
};

const initialProjects: Project[] = [];


const FullCalendarComponent = dynamic(
  () => import("../../teamPage/[projectId]/teamCalendar/components/FullCalendarComponent"),
  {
    ssr: false,
  }
);


const PrivatePage: React.FC = () => {
  const [todayDate, setTodayDate] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [todoDetails, setTodoDetails] = useState<TodoDetails | null>(null); 

  // 캘린더 상태
  const [events, setEvents] = useState<any[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const token = localStorage.getItem("Authorization") || "";
  const refreshToken = localStorage.getItem("RefreshToken") || "";

  const fetchEvents = useCallback(
    async (year: number, month: number) => {
      try {
        const events = await fetchCalendarEvents(
          "projectId", // 프로젝트 ID를 적절히 수정해야 합니다.
          year,
          month,
          token,
          refreshToken
        );
        setEvents(events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    },
    [token, refreshToken]
  );
 
  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    setTodayDate(date);
    fetchEvents(year, month);
  }, [year, month, fetchEvents]);

  const handleCheckboxChange = (projectId: number, todoId: number) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              todos: project.todos.map((todo) =>
                todo.id === todoId
                  ? { ...todo, completed: !todo.completed }
                  : todo
              ),
            }
          : project
      )
    );
  };

  const handleTodoClick = (todo: Todo) => {
    setTodoDetails(mockTodoDetails); // 로컬 데이터로 세부 정보 설정
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTodo(null);
    setTodoDetails(null);
  };

  const saveMemo = (memo: string) => {
    setTodoDetails((prevDetails) => {
      if (prevDetails) {
        return { ...prevDetails, memo: memo };
      }
      return prevDetails;
    });
  };

  const handleEventClick = (clickInfo: any) => {
    console.log("Event clicked, but no action taken.");
  };

  return (
    <div className="privateContainer">
      <div className="header">
        <p>TODAY</p>
        <p>{todayDate}</p>
      </div>
      <div className="todoContainerWrapper">
        <div className="todoContainer">
          {projects.map((project) => (
            <div className="projectSection" key={project.id}>
              <p>{project.name}</p>
              {project.todos.map((todo) => (
                <div
                  className={`todoItem ${todo.completed ? "completed" : ""}`}
                  key={todo.id}
                  onClick={() => handleTodoClick(todo)}
                >
                  <div className="todoTitle">
                  <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleCheckboxChange(project.id, todo.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span>{mockTodoDetails.title}</span>
                  </div>
                  <div className="tagContainer">
                    {todo.tags.map((tag, index) => (
                      <div className="tag" key={index}>
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && <TodoMemoModal todo={selectedTodo} details={todoDetails} onClose={closeModal} onSaveMemo={saveMemo} />}
      <div className="calendar">
        <FullCalendarComponent events={events} eventClick={handleEventClick} />
      </div>
    </div>
  );
};

export default PrivatePage;