"use client";

import BoardList from "@/app/_components/BoardList";
import React, { useState } from "react";

export type Board = {
  postId: number;
  postTitle: string;
  postType: string;
  postContent: string;
  writer: string;
  tags: { tagId: number; tagName: string }[];
  createDate: string;
  updateDate: string;
  notice: boolean;
  bookmark: boolean;
};

const Page = () => {
  const [boards, setBoards] = useState<Board[]>([
    {
      postId: 1,
      postTitle: "게시글 1",
      postType: "board",
      postContent: "게시글 1입니다.",
      createDate: "2024-04-12 09:51:13",
      updateDate: "2024-04-12 09:51:13",
      writer: "홍길동",
      tags: [
        { tagId: 21, tagName: "react" },
        { tagId: 52, tagName: "개발" },
        { tagId: 56, tagName: "기획" },
      ],
      notice: false,
      bookmark: true,
    },
    {
      postId: 3,
      postTitle: "게시글 1",
      postType: "board",
      postContent: "게시글 1입니다.",
      createDate: "2024-04-12 09:51:13",
      updateDate: "2024-04-12 09:51:13",
      writer: "홍길동",
      tags: [{ tagId: 11, tagName: "vue" }],
      notice: false,
      bookmark: true,
    },
  ]);
  return (
    <div>
      <title>북마크</title>
      <h1 style={{ marginBottom: "24px" }}>북마크</h1>

      {boards.map((board: Board) => {
        return <BoardList key={board.postId} board={board} type={"bookmark"} />;
      })}
    </div>
  );
};

export default Page;
