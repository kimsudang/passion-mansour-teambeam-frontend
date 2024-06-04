'use client';

import React, { useState, useEffect } from "react";
import "./layout.scss";

// 예제 데이터
const initialProjects = [
  {
    id: 1,
    name: "팀캘린더",
    todos: [
      { id: 1, date: "2024-05-10", tags: ["회의"], completed: false },
      { id: 2, date: "2024-05-11", tags: ["개발", "디자인"], completed: false  },
      { id: 3, date: "2024-05-10", tags: ["회의"], completed: false  },
      { id: 4, date: "2024-05-11", tags: ["개발", "디자인"], completed: false  },
      { id: 5, date: "2024-05-10", tags: ["회의"], completed: false  },
      { id: 6, date: "2024-05-11", tags: ["개발", "디자인"] },
      { id: 7, date: "2024-05-10", tags: ["회의"] },
      { id: 8, date: "2024-05-11", tags: ["개발", "디자인"] },
      { id: 9, date: "2024-05-10", tags: ["회의"] },
      { id: 10, date: "2024-05-11", tags: ["개발", "디자인"] },
    ],
  },
  {
    id: 2,
    name: "프로젝트 1",
    todos: [
      { id: 1, date: "2024-05-12", tags: ["기획"] },
      { id: 2, date: "2024-05-13", tags: ["개발", "테스트"] },
    ],
  },
  {
    id: 3,
    name: "프로젝트 2",
    todos: [
      { id: 1, date: "2024-05-14", tags: ["회의"] },
      { id: 2, date: "2024-05-15", tags: ["개발", "리뷰"] },
    ],
  },
  {
    id: 4,
    name: "프로젝트 2",
    todos: [
      { id: 1, date: "2024-05-14", tags: ["회의"] },
      { id: 2, date: "2024-05-15", tags: ["개발", "리뷰"] },
    ],
  },
  {
    id: 5,
    name: "프로젝트 2",
    todos: [
      { id: 1, date: "2024-05-14", tags: ["회의"] },
      { id: 2, date: "2024-05-15", tags: ["개발", "리뷰"] },
    ],
  },
];

const PrivatePage: React.FC = () => {
  const [todayDate, setTodayDate] = useState("");
  const [projects, setProjects] = useState(initialProjects);
 
  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    setTodayDate(date);
  }, []);

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
                >
                  <div className="todoTitle">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleCheckboxChange(project.id, todo.id)}
                    />
                    <span>{todo.date}</span>
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
        <div className="calendar">calender</div>
    </div>
  );
};

export default PrivatePage;
