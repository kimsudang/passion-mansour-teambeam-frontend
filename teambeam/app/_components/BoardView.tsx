"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import {
  deleteComment,
  deletePost,
  getComment,
  postComment,
} from "../_api/board";
import { getBookmarkList } from "../_api/bookmark";

export default function BoardView({
  projectId,
  boardData,
  comments,
  setComments,
  handleBookmark,
  type,
  isBookmark,
}: {
  projectId: string;
  boardData: BoardType;
  comments: CommentType[];
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
  handleBookmark: (data: any) => void;
  type: string;
  isBookmark: boolean;
}) {
  const [commentContent, setCommentContent] = useState<string>("");
  const [editCommentId, setEditCommentId] = useState<number | null>(null);

  const router = useRouter();
  const params = useParams<{
    projectId: string;
    boardId: string;
    id: string;
  }>();
  const memberId = localStorage.getItem("MemberId");

  // contnet 파싱
  let parseData;
  if (boardData.postType === "table") {
    parseData = JSON.parse(boardData.content);
  }

  const handleComment = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCommentContent(e.target.value);
    },
    []
  );

  // 게시글 수정
  const handlePostUpdate = useCallback(() => {
    if (type === "bookmark") {
      router.push(
        `/teamPage/${boardData.projectId}/teamBoard/${boardData.boardId}/${boardData.postId}/edit`
      );
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
        alert("게시글이 삭제되었습니다.");
        if (type === "bookmark") {
          router.push(
            `/teamPage/${boardData.projectId}/teamBoard/${boardData.boardId}/${boardData.postId}`
          );
        } else {
          router.push(`/teamPage/${projectId}/teamBoard/${params.boardId}`);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      return;
    }
  }, [router, params, projectId, boardData, type]);

  // 코멘트 작성
  const onSubmit = useCallback(async () => {
    const data = {
      content: commentContent,
    };

    if (type === "bookmark") {
      try {
        const res = await getBookmarkList(`/my/bookmark/${params.id}`);
        try {
          const _res = await postComment(
            `/team/${res.data.projectId}/${res.data.boardId}/${res.data.postId}/`,
            data
          );
          setCommentContent("");
          setComments((prev) => [...prev, _res.data]);
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await postComment(
          `/team/${params.projectId}/${params.boardId}/${params.id}/`,
          data
        );
        setCommentContent("");
        setComments((prev) => [...prev, res.data]);
      } catch (err) {
        console.log(err);
      }
    }
  }, [commentContent, type, setComments, params]);

  // 코멘트 수정
  const handleCommentIsToggle = useCallback((commentId: number | null) => {
    setEditCommentId(commentId);
  }, []);

  // 코멘트 삭제
  const handleCommentDelete = useCallback(
    async (commentId: number) => {
      if (confirm("해당 댓글을 삭제하시겠습니까?")) {
        if (type === "bookmark") {
          try {
            const res = await getBookmarkList(`/my/bookmark/${params.id}`);

            try {
              const _res = await deleteComment(
                `/team/${res.data.projectId}/${res.data.boardId}/${res.data.postId}/${commentId}`
              );

              if (_res.status === 200) {
                try {
                  const response = await getComment(
                    `/team/${res.data.projectId}/${res.data.boardId}/${res.data.postId}/`
                  );

                  alert("댓글이 삭제되었습니다.");
                  setComments(response.data.postCommentResponseList);
                } catch (err) {
                  console.log(err);
                }
              }
            } catch (err) {
              console.log(err);
              alert("댓글 삭제에 문제가 발생했습니다");
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          try {
            const res = await deleteComment(
              `/team/${params.projectId}/${params.boardId}/${params.id}/${commentId}`
            );

            if (res.status === 200) {
              try {
                const _res = await getComment(
                  `/team/${params.projectId}/${params.boardId}/${params.id}/`
                );

                alert("댓글이 삭제되었습니다.");
                setComments(_res.data.postCommentResponseList);
              } catch (err) {
                console.log(err);
              }
            }
          } catch (err) {
            console.log(err);
            alert("댓글 삭제에 문제가 발생했습니다");
          }
        }
      } else {
        return;
      }
    },
    [params, type, setComments]
  );

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
          className={`bookmarkBtn ${isBookmark ? "active" : ""}`}
          onClick={() => handleBookmark(boardData)}
        >
          {isBookmark ? (
            <BookmarkIcon size={15} />
          ) : (
            <BookmarkLineIcon size={15} />
          )}
        </button>
      </div>
      <div className='view-tags'>
        {boardData.notice ? <span className='tag notice'>공지</span> : null}
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

        {boardData.postType === "table" && Array.isArray(parseData) ? (
          <table className='viewTable'>
            <thead>
              <tr>
                {parseData[0].map((cell: { key: number; value: string }) => (
                  <th key={cell.key}>{cell.value}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parseData.slice(1).map((row: any, rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell: { key: number; value: string }) => (
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
          return (
            <Comment
              key={comment.postCommentId}
              isEditComment={editCommentId === comment.postCommentId}
              comment={comment}
              setComments={setComments}
              type={type}
              params={params}
              handleCommentIsToggle={() =>
                handleCommentIsToggle(
                  editCommentId === comment.postCommentId
                    ? null
                    : comment.postCommentId
                )
              }
              handleCommentDelete={handleCommentDelete}
            />
          );
        })}
      </div>
    </>
  );
}
