"use client";

import React, { useCallback, useState } from "react";
import { BackBtnIcon, BookmarkIcon } from "./Icons";
import {
  useParams,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import "@/app/_styles/Board.scss";
import Comment from "./Comment";
import { BoardType, CommentType } from "../privatePage/bookmark/[id]/page";
import { deletePost, postComment } from "../_api/board";

export default function BoardView({
  projectId,
  boardData,
  comments,
  setComments,
}: {
  projectId: string;
  boardData: BoardType;
  comments: CommentType[];
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
}) {
  const [commentContent, setCommentContent] = useState<string>("");

  const router = useRouter();
  const segment = useSelectedLayoutSegment();
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
    if (segment === "bookmark")
      router.push(`/privatePage/bookmark/edit/${boardData.postId}`);
    else
      router.push(
        `/teamPage/${projectId}/teamBoard/${params.boardId}/${boardData.postId}/edit`
      );
  }, [router, params, segment, projectId, boardData]);

  // 게시글 삭제
  const handlePostDelete = useCallback(async () => {
    try {
      const res = await deletePost(
        `/team/${projectId}/${params.boardId}/${boardData.postId}`
      );

      console.log(res);

      alert("게시글이 삭제되었습니다.");
      if (segment === "bookmark") router.push("/privatePage/bookmark");
      else router.push(`/teamPage/${projectId}/teamBoard/${params.boardId}`);
    } catch (err) {
      console.log(err);
    }
  }, [router, params, segment, projectId, boardData]);

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

        {memberId === String(boardData.member.memberId) && (
          <div className='editButtons'>
            <button type='button' onClick={handlePostUpdate}>
              수정
            </button>
            <button type='button' onClick={handlePostDelete}>
              삭제
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
