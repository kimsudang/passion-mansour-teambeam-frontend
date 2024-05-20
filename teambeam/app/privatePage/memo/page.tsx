"use client";

import React, { useState } from "react";
import "./page.scss";
import Link from "next/link";

export type Memo = {
  id: number;
  title: string;
  content: string;
  createAt: string;
};

const Page = () => {
  const [memoList, setMemoList] = useState<Memo[] | null>([
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
  return (
    <div>
      <title>메모</title>
      <div className='top-box'>
        <h1>메모</h1>
        <button type='button' className='memo-add-btn'>
          메모추가
        </button>
      </div>

      <div className='memo-wrap'>
        {memoList?.map((memo) => {
          return (
            <Link href='/' key={memo.id} className='memo-item'>
              <h3>{memo.title}</h3>
              <p>{memo.content}</p>
              <span>{memo.createAt}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
