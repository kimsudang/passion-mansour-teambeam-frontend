"use client";

import { BackBtnIcon, BookmarkIcon } from "./Icons";
import { useRouter } from "next/navigation";
import "./Board.scss";
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

        <h2>{boardData.title}</h2>
      </div>
      <div className='view-info-wrap'>
        <div className='view-info'>
          <span>{boardData.writer}</span>
          <b>ㆍ</b>
          <span>{boardData.createAt}</span>
        </div>

        <button className='bookmark-btn'>
          <BookmarkIcon size={15} />
        </button>
      </div>
      <div className='view-tags'>
        {boardData.tags.map((tag, idx) => {
          return (
            <span key={idx} className='tag'>
              {tag}
            </span>
          );
        })}
      </div>

      <p className='board-view-content'>{boardData.content}</p>

      <div className='comment-wrap'>
        <p className='comment-info'>
          댓글 <span>{comments.length}</span>
        </p>
        <div className='comment-input-wrap'>
          <textarea placeholder='댓글을 입력하세요'></textarea>
          <button>등록</button>
        </div>
        {comments?.map((comment) => {
          return <Comment key={comment.id} comment={comment} />;
        })}
      </div>
    </>
  );
}
