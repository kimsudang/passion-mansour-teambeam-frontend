"use client";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Participant } from "../types";

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    type: string,
    event: {
      title: string;
      startDate: string;
      endDate: string;
      assignees?: string[];
    }
  ) => void;
  title: string;
  showAssignee?: boolean;
  participants: Participant[];
};

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  showAssignee,
  participants,
}) => {
  const [eventTitle, setEventTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assignees, setAssignees] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setEventTitle("");
      setStartDate("");
      setEndDate("");
      setAssignees([]);
    }
  }, [isOpen]);

  const handleAssigneeChange = (selectedOptions: any) => {
    const selectedAssignees = selectedOptions.map(
      (option: any) => option.value
    );
    setAssignees(selectedAssignees);
  };

  const handleSubmit = () => {
    if (!eventTitle || !startDate || !endDate) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const event = {
      title: eventTitle,
      startDate,
      endDate,
      assignees: showAssignee ? assignees : undefined,
    };
    console.log("Submitting Event:", event); // 디버그 로그 추가
    onSave("상위 투두 추가 모달", event); // 함수 호출 시 '상위 투두 추가 모달'과 event 데이터 전달
    onClose();
  };

  const assigneeOptions = participants.map((participant) => ({
    value: participant.name,
    label: participant.name,
  }));

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalContent">
          <div className="modalButtons">
            <button onClick={handleSubmit}>저장</button>
            <button onClick={onClose}>취소</button>
          </div>
          <input
            className="eventTitle"
            type="text"
            placeholder="일정명 입력"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <div>
            <label>일정 시작</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>일정 종료</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {showAssignee && (
            <div className="todoAssignee">
              <label>담당자</label>
              <Select
                isMulti
                value={assignees.map((assignee) => ({
                  value: assignee,
                  label: assignee,
                }))}
                className="selectBox"
                onChange={handleAssigneeChange}
                options={assigneeOptions}
                placeholder="담당자를 선택하세요."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
