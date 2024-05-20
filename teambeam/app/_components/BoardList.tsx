"use client";

import Link from "next/link";
import { Board } from "../privatePage/bookmark/page";
import { BookmarkIcon } from "./Icons";
import "./Board.scss";

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
          ? `/privatePage/bookmark/${board.id}`
          : `/teamPage/teamBoard/${board.id}`
      }
      className='board-item'
    >
      <div className='board-left'>
        <div className='tags'>
          {board.tags.map((tag: string, idx: number) => {
            return (
              <span key={idx} className='tag'>
                {tag}
              </span>
            );
          })}
        </div>
        <h3>{board.title}</h3>
        <p>{board.description}</p>
        <div className='board-info'>
          <span>{board.writer}</span>
          <b>ㆍ</b>
          <span>{board.createAt}</span>
        </div>
      </div>
      <div className='board-right'>
        <BookmarkIcon size={15} />
      </div>
    </Link>
  );
}
