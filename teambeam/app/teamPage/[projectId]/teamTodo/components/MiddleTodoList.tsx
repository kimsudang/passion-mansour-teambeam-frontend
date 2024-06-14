import React, { useState } from "react";
import LowerTodoList from "./LowerTodoList";
import { TodoItem, Participant } from "../types";
import { ToggleDownBtnIcon, ToggleUpBtnIcon } from "@/app/_components/Icons";

type Props = {
  task: TodoItem;
  onAddGoal: (type: string, middleTodoId?: string) => void;
  onStatusChange: (type: string, id: string, newStatus: boolean) => void;
  participants: Participant[];
};

const MiddleTodoList: React.FC<Props> = ({
  task,
  onAddGoal,
  onStatusChange,
  participants,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStatusChange("middle", task.middleTodoId, !e.target.checked);
  };

  // 중위 투두리스트 상태 결정 로직
  const isMiddleChecked =
    task.bottomTodos.length > 0 &&
    task.bottomTodos.every((bottomTodo) => bottomTodo.status === false);

  return (
    <div className="middleTodoList">
      <div className="middleTodoHeader" onClick={toggleOpen}>
        <div>
          <input
            type="checkbox"
            checked={isMiddleChecked}
            onChange={handleStatusChange}
          />
          <h4>{task.title}</h4>
        </div>
        <div className="middleSide">
          <span className="middleDate">
            {task.startDate} - {task.endDate}
          </span>
          <div>
            {isOpen ? (
              <ToggleUpBtnIcon size={15} />
            ) : (
              <ToggleDownBtnIcon size={15} />
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="lowerTodoContainer">
          {(task.bottomTodos ?? []).map((subtask) => (
            <LowerTodoList
              key={subtask.bottomTodoId}
              subtask={subtask}
              onStatusChange={(id, newStatus) =>
                onStatusChange("bottom", id, newStatus)
              }
              participants={participants}
            />
          ))}
          <button
            className="lowAddSubtask"
            onClick={() => onAddGoal("하위 투두 추가 모달", task.middleTodoId)}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default MiddleTodoList;
