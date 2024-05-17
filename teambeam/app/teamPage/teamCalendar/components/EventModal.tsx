import React, { useState } from "react";

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: { title: string; start: string; end: string }) => void;
};

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // 기본 폼 제출 동작을 방지
    onSave({ title, start, end });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <div className="modalButtons">
            <button type="submit">저장</button>
            <button type="button" onClick={onClose}>
              닫기
            </button>
          </div>
          <input
            className="eventTitle"
            type="text"
            placeholder="일정명을 입력하세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div>
            <label>참석자</label>
            <input type="text" placeholder="@사용자명" />
          </div>
          <div>
            <label>일정 시작</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </div>
          <div>
            <label>일정 종료</label>
            <input
              type="datetime-local"
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
        </form>
      </div>
    </div>
  );
};

export default EventModal;
