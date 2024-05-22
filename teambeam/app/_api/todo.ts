// import api from "@/app/_api/api";

// export const fetchTodos = async (projectId: string) => {
//   try {
//     const response = await api.get(`/team/${projectId}/todo`, {
//       headers: {
//         accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
//       },
//     });

//     const todos = response.data.todos.map((todo: any) => ({
//       id: String(todo.topTodoId),
//       title: todo.title,
//       startDate: todo.startDate,
//       endDate: todo.endDate,
//       tasks: todo.middleTodos.map((middleTodo: any) => ({
//         id: String(middleTodo.middleTodoId),
//         title: middleTodo.title,
//         startDate: middleTodo.startDate,
//         endDate: middleTodo.endDate,
//         subtasks: middleTodo.bottomTodos.map((bottomTodo: any) => ({
//           id: String(bottomTodo.bottomTodoId),
//           title: bottomTodo.title,
//           startDate: bottomTodo.startDate,
//           endDate: bottomTodo.endDate,
//           assignees: bottomTodo.member ? [bottomTodo.member.memberName] : [],
//         })),
//       })),
//     }));

//     return todos;
//   } catch (error) {
//     console.error("Error fetching todos:", error);
//     throw error;
//   }
// };

// export const addUpperTodo = async (
//   projectId: string,
//   upperTodo: {
//     title: string;
//     startDate: string;
//     endDate: string;
//   }
// ) => {
//   try {
//     const response = await api.post(`/team/${projectId}/todo/top`, upperTodo, {
//       headers: {
//         accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error adding upper todo:", error);
//     throw error;
//   }
// };
