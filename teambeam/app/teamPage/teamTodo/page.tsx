"use client";

import React, { useState, useEffect } from "react";
import UpperTodoList from "./components/UpperTodoList";
import EventModal from "./components/EventModal";
import { TodoList, Participant } from "./types";
import "./styles/main.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [currentUpperTodoId, setCurrentUpperTodoId] = useState<string | null>(null);
  const [currentMiddleTodoId, setCurrentMiddleTodoId] = useState<string | null>(null);

  // useEffect(() => {
  //   const loadTodos = async () => {
  //     try {
  //       const todos = await fetchTodos("1");
  //       setTodoLists(todos);
  //     } catch (error) {
  //       console.error("Error fetching todos:", error);
  //     }
  //   };

  //   loadTodos();
  // }, []);

  const handleAddButtonClick = (type: string, upperTodoId: string | null = null, middleTodoId: string | null = null) => {
    console.log("handleAddButtonClick", { type, upperTodoId, middleTodoId });
    setModalTitle(type);
    setCurrentUpperTodoId(upperTodoId);
    setCurrentMiddleTodoId(middleTodoId);
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
    console.log("handleEventSave", { type, event, currentUpperTodoId, currentMiddleTodoId });
    if (type === "상위 투두 추가 모달") {
      const newUpperTodo: TodoList = {
        id: String(todoLists.length + 1),
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        tasks: [],
      };
      setTodoLists([...todoLists, newUpperTodo]);
    } else if (type === "중위 투두 추가 모달" && currentUpperTodoId) {
      const updatedTodoLists = todoLists.map((list) => {
        if (list.id === currentUpperTodoId) {
          const newMiddleTodo = {
            id: `${list.id}-${list.tasks.length + 1}`,
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
    } else if (type === "하위 투두 추가 모달" && currentUpperTodoId && currentMiddleTodoId) {
      const updatedTodoLists = todoLists.map((list) => {
        if (list.id === currentUpperTodoId) {
          const updatedTasks = list.tasks.map((task) => {
            if (task.id === currentMiddleTodoId) {
              const newLowerTodo = {
                id: `${task.id}-${(task.subtasks ?? []).length + 1}`,
                title: event.title,
                startDate: event.startDate,
                endDate: event.endDate,
                assignees: event.assignees,
                memo: event.memo,
                link: event.link
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
    setIsModalOpen(false);
  };

  const handleDeleteGoal = (id: string) => {
    setTodoLists(todoLists.filter((list) => list.id !== id));
  };

  return (
    <div className="todoContainer">
      <ToastContainer />
      <h2>투두리스트</h2>
      {todoLists.map((list) => (
        <UpperTodoList
          key={list.id}
          list={list}
          onAddGoal={(type: string, middleTodoId?: string) => handleAddButtonClick(type, list.id, middleTodoId)}
          onDeleteGoal={handleDeleteGoal}
          listCount={todoLists.length}
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
