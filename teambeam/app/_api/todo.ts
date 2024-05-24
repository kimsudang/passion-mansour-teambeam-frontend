import api from "@/app/_api/api";
import { AxiosError } from "axios";

//투두리스트 조회 함수
export const fetchTodos = async (projectId: string) => {
  try {
    const response = await api.get(`/team/${projectId}/todo`, {
      headers: {
        accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
      },
    });

    const todos = response.data.todos.map((todo: any) => ({
      topTodoId: String(todo.topTodoId),
      title: todo.title,
      startDate: todo.startDate,
      endDate: todo.endDate,
      status: todo.status,
      middleTodos: todo.middleTodos.map((middleTodo: any) => ({
        topTodoId: String(middleTodo.topTodoId),
        middleTodoId: String(middleTodo.middleTodoId),
        title: middleTodo.title,
        startDate: middleTodo.startDate,
        endDate: middleTodo.endDate,
        status: middleTodo.status,
        bottomTodos: middleTodo.bottomTodos.map((bottomTodo: any) => ({
          topTodoId: String(bottomTodo.topTodoId),
          middleTodoId: String(bottomTodo.middleTodoId),
          bottomTodoId: String(bottomTodo.bottomTodoId),
          title: bottomTodo.title,
          startDate: bottomTodo.startDate,
          endDate: bottomTodo.endDate,
          status: bottomTodo.status,
          assignees: bottomTodo.member ? [bottomTodo.member.memberName] : [],
        })),
      })),
    }));

    return todos;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching todos:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching todos:", error);
    }
    throw error;
  }
};

//상위 투두리스트 추가 함수
export const addUpperTodo = async (
  projectId: string,
  upperTodo: {
    title: string;
    startDate: string;
    endDate: string;
  }
) => {
  try {
    console.log("Sending Upper Todo:", upperTodo); // 디버그 로그
    const response = await api.post(`/team/${projectId}/todo/top`, upperTodo, {
      headers: {
        accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
      },
    });
    console.log("API Response:", response.data); // 디버그 로그
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error adding upper todo:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error adding upper todo:", error);
    }
    throw error;
  }
};

// 중위 투두리스트 추가 함수
export const addMiddleTodo = async (
  projectId: string,
  middleTodo: {
    topTodoId: string;
    title: string;
    startDate: string;
    endDate: string;
  }
) => {
  try {
    console.log("Sending Middle Todo:", middleTodo); // 디버그 로그
    const response = await api.post(
      `/team/${projectId}/todo/middle`,
      middleTodo,
      {
        headers: {
          accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
        },
      }
    );
    console.log("API Response:", response.data); // 디버그 로그
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error adding middle todo:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error adding middle todo:", error);
    }
    throw error;
  }
};

// 하위 투두리스트 추가 함수
export const addLowerTodo = async (
  projectId: string,
  lowerTodo: {
    middleTodoId: string;
    title: string;
    startDate: string;
    endDate: string;
    member: string; // 필드 이름 변경
  }
) => {
  try {
    console.log("Sending Lower Todo:", lowerTodo); // 디버그 로그
    const response = await api.post(
      `/team/${projectId}/todo/bottom`,
      lowerTodo,
      {
        headers: {
          accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
        },
      }
    );
    console.log("API Response:", response.data); // 디버그 로그
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error adding lower todo:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error adding lower todo:", error);
    }
    throw error;
  }
};

//상위 투두리스트 삭제 함수
export const deleteUpperTodo = async (projectId: string, topTodoId: string) => {
  try {
    console.log(
      `Deleting Upper Todo: Project ID - ${projectId}, Top Todo ID - ${topTodoId}`
    );
    const response = await api.delete(
      `/team/${projectId}/todo/top/${topTodoId}`,
      {
        headers: {
          accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
        },
      }
    );
    console.log("Delete API Response:", response.data); // 디버그 로그
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error deleting upper todo:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error deleting upper todo:", error);
    }
    throw error;
  }
};
