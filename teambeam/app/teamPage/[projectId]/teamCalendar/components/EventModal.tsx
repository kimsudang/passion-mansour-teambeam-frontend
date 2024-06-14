import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Participant } from "@/app/teamPage/[projectId]/teamTodo/types";

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: {
    title: string;
    time: string;
    location: string;
    content: string;
    link: string;
    assignees: { id: number; name: string }[];
  }) => void;
  participants: Participant[];
  readonly?: boolean;
  onDelete?: (scheduleId: number) => void;
  initialEvent?: {
    title: string;
    time: string;
    location: string;
    content: string;
    link: string;
    assignees: { id: number; name: string }[];
    id: number;
  };
};

interface DaumPostcodeData {
  address: string;
  addressType: string;
  bname: string;
  buildingName: string;
  zonecode: string;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  participants,
  readonly = false,
  onDelete,
  initialEvent,
}) => {
  const [title, setTitle] = useState(initialEvent?.title || "");
  const [time, setTime] = useState(initialEvent?.time || "");
  const [location, setLocation] = useState(initialEvent?.location || "");
  const [content, setContent] = useState(initialEvent?.content || "");
  const [link, setLink] = useState(initialEvent?.link || "");
  const [assignees, setAssignees] = useState<{ id: number; name: string }[]>(
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
    const assignees = selectedOptions.map((option: any) => ({
      id: option.value,
      name: option.label,
    }));
    setAssignees(assignees);
  };

  const openDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data: DaumPostcodeData) {
        let addr = data.address; // 최종 주소 변수
        let extraAddr = ""; // 참고항목 변수

        if (data.addressType === "R") {
          // 도로명 주소인 경우
          if (data.bname !== "") {
            extraAddr += data.bname;
          }
          if (data.buildingName !== "") {
            extraAddr +=
              extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
          }
          addr += extraAddr !== "" ? ` (${extraAddr})` : "";
        }

        setLocation(addr);
        setLink(`https://map.kakao.com/link/map/${data.zonecode}`);
      },
    }).open();
  };

  const handleSubmit = () => {
    if (!title || !time) {
      alert("일정명과 일시는 필수 입력 항목입니다.");
      return;
    }

    onSave({ title, time, location, content, link, assignees });
    onClose();
  };

  const handleDelete = async () => {
    if (initialEvent && initialEvent.id) {
      if (onDelete) {
        onDelete(initialEvent.id);
      }
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
            <button className="deleteButton" onClick={handleDelete}>
              삭제
            </button>
          ) : (
            <button className="saveButton" onClick={handleSubmit}>
              저장
            </button>
          )}
          <button className="cancelButton" onClick={onClose}>
            닫기
          </button>
        </div>
        <div className="modalContent">
          <input
            className="eventTitle"
            type="text"
            placeholder="일정명을 입력하세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            readOnly={readonly}
            required
          />
          <div className="inputGroup">
            <label>일시</label>
            <input
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              readOnly={readonly}
              required
            />
          </div>
          <div className="inputGroup">
            <label>참석자</label>
            <Select
              isMulti
              value={assignees.map((assignee) => ({
                value: assignee.id,
                label: assignee.name,
              }))}
              className="selectBox"
              onChange={handleAssigneeChange}
              options={assigneeOptions}
              placeholder="참석자를 선택하세요."
              isDisabled={readonly}
            />
          </div>
          <div className="inputGroup">
            <label>장소</label>
            <input
              type="text"
              placeholder="장소를 입력하세요."
              value={location}
              readOnly
            />
            <button
              type="button"
              onClick={openDaumPostcode}
              disabled={readonly}
            >
              검색
            </button>
          </div>
          <div className="inputGroup">
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
          <hr />
          <div className="inputGroup eventMemo">
            <label>내용</label>
            <textarea
              placeholder="메모할 내용을 입력해주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              readOnly={readonly}
              required
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
