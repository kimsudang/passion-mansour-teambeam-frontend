"use client";

import BoardList from "@/app/_components/BoardList";
import React, { useState } from "react";

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
      id: 3,
      title: "게시글 1",
      description: "게시글 1입니다.",
      writer: "홍길동",
      tags: ["react", "개발", "기획"],
      createAt: "2024-04-12 09:51:13",
      notice: false,
      bookmark: true,
    },
  ]);
  return (
    <div>
      <title>북마크</title>
      <h1>북마크</h1>

      {boards.map((board: Board) => {
        return <BoardList key={board.id} board={board} type={"bookmark"} />;
      })}
    </div>
  );
};

export default Page;
