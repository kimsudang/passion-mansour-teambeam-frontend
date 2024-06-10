"use client";

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import "@/app/_styles/Modal.scss";
import { postBoard } from "@/app/_api/board";

type BoardType = {
  boardId: number;
  name: string;
};

export default function BoardAddModal({
  projectId,
  setBoardLists,
  onCloseModal,
}: {
  projectId: string;
  setBoardLists: Dispatch<SetStateAction<BoardType[] | null>>;
  onCloseModal: () => void;
}) {
  const [name, setName] = useState<string>("");

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    []
  );

  const onSubmit = useCallback(async () => {
    console.log("title : ", name);
    try {
      const res = await postBoard(`/team/${projectId}/board`, name);
      setBoardLists((prev) => [prev, res.data]);
      onCloseModal();
    } catch (err) {
      console.log(err);
      window.alert("게시판 생성에 실패했습니다");
    }
  }, [name, projectId, setBoardLists, onCloseModal]);

  return (
    <div className='modal-bg'>
      <div className='modal-wrap'>
        <form action={onSubmit}>
          <div className='modal-header'>
            <h2>게시판 추가</h2>
          </div>

          <div className='modal-content'>
            <input
              type='text'
              value={name}
              onChange={handleNameChange}
              placeholder='게시판명을 입력하세요'
            />
          </div>

          <div className='buttons'>
            <button type='button' onClick={onCloseModal}>
              닫기
            </button>
            <button type='submit'>추가</button>
          </div>
        </form>
      </div>
    </div>
  );
}
