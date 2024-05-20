export type TodoItem = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  subtasks?: TodoItem[];
};

export type TodoList = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  tasks: TodoItem[];
};
