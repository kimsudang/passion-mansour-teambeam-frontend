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

// 참가자 조회 함수
export const fetchParticipants = async (
  projectId: string,
  token: string,
  refreshToken: string
) => {
  try {
    const response = await api.get(`/team/${projectId}/joinMember`, {
      headers: {
        Authorization: token,
        RefreshToken: refreshToken,
      },
    });

    console.log("Participants response:", response.data);

    if (response.data && response.data.joinMemberList) {
      const participants = response.data.joinMemberList.map((member: any) => ({
        id: String(member.memberId),
        name: member.memberName,
      }));
      return participants;
    } else {
      throw new Error("Invalid response data format");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching participants:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching participants:", error);
    }
    throw error;
  }
};

// 상위 투두리스트 삭제 함수
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

    // 응답 데이터가 없거나 status가 200일 경우 성공으로 처리
    if (!response.data || (response.data && response.data.status === 200)) {
      return response.data; // 삭제된 일정 데이터 반환
    } else {
      throw new Error("Invalid response data format");
    }
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

// 태그 리스트 조회 함수
export const fetchTags = async (
  projectId: string,
  token: string,
  refreshToken: string
) => {
  try {
    const response = await api.get(`/team/${projectId}/todo/tag`, {
      headers: {
        Authorization: token,
        RefreshToken: refreshToken,
      },
    });

    if (response.data && response.data.tagResponses) {
      return response.data.tagResponses.map((tag: any) => ({
        id: tag.tagId,
        name: tag.tagName,
        category: tag.tagCategory,
      }));
    } else {
      throw new Error("Invalid response data format");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching tags:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching tags:", error);
    }
    throw error;
  }
};
