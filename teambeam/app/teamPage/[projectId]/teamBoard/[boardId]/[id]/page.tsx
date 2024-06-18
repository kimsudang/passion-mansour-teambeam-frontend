"use client";

import { getComment, getPostDetail } from "@/app/_api/board";
import { deleteBookmark, postBookmark } from "@/app/_api/bookmark";
import BoardView from "@/app/_components/BoardView";
import Comment from "@/app/_components/Comment";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        setBoardData(res.data);
        setIsBookmark(res.data.bookmark);
      } catch (err) {
        console.log("err  : ", err);
        alert("게시글 조회에 실패했습니다.");
      }
    };

    const fetchCommentData = async () => {
      try {
        const res = await getComment(
          `/team/${params.projectId}/${params.boardId}/${params.id}/`
        );

        setComments(res.data.postCommentResponseList);
      } catch (err) {
        console.log("err  : ", err);
        alert("댓글 등록에 실패했습니다");
      }
    };

    fetchData();
    fetchCommentData();
  }, [params]);

  // 북마크 토글
  const handleBookmark = useCallback(
    async (data: BoardType) => {
      if (!isBookmark) {
        try {
          const res = await postBookmark(`/my/bookmark/${data.postId}`);

          if (res.status === 200) {
            setIsBookmark(!isBookmark);

            toast.success("북마크가 등록되었습니다!", {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const res = await deleteBookmark(
            `/my/bookmark/post?postId=${data.postId}`
          );

          if (res.status === 200) {
            setIsBookmark(!isBookmark);

            toast.success("북마크가 해제되었습니다!", {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    [isBookmark]
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

      <ToastContainer />
    </div>
  );
};

export default Page;
