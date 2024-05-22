"use client";

import React, { useState } from "react";
import UpperTodoList from "./components/UpperTodoList";
import EventModal from "./components/EventModal";
import { TodoList, Participant } from "./types";
import "./styles/main.scss";

const TeamTodo: React.FC = () => {
  const [todoLists, setTodoLists] = useState<TodoList[]>([
    {
      id: "1",
      title: "상위 투두 리스트명 1",
      startDate: "05/10",
      endDate: "05/20",
      tasks: [
        {
          id: "1-1",
          title: "중위 투두 리스트 1",
          startDate: "05/10",
          endDate: "05/14",
          subtasks: [
            {
              id: "1-1-1",
              title: "하위 투두 리스트명",
              startDate: "05/10",
              endDate: "05/10",
              assignees: ["또치"],
            },
            {
              id: "1-1-2",
              title: "하위 투두 리스트명",
              startDate: "05/11",
              endDate: "05/12",
              assignees: ["고길동"],
            },
            {
              id: "1-1-3",
              title: "하위 투두 리스트명",
              startDate: "05/10",
              endDate: "05/13",
              assignees: ["또치"],
            },
          ],
        },
        // 다른 중위 투두 리스트들
      ],
    },
    // 다른 상위 투두 리스트들
  ]);

  const participants: Participant[] = [
    { id: "1", name: "또치" },
    { id: "2", name: "고길동" },
    { id: "3", name: "둘리" },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [showAssignee, setShowAssignee] = useState(false);
  const [showLink, setShowLink] = useState(false);

  const handleAddButtonClick = (type: string) => {
    setModalTitle(type);
    setShowAssignee(type === "하위 투두 추가 모달");
    setShowLink(type === "하위 투두 추가 모달");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEventSave = (event: {
    title: string;
    startDate: string;
    endDate: string;
    assignees?: string[];
    link?: string;
  }) => {
    // 새 이벤트를 투두 리스트에 추가하는 로직
    console.log("새 이벤트 저장:", event);
  };

  return (
    <div className="todoContainer">
      <h2>투두리스트</h2>
      {todoLists.map((list) => (
        <UpperTodoList
          key={list.id}
          list={list}
          onAddGoal={handleAddButtonClick}
        />
      ))}

      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleEventSave}
        title={modalTitle}
        showAssignee={showAssignee}
        showLink={showLink}
        participants={participants}
      />
    </div>
  );
};

export default TeamTodo;
