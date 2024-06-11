import api from "@/app/_api/api";
import { AxiosError } from "axios";

const getTokenHeaders = () => ({
  Authorization: localStorage.getItem('Authorization'),
  RefreshToken: localStorage.getItem('RefreshToken'),
});

// 받아온 정보를 저장하는 interface
interface Project {
  projectId: number;
  projectName: string;
  todos: Todo[];
}

export interface Todo {
  topTodoId: number;
  middleTodoId: number;
  bottomTodoId: number;
  title: string;
  status: boolean;
  startDate: string;
  endDate: string;
  memo: string | null;
  assignees: Assignee | Assignee[];
}

interface Assignee {
  memberId: number;
  memberName: string;
}

export const getTodos = async (userId: string, date: string): Promise<{ projectName: string, todos: Todo[] }[]> => {
  try {
    const response = await api.get(`/my/main/todo/${userId}?date=${date}`, {
      headers: getTokenHeaders(),
    });
    const data: Project[] = response.data;

    // 모든 최하위 투두를 수집
    const projectsWithBottomTodos = data.map(project => {
      const bottomTodos = project.todos
      .filter(todo => todo.bottomTodoId !== null)
      .filter(todo => todo.startDate <= date && todo.endDate >= date);      return {
        projectName: project.projectName,
        todos: bottomTodos.map(todo => ({
          ...todo,
          assignees: Array.isArray(todo.assignees) ? todo.assignees : [todo.assignees],
        })),
      };
    });

    return projectsWithBottomTodos;
  } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error fetching todos:', error.response?.data);
      } else {
        console.error('Unknown error:', error);
      }
      throw error;
  }
};

// 캘린더 이벤트 조회 함수
export const fetchCalendarEvents = async (
  userId: string,
  year: number,
  month: number,
) => {
  try {
    const response = await api.get(
      `/my/main/schedule/${userId}`,
      {
        params: { year, month }, 
        headers: getTokenHeaders(),
      }
    );

    const data = response.data[0];

    if (data && data.status === "200") {
      // 응답 데이터가 있고 상태가 200일 경우
      const scheduleEvents = data.schedules.map((schedule: any) => ({
        id: schedule.scheduleId,
        title: schedule.title,
        start: schedule.time,
        end: schedule.time,
        location: schedule.location,
        content: schedule.content,
        link: schedule.link,
        assignees: schedule.scheduleMembers.map(
          (member: any) => member.memberId
        ),
      })); // 일정 데이터를 필요한 형태로 변환

      

      const todoEvents = data.topTodos.map((todo: any) => ({
        id: todo.topTodoId,
        title: todo.title,
        start: todo.startDate,
        end: todo.endDate,
        todo: true,
      })); // 할일 데이터를 필요한 형태로 변환

      
      console.log("Calendar response:", scheduleEvents);

      return [...scheduleEvents, ...todoEvents]; // 일정과 할일 데이터를 합쳐 반환
    } else {
      throw new Error("Invalid response data format"); // 응답 데이터 형식이 유효하지 않을 경우 에러 발생
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error fetching calendar events:",
        error.response?.data || error.message
      ); // AxiosError인 경우 에러 메시지를 콘솔에 출력
    } else {
      console.error("Error fetching calendar events:", error); // 다른 에러인 경우 에러 메시지를 콘솔에 출력
    }
    throw error; // 에러를 다시 던짐
  }
};