"use client";

import Link from "next/link";
import { Board } from "../privatePage/bookmark/page";
import { BookmarkIcon } from "./Icons";
import "@/app/_styles/Board.scss";

export default function BoardList({
  board,
  type,
}: {
  board: Board;
  type: string;
}) {
  return (
    <Link
      href={
        type === "bookmark"
          ? `/privatePage/bookmark/${board.postId}`
          : `/teamPage/teamBoard/${board.postId}`
      }
      className='board-item'
    >
      <div className='board-left'>
        <div className='tags'>
          {board.tags.map((tag) => {
            return (
              <span key={tag.tagId} className='tag'>
                {tag.tagName}
              </span>
            );
          })}
        </div>
        <h3>{board.postTitle}</h3>
        <p>{board.postContent}</p>
        <div className='board-info'>
          <span>{board.writer}</span>
          <b>ㆍ</b>
          <span>{board.createDate}</span>
        </div>
      </div>
      <div className='board-right'>
        <BookmarkIcon size={15} />
      </div>
    </Link>
  );
}
