"use client";

import React, { useCallback, useState } from "react";
import "./page.scss";
import Link from "next/link";
import MemoWriteModal from "../_components/MemoWriteModal";

export type MemoType = {
  memoId: number;
  memoTitle: string;
  memoContent: string;
  createDate: string;
  updateDate: string;
};

const Page = () => {
  const [isModal, setIsModal] = useState<boolean>(false);
  const [memoList, setMemoList] = useState<MemoType[] | null>([
    {
      memoId: 0,
      memoTitle: "제목입니다 1",
      memoContent: "메모내용 입니다",
      createDate: "2024-05-12 05:34:11",
      updateDate: "2024-05-12 05:34:11",
    },
    {
      memoId: 1,
      memoTitle: "제목입니다 2",
      memoContent: "메모내용 입니다",
      createDate: "2024-05-12 05:34:11",
      updateDate: "2024-05-12 05:34:11",
    },
  ]);

  const onOpenModal = useCallback(() => {
    setIsModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsModal(false);
  }, []);

  return (
    <div>
      <title>메모</title>
      <div className='top-box'>
        <h1>메모</h1>
        <button type='button' className='memo-add-btn' onClick={onOpenModal}>
          메모추가
        </button>
      </div>

      <div className='memo-wrap'>
        {memoList?.map((memo) => {
          return (
            <Link
              href={`/privatePage/memo/${memo.memoId}`}
              key={memo.memoId}
              className='memo-item'
            >
              <h3>{memo.memoTitle}</h3>
              <p>{memo.memoContent}</p>
              <span>{memo.createDate}</span>
            </Link>
          );
        })}
      </div>

      {isModal ? <MemoWriteModal onCloseModal={onCloseModal} /> : null}
    </div>
  );
};

export default Page;
