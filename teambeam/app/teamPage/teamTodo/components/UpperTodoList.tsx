"use client";

import React, { useState } from "react";
import MiddleTodoList from "./MiddleTodoList";
import DropdownMenu from "./DropdownMenu";
import { TodoList } from "../types";
import { EllipsisBtn } from "@/app/_components/Icons";

type Props = {
  list: TodoList;
  onAddGoal: (type: string) => void;
};

const UpperTodoList: React.FC<Props> = ({ list, onAddGoal }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEllipsisClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleViewPastGoals = () => {
    // 지난 목표 보기 기능 처리
    setIsDropdownOpen(false);
  };

  const handleDeleteGoal = () => {
    // 목표 삭제 기능 처리
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
              onAddGoal={() => onAddGoal("상위 투두 추가 모달")}
              onViewPastGoals={handleViewPastGoals}
              onDeleteGoal={handleDeleteGoal}
            />
          </div>
        </div>
      </div>
      {list.tasks.map((task) => (
        <MiddleTodoList key={task.id} task={task} onAddGoal={onAddGoal} />
      ))}
      <button
        className="addSubtask"
        onClick={() => onAddGoal("중위 투두 추가 모달")}
      >
        +
      </button>
    </div>
  );
};

export default UpperTodoList;
