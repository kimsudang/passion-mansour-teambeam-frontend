"use client";

import Image from "next/image";
import { CommentType } from "../privatePage/bookmark/[id]/page";
import "@/app/_styles/Comment.scss";
import { useCallback, useEffect, useState } from "react";
import { editComment, getComment } from "../_api/board";
import { getBookmarkList } from "../_api/bookmark";

export default function Comment({
  isEditComment,
  comment,
  setComments,
  type,
  params,
  handleCommentIsToggle,
  handleCommentDelete,
}: {
  isEditComment: boolean;
  comment: CommentType;
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
  type: string;
  params: { projectId: string; boardId: string; id: string };
  handleCommentIsToggle: () => void;
  handleCommentDelete: (commentId: number) => void;
}) {
  const [content, setContent] = useState<string>(comment.content);
  const [memberId, setMemberId] = useState<string | null>(null);

  const dataURI = `data:image/jpeg;base64,${comment.member.profileImage}`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMemberId = localStorage.getItem("MemberId");
      setMemberId(storedMemberId);
    }
  }, []);

  const handleContent = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    []
  );

  // 댓글 수정
  const onSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();

      if (type === "bookmark") {
        try {
          const res = await getBookmarkList(`/my/bookmark/${params.id}`);

          try {
            const _res = await editComment(
              `/team/${res.data.projectId}/${res.data.boardId}/${res.data.postId}/${comment.postCommentId}`,
              content
            );

            if (_res.status === 200) {
              try {
                const response = await getComment(
                  `/team/${res.data.projectId}/${res.data.boardId}/${res.data.postId}/`
                );
                alert("댓글이 수정되었습니다.");
                setComments(response.data.postCommentResponseList);

                handleCommentIsToggle();
              } catch (err) {
                console.log(err);
              }
            }
          } catch (err) {
            console.log(err);
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const res = await editComment(
            `/team/${params.projectId}/${params.boardId}/${params.id}/${comment.postCommentId}`,
            content
          );

          if (res.status === 200) {
            try {
              const _res = await getComment(
                `/team/${params.projectId}/${params.boardId}/${params.id}/`
              );
              alert("댓글이 수정되었습니다.");
              setComments(_res.data.postCommentResponseList);

              handleCommentIsToggle();
            } catch (err) {
              console.log(err);
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    [content, comment, setComments, type, params, handleCommentIsToggle]
  );

  if (isEditComment) {
    return (
      <form onSubmit={onSubmit}>
        <div className='comment-item'>
          <div className='profile-box'>
            <Image
              src={
                comment.member.profileImage !== null
                  ? dataURI
                  : "/img/profile_default.png"
              }
              alt='프로필'
              className='comment-profile'
              width={48}
              height={48}
              placeholder='blur'
              blurDataURL={dataURI}
            />
          </div>
          <div className='comment-right'>
            <div className='right-info'>
              <div className=''>
                <span>{comment.member.memberName}</span>
                <b>ㆍ</b>
                <span>{comment.createDate}</span>
              </div>

              {Number(memberId) === comment?.member?.memberId ? (
                <div className='uillBtns edit'>
                  <button type='submit'>수정</button>
                  <button type='button' onClick={handleCommentIsToggle}>
                    취소
                  </button>
                </div>
              ) : null}
            </div>
            <textarea
              className='editComment'
              value={content}
              onChange={handleContent}
            />
          </div>
        </div>
      </form>
    );
  } else {
    return (
      <div className='comment-item'>
        <div className='profile-box'>
          <Image
            src={
              comment.member.profileImage !== null
                ? dataURI
                : "/img/profile_default.png"
            }
            alt='프로필'
            className='comment-profile'
            width={48}
            height={48}
            placeholder='blur'
            blurDataURL={dataURI}
          />
        </div>
        <div className='comment-right'>
          <div className='right-info'>
            <div className=''>
              <span>{comment.member.memberName}</span>
              <b>ㆍ</b>
              <span>{comment.createDate}</span>
            </div>

            {Number(memberId) === comment?.member?.memberId ? (
              <div className='uillBtns'>
                <button type='button' onClick={handleCommentIsToggle}>
                  수정
                </button>
                <button
                  type='button'
                  onClick={() => handleCommentDelete(comment.postCommentId)}
                >
                  삭제
                </button>
              </div>
            ) : null}
          </div>
          <p>{comment.content}</p>
        </div>
      </div>
    );
  }
}
