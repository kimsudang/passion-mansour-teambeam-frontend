"use client";

import BoardList from "@/app/_components/BoardList";
import { ToggleDownBtnIcon, ToggleUpBtnIcon } from "@/app/_components/Icons";
import React, { useCallback, useRef, useState } from "react";
import "./TeamBoard.scss";
import Link from "next/link";

export type Board = {
  postId: number;
  postTitle: string;
  postType: string;
  postContent: string;
  writer: string;
  tags: { tagId: number; tagName: string }[];
  createDate: string;
  updateDate: string;
  notice: boolean;
  bookmark: boolean;
};

const Page = () => {
  const [boards, setBoards] = useState<Board[]>([
    {
      postId: 1,
      postTitle: "게시글 1",
      postType: "board",
      postContent: "게시글 1입니다.",
      writer: "홍길동",
      tags: [
        { tagId: 21, tagName: "react" },
        { tagId: 52, tagName: "개발" },
        { tagId: 56, tagName: "기획" },
      ],
      createDate: "2024-04-12 09:51:13",
      updateDate: "2024-04-12 09:51:13",
      notice: false,
      bookmark: true,
    },
    {
      postId: 2,
      postTitle: "게시글 2",
      postType: "board",
      postContent: "게시글 2입니다.",
      writer: "홍길동",
      tags: [{ tagId: 11, tagName: "vue" }],
      createDate: "2024-04-12 09:51:13",
      updateDate: "2024-04-12 09:51:13",
      notice: false,
      bookmark: true,
    },
  ]);
  const [tags, setTags] = useState<string[]>(["react", "vue", "개발"]);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [isToggle, setIsToggle] = useState<boolean>(true);

  const onTagToggle = useCallback((tag: string) => {
    setActiveTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );

    if (tag !== "all") {
      /*
      axios.get(`/api/tags/${tag}`)
        .then(res => res)
        .then(data => setBoards(data))
        .catch(err => console.error(err));
      */
    }
  }, []);

  const onAllToggle = useCallback(() => {
    setActiveTags([]);
  }, []);

  return (
    <div>
      <title>게시판</title>
      <div className='top-box'>
        <h1>게시판</h1>
        <Link href='/teamPage/teamBoard/write' className='write-add-btn'>
          글쓰기
        </Link>
      </div>

      <div className='tag-wrap'>
        <div className='tag-info-top'>
          <button onClick={() => setIsToggle(!isToggle)}>
            {isToggle ? (
              <ToggleUpBtnIcon size={15} />
            ) : (
              <ToggleDownBtnIcon size={15} />
            )}
          </button>

          <span>태그선택</span>
        </div>
        {isToggle ? (
          <div className='tags'>
            <button
              className={`tag ${activeTags.length === 0 ? "active" : ""}`}
              onClick={onAllToggle}
              tag-data='all'
            >
              ALL
            </button>
            {tags?.map((tag, idx) => {
              return (
                <button
                  key={idx}
                  className={`tag ${activeTags.includes(tag) ? "active" : ""}`}
                  onClick={() => onTagToggle(tag)}
                  tag-data={tag}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {boards.map((board: Board) => {
        return <BoardList key={board.postId} board={board} type={"board"} />;
      })}
    </div>
  );
};

export default Page;
