"use client";

import { getComment, getPostDetail } from "@/app/_api/board";
import { deleteBookmark, postBookmark } from "@/app/_api/bookmark";
import BoardView from "@/app/_components/BoardView";
import Comment from "@/app/_components/Comment";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

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
  projectId: number;
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
  const [boardData, setBoardData] = useState<BoardType | null>(null);
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
    {
      postCommentId: 2,
      content:
        "댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 댓글 내용입니다 ",
      member: { memberId: 2, memberName: "홍길동", profileImage: "" },
      profileSrc: "/img/profile_default.png",
      createDate: "2024-01-03 10:42:12",
      updateDate: "2024-01-03 10:42:12",
    },
  ]);

  const params = useParams<{
    projectId: string;
    boardId: string;
    id: string;
  }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPostDetail(
          `/team/${params.projectId}/${params.boardId}/${params.id}`
        );
        console.log("res : ", res);

        setBoardData(res.data);
      } catch (err) {
        console.log("err  : ", err);
      }
    };

    const fetchCommentData = async () => {
      try {
        const res = await getComment(
          `/team/${params.projectId}/${params.boardId}/${params.id}/`
        );
        console.log("res : ", res);

        setComments(res.data.postCommentResponseList);
      } catch (err) {
        console.log("err  : ", err);
      }
    };

    fetchData();
    fetchCommentData();
  }, [params]);

  // 북마크 토글
  const handleBookmark = useCallback(async (data: BoardType) => {
    if (!data.bookmark) {
      console.log("북마크 등록");
      try {
        const res = await postBookmark(`/my/bookmark/${data.postId}`);

        console.log("bookmark add : ", res);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("북마크 해제");
      try {
        const res = await deleteBookmark(`/my/bookmark/${data.postId}`);

        console.log("bookmark remove :", res);
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  return (
    <div>
      {boardData ? (
        <>
          <title>{boardData.title}</title>
          <BoardView
            projectId={params.projectId}
            boardData={boardData}
            comments={comments}
            setComments={setComments}
            handleBookmark={handleBookmark}
            type={"board"}
          />
        </>
      ) : null}
    </div>
  );
};

export default Page;
