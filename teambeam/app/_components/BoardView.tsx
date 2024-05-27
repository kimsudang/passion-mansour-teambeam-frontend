"use client";

import React from "react";
import { BackBtnIcon, BookmarkIcon } from "./Icons";
import { useRouter } from "next/navigation";
import "@/app/_styles/Board.scss";
import Comment from "./Comment";
import { BoardType, CommentType } from "../privatePage/bookmark/[id]/page";

export default function BoardView({
  boardData,
  comments,
}: {
  boardData: BoardType;
  comments: CommentType[];
}) {
  const router = useRouter();

  return (
    <>
      <div className='top-board-view'>
        <button className='back-btn' onClick={() => router.back()}>
          <BackBtnIcon size={13} />
        </button>

        <h2>{boardData.postTitle}</h2>
      </div>
      <div className='view-info-wrap'>
        <div className='view-info'>
          <span>{boardData.writer.memberName}</span>
          <b>ㆍ</b>
          <span>{boardData.createDate}</span>
        </div>

        <button className='bookmark-btn'>
          <BookmarkIcon size={15} />
        </button>
      </div>
      <div className='view-tags'>
        {boardData.tags.map((tag) => {
          return (
            <span key={tag.tagId} className='tag'>
              {tag.tagName}
            </span>
          );
        })}
      </div>

      <div className='board-view-content'>
        {boardData.postType === "board" ? (
          typeof boardData.postContent === "string" ? (
            <>{boardData.postContent}</>
          ) : null
        ) : null}

        {boardData.postType === "table" &&
        Array.isArray(boardData.postContent) ? (
          <table className='viewTable'>
            <thead>
              <tr>
                {boardData.postContent[0].map((cell) => (
                  <th key={cell.key}>{cell.value}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {boardData.postContent.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell) => (
                    <td key={cell.key}>{cell.value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
      <div className='comment-wrap'>
        <p className='comment-info'>
          댓글 <span>{comments.length}</span>
        </p>
        <div className='comment-input-wrap'>
          <textarea placeholder='댓글을 입력하세요'></textarea>
          <button>등록</button>
        </div>
        {comments?.map((comment) => {
          return <Comment key={comment.postCommentId} comment={comment} />;
        })}
      </div>
    </>
  );
}
