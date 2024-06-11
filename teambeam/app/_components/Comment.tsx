"use client";

import Image from "next/image";
import { CommentType } from "../privatePage/bookmark/[id]/page";
import "@/app/_styles/Comment.scss";
import { useCallback, useEffect, useState } from "react";

export default function Comment({
  isEditComment,
  comment,
  handleCommentIsToggle,
  handleCommentDelete,
}: {
  isEditComment: boolean;
  comment: CommentType;
  handleCommentIsToggle: () => void;
  handleCommentDelete: (commentId: number) => void;
}) {
  const [content, setContent] = useState<string>(comment.content);
  const [memberId, setMemberId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMemberId = localStorage.getItem("MemberId");
      setMemberId(storedMemberId);
    }
  }, []);

  const handleContent = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setContent(e.target.value);
    },
    []
  );

  const onSubmit = useCallback(() => {
    console.log(content);
  }, [content]);

  if (isEditComment) {
    return (
      <form onSubmit={onSubmit}>
        <div className='comment-item'>
          <div className='profile-box'>
            <Image
              src={
                comment.member.profileImage !== null
                  ? // ? comment.member.profileImage
                    "/img/profile_default.png"
                  : "/img/profile_default.png"
              }
              alt='프로필'
              className='comment-profile'
              width={48}
              height={48}
            />
          </div>
          <div className='comment-right'>
            <div className='right-info'>
              <div className=''>
                <span>{comment.member.memberName}</span>
                <b>ㆍ</b>
                <span>{comment.createDate}</span>
              </div>

              <div
                style={{
                  display:
                    Number(memberId) === comment?.member?.memberId
                      ? "block"
                      : "none",
                }}
              >
                <button type='submit'>수정</button>
                <button type='button' onClick={handleCommentIsToggle}>
                  취소
                </button>
              </div>
            </div>
            <input type='text' value={content} onChange={handleContent} />
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
                ? // ? comment.member.profileImage
                  "/img/profile_default.png"
                : "/img/profile_default.png"
            }
            alt='프로필'
            className='comment-profile'
            width={48}
            height={48}
          />
        </div>
        <div className='comment-right'>
          <div className='right-info'>
            <div className=''>
              <span>{comment.member.memberName}</span>
              <b>ㆍ</b>
              <span>{comment.createDate}</span>
            </div>

            <div
              style={{
                display:
                  Number(memberId) === comment?.member?.memberId
                    ? "block"
                    : "none",
              }}
            >
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
          </div>
          <p>{comment.content}</p>
        </div>
      </div>
    );
  }
}
