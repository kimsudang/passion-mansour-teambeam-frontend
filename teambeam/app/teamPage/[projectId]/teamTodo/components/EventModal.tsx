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
      assignees?: number[];
      memo?: string;
    }
  ) => void;
  title: string;
  showAssignee?: boolean;
  participants: Participant[];
  upperStartDate?: string;
  upperEndDate?: string;
  middleStartDate?: string;
  middleEndDate?: string;
};

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  showAssignee,
  participants,
  upperStartDate,
  upperEndDate,
  middleStartDate,
  middleEndDate,
}) => {
  const [eventTitle, setEventTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assignees, setAssignees] = useState<number[]>([]);
  const [memo, setMemo] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setEventTitle("");
      setStartDate("");
      setEndDate("");
      setAssignees([]);
      setMemo("");
    }
  }, [isOpen]);

  const handleAssigneeChange = (selectedOption: any) => {
    setAssignees([selectedOption.value]);
  };

  const handleSubmit = () => {
    if (
      !eventTitle ||
      !startDate ||
      !endDate ||
      (showAssignee && assignees.length === 0)
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // 날짜 검증 로직 추가
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      alert("시작 날짜는 종료 날짜보다 이전이어야 합니다.");
      return;
    }

    if (upperStartDate && upperEndDate) {
      const upperStart = new Date(upperStartDate);
      const upperEnd = new Date(upperEndDate);
      if (start < upperStart || end > upperEnd) {
        alert("하위 투두는 상위 투두 기간 내에 있어야 합니다.");
        return;
      }
    }

    if (middleStartDate && middleEndDate) {
      const middleStart = new Date(middleStartDate);
      const middleEnd = new Date(middleEndDate);
      if (start < middleStart || end > middleEnd) {
        alert("하위 투두는 중위 투두 기간 내에 있어야 합니다.");
        return;
      }
    }

    const event = {
      title: eventTitle,
      startDate,
      endDate,
      assignees: showAssignee ? assignees : [],
      memo,
    };

    console.log("Event being submitted to onSave:", event);
    onSave(title, event);
    onClose();
  };

  const assigneeOptions = participants.map((participant) => ({
    value: participant.id,
    label: participant.name,
  }));

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalContent">
          <div className="modalButtons">
            <button className="saveButton" onClick={handleSubmit}>
              저장
            </button>
            <button className="cancelButton" onClick={onClose}>
              닫기
            </button>
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
                value={assignees.map((assignee) => ({
                  value: assignee,
                  label: participants.find((p) => p.id === assignee)?.name,
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
