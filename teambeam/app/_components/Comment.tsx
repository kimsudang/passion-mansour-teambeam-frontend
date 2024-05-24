"use client";

import Image from "next/image";
import { CommentType } from "../privatePage/bookmark/[id]/page";
import "@/app/_styles/Comment.scss";

export default function Comment({ comment }: { comment: CommentType }) {
  return (
    <div className='comment-item'>
      <div className='profile-box'>
        <Image
          src={comment.profileSrc}
          alt='프로필'
          className='comment-profile'
          width={48}
          height={48}
        />
      </div>
      <div className='comment-right'>
        <div className='right-info'>
          <span>{comment.writer}</span>
          <b>ㆍ</b>
          <span>{comment.createAt}</span>
        </div>
        <p>{comment.content}</p>
      </div>
    </div>
  );
}
