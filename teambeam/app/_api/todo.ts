import api from "@/app/_api/api";

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
    console.error("Error fetching todos:", error);
    throw error;
  }
};

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
    console.error("Error adding upper todo:", error);
    throw error;
  }
};

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
    const response = await api.post(
      `/team/${projectId}/todo/middle`,
      middleTodo,
      {
        headers: {
          accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding middle todo:", error);
    throw error;
  }
};

export const addLowerTodo = async (
  projectId: string,
  lowerTodo: {
    topTodoId: string;
    middleTodoId: string;
    title: string;
    startDate: string;
    endDate: string;
    assignees?: string[];
  }
) => {
  try {
    const response = await api.post(
      `/team/${projectId}/todo/bottom`,
      lowerTodo,
      {
        headers: {
          accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding lower todo:", error);
    throw error;
  }
};
