import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Participant } from "@/app/teamPage/teamTodo/types";

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: {
    title: string;
    time: string;
    location: string;
    content: string;
    link: string;
    assignees: number[];
  }) => void;
  participants: Participant[];
  readonly?: boolean;
  onDelete?: () => void;
  initialEvent?: {
    title: string;
    time: string;
    location: string;
    content: string;
    link: string;
    assignees: number[];
  };
  onTimeChange?: (time: string) => void; // 추가
};

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  participants,
  readonly = false,
  onDelete,
  initialEvent,
  onTimeChange, // 추가
}) => {
  const [title, setTitle] = useState(initialEvent?.title || "");
  const [time, setTime] = useState(initialEvent?.time || "");
  const [location, setLocation] = useState(initialEvent?.location || "");
  const [content, setContent] = useState(initialEvent?.content || "");
  const [link, setLink] = useState(initialEvent?.link || "");
  const [assignees, setAssignees] = useState<number[]>(
    initialEvent?.assignees || []
  );

  useEffect(() => {
    if (!isOpen) {
      setTitle(initialEvent?.title || "");
      setTime(initialEvent?.time || "");
      setLocation(initialEvent?.location || "");
      setContent(initialEvent?.content || "");
      setLink(initialEvent?.link || "");
      setAssignees(initialEvent?.assignees || []);
    }
  }, [isOpen, initialEvent]);

  const handleAssigneeChange = (selectedOptions: any) => {
    const assignees = selectedOptions.map((option: any) => option.value);
    setAssignees(assignees);
  };

  const handleSubmit = () => {
    onSave({ title, time, location, content, link, assignees });
    onClose();
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (onTimeChange) {
      onTimeChange(newTime); // 시간 변경 시 부모 컴포넌트로 전달
    }
  };

  const assigneeOptions = participants.map((participant) => ({
    value: participant.id,
    label: participant.name,
  }));

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalButtons">
          {readonly ? (
            <button onClick={onDelete}>삭제</button>
          ) : (
            <button onClick={handleSubmit}>저장</button>
          )}
          <button onClick={onClose}>닫기</button>
        </div>
        <input
          className="eventTitle"
          type="text"
          placeholder="일정명을 입력하세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          readOnly={readonly}
          required
        />
        <div>
          <label>시간</label>
          <input
            type="datetime-local"
            value={time}
            onChange={handleTimeChange} // handleTimeChange로 변경
            readOnly={readonly}
            required
          />
        </div>
        <div>
          <label>장소</label>
          <input
            type="text"
            placeholder="장소를 입력하세요."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            readOnly={readonly}
            required
          />
        </div>
        <div>
          <label>내용</label>
          <textarea
            placeholder="메모할 내용을 입력해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            readOnly={readonly}
            required
          ></textarea>
        </div>
        <div>
          <label>링크</label>
          <input
            type="text"
            placeholder="참고자료 링크를 첨부해주세요."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            readOnly={readonly}
            required
          />
        </div>
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
            isDisabled={readonly}
          />
        </div>
      </div>
    </div>
  );
};

export default EventModal;
