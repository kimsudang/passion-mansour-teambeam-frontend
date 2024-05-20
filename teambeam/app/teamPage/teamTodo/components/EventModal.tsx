"use client";

import React, { useState, useEffect } from "react";

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: {
    title: string;
    startDate: string;
    endDate: string;
    assignee?: string;
    link?: string;
  }) => void;
  title: string;
  showAssignee?: boolean;
  showLink?: boolean;
};

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  showAssignee,
  showLink,
}) => {
  const [eventTitle, setEventTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setEventTitle("");
      setStartDate("");
      setEndDate("");
      setAssignee("");
      setLink("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const event = {
      title: eventTitle,
      startDate,
      endDate,
      assignee: showAssignee ? assignee : undefined,
      link: showLink ? link : undefined,
    };
    onSave(event);
    onClose();
  };

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
            <div>
              <label>담당자</label>
              <input
                type="text"
                placeholder="담당자를 입력하세요."
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
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
        </div>
      </div>
    </div>
  );
};

export default EventModal;
