"use client";

import React, { useState, useEffect } from "react";
import UpperTodoList from "./components/UpperTodoList";
import EventModal from "./components/EventModal";
import { TodoList, Participant, TodoItem } from "./types";
import "./styles/main.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchTodos,
  addUpperTodo,
  addMiddleTodo,
  addLowerTodo,
  deleteUpperTodo,
} from "@/app/_api/todo";
import api from "@/app/_api/api";

const TeamTodo: React.FC = () => {
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
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
        console.log("Loaded Todos:", todos);
        setTodoLists(todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    const loadParticipants = async () => {
      try {
        const response = await api.get(`/team/1/joinMember`, {
          headers: {
            accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
          },
        });
        const participantsData = response.data.joinMemberList.map(
          (member: any) => ({
            id: member.memberId,
            name: member.memberName,
          })
        );
        console.log("Loaded Participants:", participantsData);
        setParticipants(participantsData);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    loadTodos();
    loadParticipants();
  }, []);

  const handleAddButtonClick = (
    type: string,
    upperTodoId: string | null = null,
    middleTodoId: string | null = null
  ) => {
    console.log(
      "handleAddButtonClick called with:",
      type,
      upperTodoId,
      middleTodoId
    );
    setModalTitle(type);
    if (type === "하위 투두 추가 모달") {
      setCurrentUpperTodoId(upperTodoId);
      setCurrentMiddleTodoId(middleTodoId);
    } else if (type === "중위 투두 추가 모달") {
      setCurrentUpperTodoId(upperTodoId);
      setCurrentMiddleTodoId(null);
    } else {
      setCurrentUpperTodoId(null);
      setCurrentMiddleTodoId(null);
    }
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
      assignees?: number[];
      memo?: string;
    }
  ) => {
    try {
      console.log("handleEventSave called with:", type, event);
      console.log("Current Upper Todo ID:", currentUpperTodoId);
      console.log("Current Middle Todo ID:", currentMiddleTodoId);
      if (type === "상위 투두 추가 모달") {
        const upperTodo = {
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
        };

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
      } else if (type === "중위 투두 추가 모달" && currentUpperTodoId) {
        const middleTodo = {
          topTodoId: currentUpperTodoId,
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
          status: true,
        };

        const response = await addMiddleTodo("1", middleTodo);
        console.log("Middle Todo added:", response);
        setTodoLists((prevTodoLists) =>
          prevTodoLists.map((todoList) =>
            todoList.topTodoId === currentUpperTodoId
              ? {
                  ...todoList,
                  middleTodos: [
                    ...todoList.middleTodos,
                    {
                      middleTodoId: response.middleTodoId,
                      ...middleTodo,
                      bottomTodos: [],
                    },
                  ],
                }
              : todoList
          )
        );
      } else if (
        type === "하위 투두 추가 모달" &&
        currentUpperTodoId &&
        currentMiddleTodoId
      ) {
        if (!event.assignees || event.assignees.length === 0) {
          throw new Error("Assignee must be selected");
        }

        const lowerTodo = {
          bottomTodoId: "",
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
          status: true,
          assignees: event.assignees.map(String),
        };

        console.log("Lower Todo Before Sending:", lowerTodo);

        const response = await addLowerTodo("1", {
          ...lowerTodo,
          middleTodoId: currentMiddleTodoId,
          member: event.assignees[0].toString(), // member is required by the API
        });
        console.log("Lower Todo added:", response);

        setTodoLists((prevTodoLists) =>
          prevTodoLists.map((todoList) =>
            todoList.topTodoId === currentUpperTodoId
              ? {
                  ...todoList,
                  middleTodos: todoList.middleTodos.map((middleTodo) =>
                    middleTodo.middleTodoId === currentMiddleTodoId
                      ? {
                          ...middleTodo,
                          bottomTodos: [
                            ...(middleTodo.bottomTodos ?? []),
                            {
                              ...lowerTodo,
                              bottomTodoId: response.bottomTodoId,
                              middleTodoId: currentMiddleTodoId, // Ensure to set the correct parent ID
                              topTodoId: currentUpperTodoId, // Ensure to set the correct parent ID
                            },
                          ],
                        }
                      : middleTodo
                  ),
                }
              : todoList
          )
        );
      }
    } catch (error: any) {
      console.error("Error saving event:", error.response?.data || error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      const response = await deleteUpperTodo("1", id);
      if (response.status === "200") {
        setTodoLists(todoLists.filter((list) => list.topTodoId !== id));
      } else {
        console.error("Failed to delete upper todo");
      }
    } catch (error: any) {
      console.error("Error deleting upper todo:", error);
    }
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
            task.bottomTodos?.map((subtask: TodoItem) => {
              if (subtask.bottomTodoId === id) {
                return { ...subtask, status: newStatus };
              }
              return subtask;
            }) ?? [];
          return task;
        });
        return list;
      });
    }

    // 하위 상태 변경 시 상위 상태 변경 로직 추가
    if (type === "bottom") {
      updatedTodoLists.forEach((list) => {
        list.middleTodos.forEach((task) => {
          const allSubtasksChecked = (task.bottomTodos ?? []).every(
            (subtask: TodoItem) => subtask.status === false
          );
          if (allSubtasksChecked) {
            task.status = false;
          } else {
            task.status = true;
          }
        });

        const allTasksChecked = list.middleTodos.every(
          (task: TodoItem) => task.status === false
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
          (task: TodoItem) => task.status === false
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
          onAddGoal={handleAddButtonClick}
          onDeleteGoal={handleDeleteGoal}
          listCount={todoLists.length}
          onStatusChange={handleStatusChange}
          participants={participants}
        />
      ))}

      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleEventSave}
        title={modalTitle}
        showAssignee={showAssignee}
        participants={participants}
      />
    </div>
  );
};

export default TeamTodo;
