"use client";

import React, { useCallback, useEffect, useState } from "react";
import "./page.scss";
import Link from "next/link";
import MemoWriteModal from "../_components/MemoWriteModal";
import { getMemoList } from "@/app/_api/memo";

export type MemoType = {
  memoId: number;
  memoTitle: string;
  memoContent: string;
  createDate: string;
  updateDate: string;
};

const Page = () => {
  const [isModal, setIsModal] = useState<boolean>(false);
  const [memoList, setMemoList] = useState<MemoType[] | null>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMemoList("/my/memo/");
        console.log("res : ", res);

        setMemoList(res.data.memoResponses);
      } catch (err) {
        console.log("err  : ", err);
      }
    };

    fetchData();
  }, []);

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
        <button type='button' className='memoAddBtn' onClick={onOpenModal}>
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

        {memoList?.length === 0 ? (
          <span className='noMemoList'>작성된 메모가 없습니다.</span>
        ) : null}
      </div>

      {isModal ? <MemoWriteModal onCloseModal={onCloseModal} /> : null}
    </div>
  );
};

export default Page;
