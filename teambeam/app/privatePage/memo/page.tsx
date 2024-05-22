"use client";

import React, { useCallback, useState } from "react";
import "./page.scss";
import Link from "next/link";
import MemoWriteModal from "../_components/MemoWriteModal";

export type MemoType = {
  id: number;
  title: string;
  content: string;
  createAt: string;
};

const Page = () => {
  const [isModal, setIsModal] = useState<boolean>(false);
  const [memoList, setMemoList] = useState<MemoType[] | null>([
    {
      id: 0,
      title: "제목입니다 1",
      content: "메모내용 입니다",
      createAt: "2024-05-12 05:34:11",
    },
    {
      id: 1,
      title: "제목입니다 2",
      content: "메모내용 입니다",
      createAt: "2024-05-12 05:34:11",
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
              href={`/privatePage/memo/${memo.id}`}
              key={memo.id}
              className='memo-item'
            >
              <h3>{memo.title}</h3>
              <p>{memo.content}</p>
              <span>{memo.createAt}</span>
            </Link>
          );
        })}
      </div>

      {isModal ? <MemoWriteModal onCloseModal={onCloseModal} /> : null}
    </div>
  );
};

export default Page;
