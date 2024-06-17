import api from "@/app/_api/api";
import { AxiosError } from "axios";

// 로컬 스토리지에서 토큰을 가져오는 함수
const getToken = (): string => {
  const token = localStorage.getItem("Authorization");
  if (!token) {
    throw new Error("Authorization token is missing");
  }
  return token;
};

const getRefreshToken = (): string => {
  const refreshToken = localStorage.getItem("RefreshToken");
  if (!refreshToken) {
    throw new Error("Refresh token is missing");
  }
  return refreshToken;
};

// 투두리스트 조회 함수
export const fetchTodos = async (projectId: string) => {
  try {
    const token = getToken();
    const refreshToken = getRefreshToken();

    const response = await api.get(`/team/${projectId}/todo`, {
      headers: {
        Authorization: token,
        RefreshToken: refreshToken,
      },
    });

    console.log("Fetch Todos Response:", response.data); // 응답 데이터 로그 출력

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
          memo: bottomTodo.memo,
          assignees: bottomTodo.assignees
            ? [bottomTodo.assignees.memberName]
            : [],
          tags: bottomTodo.taglist || [],
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

// 상위 투두리스트 추가 함수
export const addUpperTodo = async (
  projectId: string,
  upperTodo: {
    title: string;
    startDate: string;
    endDate: string;
  }
) => {
  try {
    const token = getToken();

    const response = await api.post(
      `/team/${projectId}/todo/top`,
      {
        ...upperTodo,
        status: false,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
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
    const token = getToken();

    const response = await api.post(
      `/team/${projectId}/todo/middle`,
      {
        ...middleTodo,
        status: false,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
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
    memo?: string;
    member: string;
    tags: number[];
  }
): Promise<any> => {
  try {
    const token = getToken();
    const refreshToken = getRefreshToken();

    const response = await api.post(
      `/team/${projectId}/todo/bottom`,
      {
        ...lowerTodo,
        status: false,
        taglist: lowerTodo.tags || [],
      },
      {
        headers: {
          Authorization: token,
          RefreshToken: refreshToken,
        },
      }
    );
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
export const fetchParticipants = async (projectId: string) => {
  try {
    const token = getToken();
    const refreshToken = getRefreshToken();

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
    const token = getToken();

    console.log(
      `Deleting Upper Todo: Project ID - ${projectId}, Top Todo ID - ${topTodoId}`
    );
    const response = await api.delete(
      `/team/${projectId}/todo/top/${topTodoId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log("Delete API Response:", response.data);

    if (!response.data || (response.data && response.data.status === 200)) {
      return response.data;
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

// 중위 투두리스트 삭제 함수
export const deleteMiddleTodo = async (
  projectId: string,
  middleTodoId: string
) => {
  try {
    const token = getToken();

    const response = await api.delete(
      `/team/${projectId}/todo/middle/${middleTodoId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    // 상태 코드 200인 경우 올바르게 처리
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Invalid response data format");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error deleting middle todo:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error deleting middle todo:", error);
    }
    throw error;
  }
};

// 하위 투두리스트 삭제 함수
export const deleteLowerTodo = async (
  projectId: string,
  bottomTodoId: string
) => {
  try {
    const token = getToken();

    console.log(
      `Deleting Lower Todo: Project ID - ${projectId}, Bottom Todo ID - ${bottomTodoId}`
    );
    const response = await api.delete(
      `/team/${projectId}/todo/bottom/${bottomTodoId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log("Delete API Response:", response.data);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Invalid response data format");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error deleting lower todo:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error deleting lower todo:", error);
    }
    throw error;
  }
};

// 태그 리스트 조회 함수
export const fetchTags = async (projectId: string) => {
  try {
    const token = getToken();
    const refreshToken = getRefreshToken();

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

//하위 투두리스트 상태변화 업데이트 함수
export const updateLowerTodoStatus = async (
  projectId: string,
  bottomTodoId: string,
  status: boolean
) => {
  try {
    const token = getToken();

    const response = await api.patch(
      `/team/${projectId}/todo/bottom/${bottomTodoId}`,
      { status },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error updating lower todo status:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error updating lower todo status:", error);
    }
    throw error;
  }
};
