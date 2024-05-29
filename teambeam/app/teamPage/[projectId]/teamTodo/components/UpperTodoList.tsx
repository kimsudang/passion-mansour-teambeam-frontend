"use client";

import React, { useState } from "react";
import MiddleTodoList from "./MiddleTodoList";
import DropdownMenu from "./DropdownMenu";
import { TodoList, Participant } from "../types";
import { EllipsisBtn } from "@/app/_components/Icons";
import { toast } from "react-toastify";

type Props = {
  list: TodoList;
  onAddGoal: (
    type: string,
    upperTodoId?: string,
    middleTodoId?: string
  ) => void;
  onDeleteGoal: (topTodoId: string) => void;
  listCount: number;
  onStatusChange: (type: string, id: string, newStatus: boolean) => void;
  participants: Participant[];
};

const UpperTodoList: React.FC<Props> = ({
  list,
  onAddGoal,
  onDeleteGoal,
  listCount,
  onStatusChange,
  participants,
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
      onDeleteGoal(list.topTodoId);
    } else {
      toast.error(
        "목표를 삭제할 수 없습니다. 최소 하나의 목표는 있어야 합니다."
      );
    }
    setIsDropdownOpen(false);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStatusChange("top", list.topTodoId, !e.target.checked);
  };

  return (
    <div className="upperTodoList">
      <div className="upperTodoHeader">
        <div>
          <input
            type="checkbox"
            checked={!list.status}
            onChange={handleStatusChange}
          />
          <h3 className="upperTitle">{list.title}</h3>
        </div>
        <div className="upperSide">
          <span className="upperDate">
            {list.startDate} - {list.endDate}
          </span>
          <div className="ellipsisContainer" onClick={handleEllipsisClick}>
            <EllipsisBtn size={4} />
            <DropdownMenu
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              onAddGoal={() => {
                console.log(
                  "Adding upper todo with topTodoId:",
                  list.topTodoId
                );
                onAddGoal("상위 투두 추가 모달", list.topTodoId);
              }}
              onViewPastGoals={handleViewPastGoals}
              onDeleteGoal={handleDeleteGoal}
            />
          </div>
        </div>
      </div>
      {list.middleTodos.map((task) => (
        <MiddleTodoList
          key={task.middleTodoId}
          task={task}
          onAddGoal={(type: string, middleTodoId?: string) => {
            console.log(
              "Adding lower todo with middleTodoId:",
              task.middleTodoId
            );
            onAddGoal(type, list.topTodoId, task.middleTodoId);
          }}
          onStatusChange={onStatusChange}
          participants={participants}
        />
      ))}
      <button
        className="addSubtask"
        onClick={() => {
          console.log("Adding middle todo with topTodoId:", list.topTodoId);
          onAddGoal("중위 투두 추가 모달", list.topTodoId);
        }}
      >
        +
      </button>
    </div>
  );
};

export default UpperTodoList;
