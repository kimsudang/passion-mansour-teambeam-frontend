"use client";

import React, { useState, useEffect } from "react";
import UpperTodoList from "./components/UpperTodoList";
import EventModal from "./components/EventModal";
import { TodoList, Participant } from "./types";
import "./styles/main.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchTodos, addUpperTodo } from "@/app/_api/todo";

const TeamTodo: React.FC = () => {
  const [todoLists, setTodoLists] = useState<TodoList[]>([
    {
      topTodoId: "1",
      title: "프로젝트 계획 수립",
      status: true,
      startDate: "2024-05-01",
      endDate: "2024-05-31",
      middleTodos: [
        {
          topTodoId: "1",
          middleTodoId: "1",
          title: "시장 조사",
          status: true,
          startDate: "2024-05-01",
          endDate: "2024-05-10",
          bottomTodos: [
            {
              topTodoId: "1",
              middleTodoId: "1",
              bottomTodoId: "1",
              title: "고객 인터뷰",
              status: true,
              startDate: "2024-05-01",
              endDate: "2024-05-02",
              assignees: ["또치"],
            },
            {
              topTodoId: "1",
              middleTodoId: "1",
              bottomTodoId: "2",
              title: "설문 조사 분석",
              status: true,
              startDate: "2024-05-03",
              endDate: "2024-05-05",
              assignees: ["고길동"],
            },
          ],
        },
        {
          topTodoId: "1",
          middleTodoId: "2",
          title: "경쟁사 분석",
          status: true,
          startDate: "2024-05-11",
          endDate: "2024-05-20",
          bottomTodos: [
            {
              topTodoId: "1",
              middleTodoId: "2",
              bottomTodoId: "1",
              title: "경쟁사 제품 리뷰",
              status: true,
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
  const [currentUpperTodoId, setCurrentUpperTodoId] = useState<string | null>(
    null
  );
  const [currentMiddleTodoId, setCurrentMiddleTodoId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todos = await fetchTodos("1");
        setTodoLists(todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    loadTodos();
  }, []);

  const handleAddButtonClick = (
    type: string,
    upperTodoId: string | null = null,
    middleTodoId: string | null = null
  ) => {
    console.log("handleAddButtonClick", { type, upperTodoId, middleTodoId });
    setModalTitle(type);
    setCurrentUpperTodoId(upperTodoId);
    setCurrentMiddleTodoId(middleTodoId);
    setShowAssignee(type === "하위 투두 추가 모달");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEventSave = async (
    type: string,
    event: {
      title: string;
      startDate: string;
      endDate: string;
      assignees?: string[];
    }
  ) => {
    console.log("Event Data:", event); // 디버그 로그 추가
    try {
      if (type === "상위 투두 추가 모달") {
        const upperTodo = {
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
        };

        console.log("Upper Todo Before Sending:", upperTodo); // Upper Todo Before Sending 로그

        const response = await addUpperTodo("1", upperTodo);
        console.log("Upper Todo added:", response);

        const newUpperTodo: TodoList = {
          topTodoId: response.topTodoId,
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
          status: true,
          middleTodos: [],
        };
        setTodoLists([...todoLists, newUpperTodo]);
      }
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDeleteGoal = (id: string) => {
    setTodoLists(todoLists.filter((list) => list.topTodoId !== id));
  };

  const handleStatusChange = (type: string, id: string, newStatus: boolean) => {
    let updatedTodoLists = [...todoLists];

    if (type === "top") {
      updatedTodoLists = updatedTodoLists.map((list) => {
        if (list.topTodoId === id) {
          return { ...list, status: newStatus };
        }
        return list;
      });
    } else if (type === "middle") {
      updatedTodoLists = updatedTodoLists.map((list) => {
        list.middleTodos = list.middleTodos.map((task) => {
          if (task.middleTodoId === id) {
            return { ...task, status: newStatus };
          }
          return task;
        });
        return list;
      });
    } else if (type === "bottom") {
      updatedTodoLists = updatedTodoLists.map((list) => {
        list.middleTodos = list.middleTodos.map((task) => {
          task.bottomTodos =
            task.bottomTodos?.map((subtask) => {
              if (subtask.bottomTodoId === id) {
                return { ...subtask, status: newStatus };
              }
              return subtask;
            }) ?? task.bottomTodos;
          return task;
        });
        return list;
      });
    }

    // 하위 상태 변경 시 상위 상태 변경 로직 추가
    if (type === "bottom") {
      updatedTodoLists.forEach((list) => {
        list.middleTodos.forEach((task) => {
          const allSubtasksChecked = task.bottomTodos?.every(
            (subtask) => subtask.status === false
          );
          if (allSubtasksChecked) {
            task.status = false;
          } else {
            task.status = true;
          }
        });

        const allTasksChecked = list.middleTodos.every(
          (task) => task.status === false
        );
        if (allTasksChecked) {
          list.status = false;
        } else {
          list.status = true;
        }
      });
    }

    if (type === "middle") {
      updatedTodoLists.forEach((list) => {
        const allTasksChecked = list.middleTodos.every(
          (task) => task.status === false
        );
        if (allTasksChecked) {
          list.status = false;
        } else {
          list.status = true;
        }
      });
    }

    setTodoLists(updatedTodoLists);
  };

  return (
    <div className="todoContainer">
      <ToastContainer />
      <h2>투두리스트</h2>
      {todoLists.map((list) => (
        <UpperTodoList
          key={list.topTodoId}
          list={list}
          onAddGoal={(type: string, middleTodoId?: string) =>
            handleAddButtonClick(type, list.topTodoId, middleTodoId)
          }
          onDeleteGoal={handleDeleteGoal}
          listCount={todoLists.length}
          onStatusChange={handleStatusChange}
        />
      ))}

      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleEventSave} // 함수 인자 수정
        title={modalTitle}
        showAssignee={showAssignee}
        participants={participants}
      />
    </div>
  );
};

export default TeamTodo;
