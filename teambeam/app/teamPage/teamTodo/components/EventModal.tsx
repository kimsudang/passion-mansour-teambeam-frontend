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
      memo?: string;
      assignees?: string[];
      link?: string;
    }
  ) => void;
  title: string;
  showAssignee?: boolean;
  showLink?: boolean;
  showMemo?: boolean;
  participants: Participant[];
};

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  showAssignee,
  showLink,
  showMemo,
  participants,
}) => {
  const [eventTitle, setEventTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assignees, setAssignees] = useState<string[]>([]);
  const [link, setLink] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setEventTitle("");
      setStartDate("");
      setEndDate("");
      setAssignees([]);
      setLink("");
      setMemo("");
    }
  }, [isOpen]);

  const handleAssigneeChange = (selectedOptions: any) => {
    const selectedAssignees = selectedOptions.map(
      (option: any) => option.value
    );
    setAssignees(selectedAssignees);
  };

  const handleSubmit = () => {
    const event = {
      title: eventTitle,
      startDate,
      endDate,
      memo,
      assignees: showAssignee ? assignees : undefined,
      link: showLink ? link : undefined,
    };
    onSave(title, event);
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
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>일정 종료</label>
            <input
              type="datetime-local"
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
          {showLink && (
            <div>
              <label>링크</label>
              <input
                type="text"
                placeholder="참고자료 링크를 첨부해주세요."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
          )}
          {showMemo && (
            <div>
              <label>메모</label>
              <input
                type="text"
                placeholder="메모를 입력하세요."
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
