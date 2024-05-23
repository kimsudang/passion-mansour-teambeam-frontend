export interface TodoItem {
  topTodoId: string;
  middleTodoId?: string;
  bottomTodoId?: string;
  title: string;
  startDate: string;
  endDate: string;
  status: boolean;
  assignees?: string[];
  bottomTodos?: TodoItem[];
}

export type TodoList = {
  topTodoId: string;
  title: string;
  startDate: string;
  endDate: string;
  status: boolean;
  middleTodos: TodoItem[];
};

export type Participant = {
  id: string;
  name: string;
};
