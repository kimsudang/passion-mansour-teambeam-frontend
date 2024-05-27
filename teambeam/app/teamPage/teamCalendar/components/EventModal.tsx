import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Participant } from "@/app/teamPage/teamTodo/types";

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: { title: string; start: string; end: string }) => void;
  participants: Participant[];
};

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  participants,
}) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [assignees, setAssignees] = useState<number[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setStart("");
      setEnd("");
      setAssignees([]);
    }
  }, [isOpen]);

  const handleAssigneeChange = (selectedOptions: any) => {
    const assignees = selectedOptions.map((option: any) => option.value);
    setAssignees(assignees);
  };

  const handleSubmit = () => {
    onSave({ title, start, end: end || "" });
    onClose();
  };

  const assigneeOptions = participants.map((participant) => ({
    value: participant.id,
    label: participant.name,
  }));

  console.log("Participants in EventModal:", participants); // 로그 추가

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalButtons">
          <button onClick={handleSubmit}>저장</button>
          <button onClick={onClose}>닫기</button>
        </div>
        <input
          className="eventTitle"
          type="text"
          placeholder="일정명을 입력하세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="todoAssignee">
          <label>참석자</label>
          <Select
            isMulti
            value={assignees.map((assignee) => ({
              value: assignee,
              label: participants.find((p) => p.id === assignee)?.name,
            }))}
            onChange={handleAssigneeChange}
            options={assigneeOptions}
            placeholder="참석자를 선택하세요."
          />
        </div>
        <div>
          <label>일정 시작</label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
        </div>
        <div>
          <label>일정 종료</label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
        <div>
          <label>장소</label>
          <input type="text" placeholder="장소를 입력하세요." />
        </div>
        <div>
          <label>링크</label>
          <input type="text" placeholder="참고자료 링크를 첨부해주세요." />
        </div>
        <div className="eventMemo">
          <label>내용</label>
          <textarea placeholder="메모할 내용을 입력해주세요."></textarea>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
