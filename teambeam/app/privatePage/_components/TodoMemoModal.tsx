'use client';

import React, { useState } from 'react';
import "./TodoMemoModal.scss";
import { Project, Todo, TodoDetails } from "../main/types"; 

interface TodoMemoModalProps {
  todo: Todo | null;
  details: TodoDetails | null;
  onClose: () => void;
  onSaveMemo: (memo: string) => void;
}

const TodoMemoModal: React.FC<TodoMemoModalProps> = ({ todo, details, onClose, onSaveMemo }) => {
  const [memo, setMemo] = useState<string>(details?.memo || "");

  const handleSave = () => {
    onSaveMemo(memo);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains('todoModal')) {
      onClose();
    }
  };

  if (!todo || !details) return null;

  return (
    <div className="todoModal" onClick={handleOutsideClick}>
      <div className="modalContent">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{details.title}</h2>
        <p>상태: {details.status ? '완료' : '미완료'}</p>
        <p>시작 날짜: {details.startDate}</p>
        <p>종료 날짜: {details.endDate}</p>
        <p>담당자: {details.assignees.memberName}</p>
        <div className="tagContainer">
          {todo.tags.map((tag: string, index: number) => (
            <div className="tag" key={index}>
              {tag}
            </div>
          ))}
        </div>
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="메모를 입력하세요"></textarea>
        <button onClick={handleSave}>저장</button>
        {details.memo && <p>메모: {details.memo}</p>}
      </div>
    </div>
  );
};

export default TodoMemoModal;