"use client";

import { getComment, getPostDetail } from "@/app/_api/board";
import { deleteBookmark, postBookmark } from "@/app/_api/bookmark";
import BoardView from "@/app/_components/BoardView";
import Comment from "@/app/_components/Comment";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export type BoardType = {
  postId: number;
  title: string;
  postType: string;
  content: string;
  member: {
    memberId: number;
    memberName: string;
    profileImage: string;
  };
  projectId: number;
  boardId: number;
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
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isBookmark, setIsBookmark] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("Authorization");
      setToken(storedToken);
    }
  }, []);
  const params = useParams<{
    projectId: string;
    boardId: string;
    id: string;
  }>();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const res = await getPostDetail(
          `/team/${params.projectId}/${params.boardId}/${params.id}`,
          token
        );
        console.log("res : ", res);

        setBoardData(res.data);
        setIsBookmark(res.data.bookmark);
      } catch (err) {
        console.log("err  : ", err);
      }
    };

    const fetchCommentData = async () => {
      if (!token) return;

      try {
        const res = await getComment(
          `/team/${params.projectId}/${params.boardId}/${params.id}/`,
          token
        );

        setComments(res.data.postCommentResponseList);
      } catch (err) {
        console.log("err  : ", err);
        alert("댓글 등록에 실패했습니다");
      }
    };

    fetchData();
    fetchCommentData();
  }, [params, token]);

  // 북마크 토글
  const handleBookmark = useCallback(
    async (data: BoardType) => {
      if (!token) return;

      if (!isBookmark) {
        console.log("북마크 등록");
        try {
          const res = await postBookmark(`/my/bookmark/${data.postId}`, token);

          console.log("bookmark add : ", res);
          setIsBookmark(!isBookmark);
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log("북마크 해제");
        try {
          const res = await deleteBookmark(
            `/my/bookmark/post?postId=${data.postId}`,
            token
          );
          // const res = await deleteBookmark(`/my/bookmark/${data.postId}`);

          console.log("bookmark remove :", res);
          setIsBookmark(!isBookmark);
        } catch (err) {
          console.log(err);
        }
      }
    },
    [isBookmark, token]
  );

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
            isBookmark={isBookmark}
          />
        </>
      ) : null}
    </div>
  );
};

export default Page;
