"use client";

import Link from "next/link";
import { Board } from "../privatePage/bookmark/page";
import { BookmarkIcon } from "./Icons";
import "@/app/_styles/Board.scss";

export default function BoardList({
  projectId,
  board,
  type,
}: {
  projectId: string;
  board: Board;
  type: string;
}) {
  return (
    <Link
      href={
        type === "bookmark"
          ? `/privatePage/bookmark/${board.postId}`
          : `/teamPage/${projectId}/teamBoard/${board.postId}`
      }
      className='board-item'
    >
      <div className='board-left'>
        {board.postTags.length !== 0 && (
          <div className='tags'>
            {board.postTags.map((tag) => {
              return (
                <span key={tag.tagId} className='tag'>
                  {tag.tagName}
                </span>
              );
            })}
          </div>
        )}
        <h3>{board.title}</h3>
        {board.postType === "text" ? (
          <p>{board.content.replace(/<\/?[^>]+(>|$)/g, "")}</p>
        ) : null}

        <div className='board-info'>
          <span>{board.member.memberName}</span>
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
