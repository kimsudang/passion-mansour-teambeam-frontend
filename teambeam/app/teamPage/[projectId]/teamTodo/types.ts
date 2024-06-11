export interface TodoItem {
  topTodoId?: string;
  middleTodoId?: string;
  bottomTodoId?: string;
  title: string;
  startDate: string;
  endDate: string;
  status: boolean;
  assignees?: string[];
  bottomTodos?: TodoItem[];
  member?: string;
  memo?: string;
  tags?: number[];
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
  id: number;
  name: string;
  memberId?: number;
  memberName?: string;
};
