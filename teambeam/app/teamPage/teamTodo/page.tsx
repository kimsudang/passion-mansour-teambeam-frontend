"use client";

import React, { useState, useEffect } from "react";
import UpperTodoList from "./components/UpperTodoList";
import EventModal from "./components/EventModal";
import { TodoList, Participant, TodoItem } from "./types";
import "./styles/main.scss";
import { fetchTodos } from "@/app/_api/todo";

const TeamTodo: React.FC = () => {
  const [todoLists, setTodoLists] = useState<TodoList[]>([
    {
      id: "1",
      title: "프로젝트 계획 수립",
      startDate: "2024-05-01",
      endDate: "2024-05-31",
      tasks: [
        {
          id: "1-1",
          title: "시장 조사",
          startDate: "2024-05-01",
          endDate: "2024-05-10",
          subtasks: [
            {
              id: "1-1-1",
              title: "고객 인터뷰",
              startDate: "2024-05-01",
              endDate: "2024-05-02",
              assignees: ["또치"],
            },
            {
              id: "1-1-2",
              title: "설문 조사 분석",
              startDate: "2024-05-03",
              endDate: "2024-05-05",
              assignees: ["고길동"],
            },
          ],
        },
        {
          id: "1-2",
          title: "경쟁사 분석",
          startDate: "2024-05-11",
          endDate: "2024-05-20",
          subtasks: [
            {
              id: "1-2-1",
              title: "경쟁사 제품 리뷰",
              startDate: "2024-05-11",
              endDate: "2024-05-13",
              assignees: ["둘리"],
            },
          ],
        },
      ],
    },
  ]);

  const participants: Participant[] = [
    { id: "1", name: "또치" },
    { id: "2", name: "고길동" },
    { id: "3", name: "둘리" },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [showAssignee, setShowAssignee] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [showMemo, setShowMemo] = useState(false);
  const projectId = "1"; // 임시로 프로젝트 ID를 1로 설정

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todos = await fetchTodos(projectId);
        setTodoLists(todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    loadTodos();
  }, [projectId]);

  const handleAddButtonClick = (type: string) => {
    setModalTitle(type);
    setShowAssignee(type === "하위 투두 추가 모달");
    setShowLink(type === "하위 투두 추가 모달");
    setShowMemo(type === "하위 투두 추가 모달");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEventSave = (
    type: string,
    event: {
      title: string;
      startDate: string;
      endDate: string;
      memo?: string;
      assignees?: string[];
      link?: string;
    }
  ) => {
    if (type === "상위 투두 추가 모달") {
      const newUpperTodo: TodoList = {
        id: String(todoLists.length + 1),
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        tasks: [],
      };
      setTodoLists([...todoLists, newUpperTodo]);
    } else if (type === "중위 투두 추가 모달") {
      const updatedTodoLists = todoLists.map((list) => {
        if (list.id === "1") {
          const newMiddleTodo: TodoItem = {
            id: `${list.tasks.length + 1}`,
            title: event.title,
            startDate: event.startDate,
            endDate: event.endDate,
            subtasks: [],
          };
          return {
            ...list,
            tasks: [...list.tasks, newMiddleTodo],
          };
        }
        return list;
      });
      setTodoLists(updatedTodoLists);
    } else if (type === "하위 투두 추가 모달") {
      const updatedTodoLists = todoLists.map((list) => {
        if (list.id === "1") {
          const updatedTasks = list.tasks.map((task) => {
            if (task.id === "1-1") {
              const newLowerTodo: TodoItem = {
                id: `${(task.subtasks ?? []).length + 1}`,
                title: event.title,
                startDate: event.startDate,
                endDate: event.endDate,
                assignees: event.assignees,
              };
              return {
                ...task,
                subtasks: [...(task.subtasks ?? []), newLowerTodo],
              };
            }
            return task;
          });
          return {
            ...list,
            tasks: updatedTasks,
          };
        }
        return list;
      });
      setTodoLists(updatedTodoLists);
    }
  };

  return (
    <div className="todoContainer">
      <h2>투두리스트</h2>
      {todoLists.map((list) => (
        <UpperTodoList
          key={list.id}
          list={list}
          onAddGoal={handleAddButtonClick}
        />
      ))}

      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={(event) => handleEventSave(modalTitle, event)}
        title={modalTitle}
        showAssignee={showAssignee}
        showLink={showLink}
        showMemo={showMemo}
        participants={participants}
      />
    </div>
  );
};

export default TeamTodo;
