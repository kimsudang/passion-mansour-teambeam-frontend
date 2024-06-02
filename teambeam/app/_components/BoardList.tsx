"use client";

import Link from "next/link";
import { Board, BookmarkType } from "../privatePage/bookmark/page";
import { BookmarkIcon, BookmarkLineIcon } from "./Icons";
import "@/app/_styles/Board.scss";

export default function BoardList({
  projectId,
  boardId,
  board,
  bookmark,
  handleBookmark,
  type,
}: {
  projectId: string;
  boardId: string;
  board: Board | null;
  bookmark: BookmarkType | null;
  handleBookmark: (e: React.MouseEvent<HTMLButtonElement>, data: any) => void;
  type: string;
}) {
  if (type === "bookmark") {
    return (
      <Link
        href={`/privatePage/bookmark/${bookmark?.bookmarkId}`}
        className={`board-item ${bookmark?.post.notice ? "noticePost" : ""}`}
        passHref
      >
        <div className='board-left'>
          {bookmark?.post.postTags.length !== 0 || bookmark?.post.notice ? (
            <div className='tags'>
              {bookmark?.post.notice ? (
                <span className='tag notice'>공지</span>
              ) : null}
              {bookmark?.post.postTags.map((tag) => {
                return (
                  <span key={tag.tagId} className='tag'>
                    {tag.tagName}
                  </span>
                );
              })}
            </div>
          ) : null}
          <h3>{bookmark?.post.title}</h3>
          {bookmark?.post.postType === "text" ? (
            <p>{bookmark?.post.content.replace(/<\/?[^>]+(>|$)/g, "")}</p>
          ) : null}

          <div className='board-info'>
            <span>{bookmark?.post.member.memberName}</span>
            <b>ㆍ</b>
            <span>{bookmark?.post.createDate}</span>
          </div>
        </div>
        <div className='board-right'>
          <button
            type='button'
            className={`bookmarkBtn ${bookmark?.post.bookmark ? "active" : ""}`}
            onClick={(e) => handleBookmark(e, bookmark)}
          >
            {bookmark?.post.bookmark ? (
              <BookmarkIcon size={15} />
            ) : (
              <BookmarkLineIcon size={15} />
            )}
          </button>
        </div>
      </Link>
    );
  } else {
    return (
      <Link
        href={`/teamPage/${projectId}/teamBoard/${boardId}/${board?.postId}`}
        className={`board-item ${board?.notice ? "noticePost" : ""}`}
        passHref
      >
        <div className='board-left'>
          {board?.postTags.length !== 0 || board?.notice ? (
            <div className='tags'>
              {board?.notice === true && (
                <span className='tag notice'>공지</span>
              )}
              {board?.postTags.map((tag) => {
                return (
                  <span key={tag.tagId} className='tag'>
                    {tag.tagName}
                  </span>
                );
              })}
            </div>
          ) : null}
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
          <button
            type='button'
            className={`bookmarkBtn ${board?.bookmark ? "active" : ""}`}
            onClick={(e) => handleBookmark(e, board)}
          >
            {board?.bookmark ? (
              <BookmarkIcon size={15} />
            ) : (
              <BookmarkLineIcon size={15} />
            )}
          </button>
        </div>
      </Link>
    );
  }
}
