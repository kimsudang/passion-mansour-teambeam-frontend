"use client";

import React from "react";
import { TodoItem } from "../types";

type Props = {
  subtask: TodoItem;
  onStatusChange: (id: string, newStatus: boolean) => void;
};

const LowerTodoList: React.FC<Props> = ({ subtask, onStatusChange }) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (subtask.bottomTodoId) {
      onStatusChange(subtask.bottomTodoId, !e.target.checked);
    }
  };

  return (
    <div className="lowerTodoList">
      <div>
        <input
          type="checkbox"
          checked={!subtask.status}
          onChange={handleStatusChange}
        />
        <h5 className="lowerTitle">{subtask.title}</h5>
      </div>
      <span className="lowerDate">
        {subtask.startDate} - {subtask.endDate}
      </span>
      {subtask.assignees && subtask.assignees.length > 0 && (
        <div className="assigneeTags">
          {subtask.assignees.map((assignee, index) => (
            <span key={index} className="assigneeTag">
              {assignee}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default LowerTodoList;
