"use client";

import BoardList from "@/app/_components/BoardList";
import { ToggleUpBtnIcon } from "@/app/_components/Icons";
import React, { useState } from "react";
import "./TeamBoard.scss";

export type Board = {
  id: number;
  title: string;
  description: string;
  writer: string;
  tags: string[];
  createAt: string;
  notice: boolean;
  bookmark: boolean;
};

const Page = () => {
  const [boards, setBoards] = useState<Board[]>([
    {
      id: 1,
      title: "게시글 1",
      description: "게시글 1입니다.",
      writer: "홍길동",
      tags: ["react", "개발", "기획"],
      createAt: "2024-04-12 09:51:13",
      notice: false,
      bookmark: true,
    },
    {
      id: 2,
      title: "게시글 2",
      description: "게시글 2입니다.",
      writer: "홍길동",
      tags: ["vue"],
      createAt: "2024-04-12 09:51:13",
      notice: false,
      bookmark: true,
    },
  ]);
  const [tags, setTags] = useState<string[]>(["react", "vue", "개발"]);
  return (
    <div>
      <title>게시판</title>
      <div className='top-box'>
        <h1>게시판</h1>
        <button className='write-add-btn'>글쓰기</button>
      </div>

      <div className='tag-wrap'>
        <div className='tag-info-top'>
          <ToggleUpBtnIcon size={15} /> <span>태그선택</span>
        </div>
        <div className='tags'>
          <span className='tag active'>ALL</span>
          {tags?.map((tag, idx) => {
            return (
              <span key={idx} className='tag'>
                {tag}
              </span>
            );
          })}
        </div>
      </div>

      {boards.map((board: Board) => {
        return <BoardList key={board.id} board={board} type={"board"} />;
      })}
    </div>
  );
};

export default Page;
