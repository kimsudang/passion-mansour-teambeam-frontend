"use client";

import BoardView from "@/app/_components/BoardView";
import React, { useState } from "react";

type ContentType = {
  key: string;
  value: string;
};

export type BoardType = {
  postId: number;
  title: string;
  postType: string;
  content: ContentType[][] | string;
  member: {
    memberId: number;
    memberName: string;
    profileImage: string;
  };
  createDate: string;
  updateDate: string;
  postTags: { tagId: number; tagName: string }[];
  notice: boolean;
  bookmark: boolean;
};

export type CommentType = {
  postCommentId: number;
  content: string;
  member: {
    memberId: number;
    memberName: string;
    profileImage: string;
  };
  profileSrc: string;
  createDate: string;
  updateDate: string;
};

const Page = () => {
  const [boardData, setBoardData] = useState<BoardType>({
    postId: 0,
    title: "게시글 제목",
    postType: "table",
    content: [
      [
        { key: "0_0", value: "HTTP" },
        { key: "0_1", value: "기능" },
        { key: "0_2", value: "URL" },
      ],
      [
        { key: "1_0", value: "GET" },
        { key: "1_1", value: "로그인" },
        { key: "1_2", value: "/api/user/login" },
      ],
      [
        { key: "2_0", value: "POST" },
        { key: "2_1", value: "프로젝트 생성" },
        { key: "2_2", value: "/api/project" },
      ],
    ],
    member: { memberId: 2, memberName: "홍길동", profileImage: "" },
    createDate: "2024-04-23 09:51:13",
    updateDate: "2024-04-23 09:51:13",
    postTags: [
      { tagId: 21, tagName: "react" },
      { tagId: 52, tagName: "개발" },
      { tagId: 56, tagName: "기획" },
    ],
    notice: false,
    bookmark: true,
  });
  const [comments, setComments] = useState<CommentType[]>([
    {
      postCommentId: 0,
      content:
        "댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 ",
      member: { memberId: 2, memberName: "홍길동", profileImage: "" },
      profileSrc: "/img/profile_default.png",
      createDate: "2024-01-03 10:42:12",
      updateDate: "2024-01-03 10:42:12",
    },
    {
      postCommentId: 1,
      content:
        "댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 ",
      member: { memberId: 2, memberName: "홍길동", profileImage: "" },
      profileSrc: "/img/profile_default.png",
      createDate: "2024-01-03 10:42:12",
      updateDate: "2024-01-03 10:42:12",
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
