export interface Todo {
  id: number;
  date: string;
  tags: string[];
  completed?: boolean;
}

export interface Project {
  id: number;
  name: string;
  todos: Todo[];
}

export interface TodoDetails {
  topTodoId: number;
  middleTodoId: number;
  bottomTodoId: number;
  title: string;
  status: boolean;
  startDate: string;
  endDate: string;
  memo: string | null;
  assignees: {
    memberId: number;
    memberName: string;
  };
}

// API 응답에 맞는 타입 정의
export interface ApiTodo {
  bottomTodoId: number;
  startDate: string;
  title: string;
  status: boolean;
}

export interface ApiProject {
  projectId: number;
  projectName: string;
  todos: ApiTodo[];
}

// 캘린더 데이터 타입 정의
export interface TopTodo {
  topTodoId: number;
  title: string;
  status: boolean;
  startDate: string;
  endDate: string;
}

export interface Schedule {
  title: string;
  time: string;
  location: string;
  content: string;
  link: string;
  scheduleMembers: {
    memberId: number;
    memberName: string;
  }[];
  scheduleId: number;
}

export interface CalendarData {
  status: string;
  topTodos: TopTodo[];
  schedules: Schedule[];
}