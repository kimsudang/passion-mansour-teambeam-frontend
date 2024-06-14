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

  const handleDeleteGoal = async () => {
    if (listCount > 1) {
      try {
        await onDeleteGoal(list.topTodoId);
        toast.success("목표가 성공적으로 삭제되었습니다.");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting upper todo:", error);
        toast.error("목표 삭제 중 오류가 발생했습니다.");
      }
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

  // 상위 투두리스트 상태 결정 로직
  const isTopChecked =
    list.middleTodos.length > 0 &&
    list.middleTodos.every((middleTodo) => middleTodo.status === false);

  return (
    <div className="upperTodoList">
      <div className="upperTodoHeader">
        <div>
          <input
            type="checkbox"
            checked={isTopChecked}
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
              onAddGoal={() => onAddGoal("상위 투두 추가 모달", list.topTodoId)}
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
          onAddGoal={(type: string, middleTodoId?: string) =>
            onAddGoal(type, list.topTodoId, middleTodoId)
          }
          onStatusChange={onStatusChange}
          participants={participants}
        />
      ))}
      <button
        className="addSubtask"
        onClick={() => onAddGoal("중위 투두 추가 모달", list.topTodoId)}
      >
        +
      </button>
    </div>
  );
};

export default UpperTodoList;
