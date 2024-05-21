export interface TodoItem {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  assignees?: string[];
  subtasks?: TodoItem[];
}

export type TodoList = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  tasks: TodoItem[];
};

export type Participant = {
  id: string;
  name: string;
};
