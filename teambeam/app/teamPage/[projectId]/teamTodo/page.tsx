"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import UpperTodoList from "./components/UpperTodoList";
import EventModal from "./components/EventModal";
import { TodoList, Participant, TodoItem } from "./types";
import "./styles/TeamTodo.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchTodos,
  addUpperTodo,
  addMiddleTodo,
  addLowerTodo,
  deleteUpperTodo,
  fetchTags,
} from "@/app/_api/todo";
import { fetchParticipants } from "@/app/_api/calendar";

const TeamTodo: React.FC = () => {
  const params = useParams();
  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : params.projectId;

  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [showAssignee, setShowAssignee] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [currentUpperTodo, setCurrentUpperTodo] = useState<TodoList | null>(
    null
  );
  const [currentMiddleTodo, setCurrentMiddleTodo] = useState<TodoItem | null>(
    null
  );
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [tags, setTags] = useState<any[]>([]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const token = localStorage.getItem("Authorization") || "";
        const refreshToken = localStorage.getItem("RefreshToken") || "";
        setToken(token);
        setRefreshToken(refreshToken);

        if (projectId) {
          const todos = await fetchTodos(projectId, token, refreshToken);
          console.log("Loaded Todos:", todos);
          setTodoLists(todos);
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    const loadParticipants = async () => {
      try {
        if (projectId) {
          const participants = await fetchParticipants(
            projectId,
            token,
            refreshToken
          );
          console.log("Loaded Participants:", participants);
          setParticipants(participants);
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    const loadTags = async () => {
      try {
        if (projectId) {
          const tags = await fetchTags(projectId, token, refreshToken);
          console.log("Loaded Tags:", tags);
          setTags(tags);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    loadTodos();
    loadParticipants();
    loadTags();
  }, [token, refreshToken, projectId]);

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
      const upperTodo = todoLists.find(
        (todo) => todo.topTodoId === upperTodoId
      );
      const middleTodo = upperTodo?.middleTodos.find(
        (todo) => todo.middleTodoId === middleTodoId
      );
      setCurrentUpperTodo(upperTodo || null);
      setCurrentMiddleTodo(middleTodo || null);
      setShowAssignee(true);
      setShowTags(true);
    } else if (type === "중위 투두 추가 모달") {
      const upperTodo = todoLists.find(
        (todo) => todo.topTodoId === upperTodoId
      );
      setCurrentUpperTodo(upperTodo || null);
      setCurrentMiddleTodo(null);
      setShowAssignee(false);
      setShowTags(false);
    } else {
      setCurrentUpperTodo(null);
      setCurrentMiddleTodo(null);
      setShowAssignee(false);
      setShowTags(false);
    }
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
      tags?: number[];
    }
  ) => {
    try {
      console.log("handleEventSave called with:", type, event);
      console.log("Current Upper Todo ID:", currentUpperTodo);
      console.log("Current Middle Todo ID:", currentMiddleTodo);
      if (type === "상위 투두 추가 모달" && projectId) {
        const upperTodo = {
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
        };

        const response = await addUpperTodo(projectId, upperTodo);
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
      } else if (
        type === "중위 투두 추가 모달" &&
        currentUpperTodo &&
        projectId
      ) {
        const middleTodo = {
          topTodoId: currentUpperTodo.topTodoId,
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
        };

        const response = await addMiddleTodo(projectId, middleTodo);
        console.log("Middle Todo added:", response);
        setTodoLists((prevTodoLists) =>
          prevTodoLists.map((todoList) =>
            todoList.topTodoId === currentUpperTodo.topTodoId
              ? {
                  ...todoList,
                  middleTodos: [
                    ...todoList.middleTodos,
                    {
                      middleTodoId: response.middleTodoId,
                      ...middleTodo,
                      status: true,
                      bottomTodos: [],
                    },
                  ],
                }
              : todoList
          )
        );
      } else if (
        type === "하위 투두 추가 모달" &&
        currentUpperTodo &&
        currentMiddleTodo &&
        projectId
      ) {
        if (!event.assignees || event.assignees.length === 0) {
          throw new Error("Assignee must be selected");
        }

        if (!currentMiddleTodo.middleTodoId) {
          throw new Error("Middle Todo ID is required");
        }

        const lowerTodo = {
          middleTodoId: currentMiddleTodo.middleTodoId,
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
          memo: event.memo,
          member: event.assignees[0].toString(),
          tags: event.tags || [],
        };

        console.log("Lower Todo Before Sending:", lowerTodo);

        const response = await addLowerTodo(
          projectId,
          lowerTodo,
          token,
          refreshToken
        );
        console.log("Lower Todo added:", response);

        const tagNames = (response.taglist || []).map((tagId) => {
          const tag = tags.find((t) => t.id === tagId);
          return tag ? tag.name : tagId;
        });

        setTodoLists((prevTodoLists) =>
          prevTodoLists.map((todoList) =>
            todoList.topTodoId === currentUpperTodo.topTodoId
              ? {
                  ...todoList,
                  middleTodos: todoList.middleTodos.map((middleTodo) =>
                    middleTodo.middleTodoId === currentMiddleTodo.middleTodoId
                      ? {
                          ...middleTodo,
                          bottomTodos: [
                            ...(middleTodo.bottomTodos ?? []),
                            {
                              bottomTodoId: response.bottomTodoId,
                              title: response.title,
                              startDate: response.startDate,
                              endDate: response.endDate,
                              status: response.status,
                              memo: response.memo,
                              assignees: response.assignees
                                ? [response.assignees.memberName]
                                : [],
                              tags: tagNames,
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
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      if (projectId) {
        const response = await deleteUpperTodo(projectId, id);
        if (response.status === "200") {
          setTodoLists(todoLists.filter((list) => list.topTodoId !== id));
          toast.success("목표가 성공적으로 삭제되었습니다.", {
            autoClose: 10000,
          });
          setTimeout(() => {
            window.location.reload();
          }, 10000);
        } else {
          console.error("Failed to delete upper todo");
          toast.error("목표 삭제 중 오류가 발생했습니다.", {
            autoClose: 10000,
          });
        }
      }
    } catch (error: any) {
      console.error("Error deleting upper todo:", error);
      toast.error("목표 삭제 중 오류가 발생했습니다.", {
        autoClose: 10000,
      });
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
        showTags={showTags}
        participants={participants}
        upperStartDate={currentUpperTodo?.startDate || ""}
        upperEndDate={currentUpperTodo?.endDate || ""}
        middleStartDate={currentMiddleTodo?.startDate || ""}
        middleEndDate={currentMiddleTodo?.endDate || ""}
        projectId={projectId}
        token={token}
        refreshToken={refreshToken}
      />
    </div>
  );
};

export default TeamTodo;
