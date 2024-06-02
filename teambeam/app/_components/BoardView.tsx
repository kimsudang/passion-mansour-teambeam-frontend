"use client";

import React, { useCallback, useState } from "react";
import {
  BackBtnIcon,
  BookmarkIcon,
  BookmarkLineIcon,
  DeleteBtnIcon,
  EditBtnIcon,
} from "./Icons";
import { useParams, useRouter } from "next/navigation";
import "@/app/_styles/Board.scss";
import Comment from "./Comment";
import { BoardType, CommentType } from "../privatePage/bookmark/[id]/page";
import { deletePost, postComment } from "../_api/board";

export default function BoardView({
  projectId,
  boardData,
  comments,
  setComments,
  handleBookmark,
  type,
}: {
  projectId: string;
  boardData: BoardType;
  comments: CommentType[];
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
  handleBookmark: (data: any) => void;
  type: string;
}) {
  const [commentContent, setCommentContent] = useState<string>("");

  const router = useRouter();
  const params = useParams<{
    projectId: string;
    boardId: string;
    id: string;
  }>();
  const memberId = localStorage.getItem("MemberId");

  const handleComment = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCommentContent(e.target.value);
    },
    []
  );

  // 게시글 수정
  const handlePostUpdate = useCallback(() => {
    if (type === "bookmark") {
      router.push(`/privatePage/bookmark/edit/${boardData.postId}`);
    } else {
      router.push(
        `/teamPage/${projectId}/teamBoard/${params.boardId}/${boardData.postId}/edit`
      );
    }
  }, [router, params, projectId, boardData, type]);

  // 게시글 삭제
  const handlePostDelete = useCallback(async () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        const res = await deletePost(
          `/team/${projectId}/${params.boardId}/${boardData.postId}`
        );

        console.log(res);

        alert("게시글이 삭제되었습니다.");
        if (type === "bookmark") router.push("/privatePage/bookmark");
        else router.push(`/teamPage/${projectId}/teamBoard/${params.boardId}`);
      } catch (err) {
        console.log(err);
      }
    } else {
      return;
    }
  }, [router, params, projectId, boardData, type]);

  const onSubmit = useCallback(async () => {
    try {
      const data = {
        content: commentContent,
      };

      const res = await postComment(
        `/team/${params.projectId}/${params.boardId}/${params.id}/`,
        data
      );

      console.log("comment : ", res);
      setComments((prev) => [...prev, res.data]);
    } catch (err) {
      console.log(err);
    }
  }, [commentContent, params]);

  return (
    <>
      <div className='top-board-view'>
        <button className='back-btn' onClick={() => router.back()}>
          <BackBtnIcon size={13} />
        </button>

        <h2>{boardData.title}</h2>
      </div>
      <div className='view-info-wrap'>
        <div className='view-info'>
          <span>{boardData.member.memberName}</span>
          <b>ㆍ</b>
          <span>{boardData.createDate}</span>
        </div>

        <button
          type='button'
          className={`bookmark-btn ${boardData.bookmark ? "active" : ""}`}
          onClick={() => handleBookmark(boardData)}
        >
          {boardData.bookmark ? (
            <BookmarkIcon size={15} />
          ) : (
            <BookmarkLineIcon size={15} />
          )}
        </button>
      </div>
      <div className='view-tags'>
        {boardData.postTags.map((tag) => {
          return (
            <span key={tag.tagId} className='tag'>
              {tag.tagName}
            </span>
          );
        })}
      </div>

      <div className='board-view-content'>
        {boardData.postType === "text" ? (
          typeof boardData.content === "string" ? (
            <div
              dangerouslySetInnerHTML={{ __html: boardData.content as string }}
            />
          ) : null
        ) : null}

        {boardData.postType === "table" && Array.isArray(boardData.content) ? (
          <table className='viewTable'>
            <thead>
              <tr>
                {boardData.content[0].map((cell) => (
                  <th key={cell.key}>{cell.value}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {boardData.content.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell) => (
                    <td key={cell.key}>{cell.value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}

        {memberId === String(boardData.member.memberId) && (
          <div className='editButtons'>
            <button
              type='button'
              className='deleteBtn'
              onClick={handlePostDelete}
            >
              <DeleteBtnIcon size={13} />
            </button>
            <button
              type='button'
              className='editBtn'
              onClick={handlePostUpdate}
            >
              <EditBtnIcon size={14} />
            </button>
          </div>
        )}
      </div>
      <div className='comment-wrap'>
        <p className='comment-info'>
          댓글 <span>{comments.length}</span>
        </p>
        <div className='comment-input-wrap'>
          <form action={onSubmit}>
            <textarea
              value={commentContent}
              onChange={handleComment}
              placeholder='댓글을 입력하세요'
            ></textarea>
            <button type='submit'>등록</button>
          </form>
        </div>
        {comments?.map((comment) => {
          return <Comment key={comment.postCommentId} comment={comment} />;
        })}
      </div>
    </>
  );
}
