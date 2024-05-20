"use client";

import BoardView from "@/app/_components/BoardView";
import Comment from "@/app/_components/Comment";
import React, { useState } from "react";

export type BoardType = {
  id: number;
  title: string;
  content: string;
  writer: string;
  createAt: string;
  tags: string[];
  notice: boolean;
  bookmark: boolean;
};

export type CommentType = {
  id: number;
  content: string;
  writer: string;
  profileSrc: string;
  createAt: string;
};

const Page = () => {
  const [boardData, setBoardData] = useState<BoardType>({
    id: 0,
    title: "게시글 제목",
    content:
      "게시글 내용입니다 게시글 내용입니다 게시글 내용입니다 게시글 내용입니다 게시글 내용입니다 게시글 내용입니다 게시글 내용입니다 게시글 내용입니다 게시글 내용입니다 게시글 내용입니다  게시글 내용입니다",
    writer: "홍길동",
    createAt: "2024-04-23 09:51:13",
    tags: ["react", "개발"],
    notice: false,
    bookmark: true,
  });
  const [comments, setComments] = useState<CommentType[]>([
    {
      id: 0,
      content:
        "댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 ",
      writer: "홍길동",
      profileSrc: "/img/profile_default.png",
      createAt: "2024-01-03 10:42:12",
    },
    {
      id: 1,
      content:
        "댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 ",
      writer: "홍길동",
      profileSrc: "/img/profile_default.png",
      createAt: "2024-01-03 10:42:12",
    },
    {
      id: 2,
      content:
        "댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 ",
      writer: "홍길동",
      profileSrc: "/img/profile_default.png",
      createAt: "2024-01-03 10:42:12",
    },
  ]);

  return (
    <div>
      <title>{boardData.title}</title>
      <BoardView boardData={boardData} comments={comments} />
    </div>
  );
};

export default Page;
