"use client";

import React, { useState } from "react";
import MiddleTodoList from "./MiddleTodoList";
import DropdownMenu from "./DropdownMenu";
import { TodoList } from "../types";
import { EllipsisBtn } from "@/app/_components/Icons";
import { toast } from "react-toastify";

type Props = {
  list: TodoList;
  onAddGoal: (
    type: string,
    upperTodoId?: string,
    middleTodoId?: string
  ) => void;
  onDeleteGoal: (id: string) => void;
  listCount: number;
};

const UpperTodoList: React.FC<Props> = ({
  list,
  onAddGoal,
  onDeleteGoal,
  listCount,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEllipsisClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleViewPastGoals = () => {
    setIsDropdownOpen(false);
  };

  const handleDeleteGoal = () => {
    if (listCount > 1) {
      onDeleteGoal(list.id);
    } else {
      toast.error(
        "목표를 삭제할 수 없습니다. 최소 하나의 목표는 있어야 합니다."
      );
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="upperTodoList">
      <div className="upperTodoHeader">
        <h3 className="upperTitle">{list.title}</h3>
        <div className="upperSide">
          <span className="upperDate">
            {list.startDate} - {list.endDate}
          </span>
          <div className="ellipsisContainer" onClick={handleEllipsisClick}>
            <EllipsisBtn size={4} />
            <DropdownMenu
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              onAddGoal={() => onAddGoal("상위 투두 추가 모달", list.id)}
              onViewPastGoals={handleViewPastGoals}
              onDeleteGoal={handleDeleteGoal}
            />
          </div>
        </div>
      </div>
      {list.tasks.map((task) => (
        <MiddleTodoList
          key={task.id}
          task={task}
          onAddGoal={(type) => onAddGoal(type, list.id, task.id)}
        />
      ))}
      <button
        className="addSubtask"
        onClick={() => onAddGoal("중위 투두 추가 모달", list.id)}
      >
        +
      </button>
    </div>
  );
};

export default UpperTodoList;
