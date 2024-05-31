"use client";

import Link from "next/link";
import { Board, BookmarkType } from "../privatePage/bookmark/page";
import { BookmarkIcon } from "./Icons";
import "@/app/_styles/Board.scss";

export default function BoardList({
  projectId,
  boardId,
  board,
  bookmark,
  type,
}: {
  projectId: string;
  boardId: string;
  board: Board | null;
  bookmark: BookmarkType | null;
  type: string;
}) {
  if (type === "bookmark") {
    return (
      <Link
        href={`/privatePage/bookmark/${bookmark?.bookmarkId}`}
        className='board-item'
      >
        <div className='board-left'>
          {bookmark?.post.postTags.length !== 0 && (
            <div className='tags'>
              {bookmark?.post.postTags.map((tag) => {
                return (
                  <span key={tag.tagId} className='tag'>
                    {tag.tagName}
                  </span>
                );
              })}
            </div>
          )}
          <h3>{bookmark?.post.title}</h3>
          {bookmark?.post.postType === "text" ? (
            <p>{bookmark?.post.content.replace(/<\/?[^>]+(>|$)/g, "")}</p>
          ) : null}

          <div className='board-info'>
            <span>{bookmark?.member.memberName}</span>
            <b>ㆍ</b>
            <span>{bookmark?.post.createDate}</span>
          </div>
        </div>
        <div className='board-right'>
          <BookmarkIcon size={15} />
        </div>
      </Link>
    );
  } else {
    return (
      <Link
        href={`/teamPage/${projectId}/teamBoard/${boardId}/${board?.postId}`}
        className='board-item'
      >
        <div className='board-left'>
          {board?.postTags.length !== 0 && (
            <div className='tags'>
              {board?.postTags.map((tag) => {
                return (
                  <span key={tag.tagId} className='tag'>
                    {tag.tagName}
                  </span>
                );
              })}
            </div>
          )}
          <h3>{board?.title}</h3>
          {board?.postType === "text" ? (
            <p>{board.content.replace(/<\/?[^>]+(>|$)/g, "")}</p>
          ) : null}

          <div className='board-info'>
            <span>{board?.member.memberName}</span>
            <b>ㆍ</b>
            <span>{board?.createDate}</span>
          </div>
        </div>
        <div className='board-right'>
          <BookmarkIcon size={15} />
        </div>
      </Link>
    );
  }
}
