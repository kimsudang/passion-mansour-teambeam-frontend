"use client";

import React, { useCallback, useState } from "react";
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
  const [commentContent, setCommentContent] = useState<string>("");
  const router = useRouter();

  const handleComment = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCommentContent(e.target.value);
    },
    []
  );

  const onSubmit = useCallback(() => {
    const data = {
      content: commentContent,
    };

    console.log("commentContent : ", data);
  }, [commentContent]);

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

        <button className='bookmark-btn'>
          <BookmarkIcon size={15} />
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
