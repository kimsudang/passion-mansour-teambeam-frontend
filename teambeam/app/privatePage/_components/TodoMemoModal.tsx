"use client";

import React, { useEffect, useState } from "react";
import "../_components/TodoMemoModal.scss";
import api from "@/app/_api/api";

interface Assignee {
  memberId: number;
  memberName: string;
}

interface Todo {
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

interface TodoMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  bottomTodoId: number;
}

const TodoMemoModal: React.FC<TodoMemoModalProps> = ({ isOpen, onClose, bottomTodoId }) => {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [memo, setMemo] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      const fetchTodo = async () => {
        try {
          const response = await api.get(`/my/main/${bottomTodoId}`, {
            headers: {
              Authorization: localStorage.getItem('Authorization'),
              RefreshToken: localStorage.getItem('RefreshToken'),
            },
          });
          setTodo(response.data.data);
          setMemo(response.data.data.memo || "");
        } catch (err) {
          setError('할 일을 가져오는 중 오류가 발생했습니다.');
        }
      };

      fetchTodo();
    }
  }, [isOpen, bottomTodoId]);

  const handleSaveMemo = async () => {
    if (!todo) return;

    try {
      const response = await api.patch(`/my/main/${bottomTodoId}`, { memo }, {
        headers: {
          Authorization: localStorage.getItem('Authorization'),
          RefreshToken: localStorage.getItem('RefreshToken'),
        },
      });
      setTodo(response.data.date);
      alert('메모가 저장되었습니다.');
      onClose();
    } catch (err) {
      setError('메모를 저장하는 중 오류가 발생했습니다.');
    }
  };
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="todoMemoModalContainer" onClick={handleOverlayClick}>
      <div className="todoMemoModal">
        <button className="todoMemoModalClose" onClick={onClose}>
          &times;
        </button>
        <div className="todoMemoModalContent">
          {error && <p className="error">{error}</p>}
          {todo ? (
            <>
              <h2>{todo.title}</h2>
              <p>기간: {todo.startDate} ~ {todo.endDate}</p>
              {todo.status && <p className="completedModal">완료된 작업</p>}
              <p>태그: </p>
              <div className="todoMemoTags">
                {(Array.isArray(todo.assignees) ? todo.assignees : [todo.assignees]).map(assignee => (
                  <span className="tag" key={assignee.memberId}>{assignee.memberName}</span>
                ))}
              </div>
              <p>메모</p>
              <textarea 
                className="memoArea" 
                placeholder="메모 작성" 
                value={memo}
                onChange={(e) => setMemo(e.target.value)} />
              <button className="saveMemoButton" onClick={handleSaveMemo}>저장</button>
            </>
          ) : (
            <>Loading...</>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoMemoModal;
