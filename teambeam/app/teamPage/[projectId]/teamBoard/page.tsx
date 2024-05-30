"use client";

import BoardList from "@/app/_components/BoardList";
import { ToggleDownBtnIcon, ToggleUpBtnIcon } from "@/app/_components/Icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./TeamBoard.scss";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPostList, getPostTag, getPostTagList } from "@/app/_api/board";

export type Board = {
  postId: number;
  title: string;
  postType: string;
  content: string;
  member: {
    memberId: number;
    memberName: string;
    profileImage: string;
  };
  postTags: { tagId: number; tagName: string }[];
  createDate: string;
  updateDate: string;
  notice: boolean;
  bookmark: boolean;
};

type TagType = {
  tagId: number;
  tagName: string;
  tagCategory: string;
  projectId: number;
};

const Page = () => {
  const [boards, setBoards] = useState<Board[] | null>(null);
  const [tagLists, setTagLists] = useState<TagType[]>([]);
  const [activeTags, setActiveTags] = useState<TagType[]>([]);
  const [isToggle, setIsToggle] = useState<boolean>(true);

  const params = useParams<{ projectId: string }>();

  const fetchTagToggleData = useCallback(
    async (tag: number[]) => {
      console.log("tag : ", tag);
      const queryString = tag.map((tag) => `tags=${tag}`).join("&");

      try {
        const res = await getPostTagList(
          `/team/${params.projectId}/1/tags?${queryString}`
        );

        console.log("tagToggle : ", res.data.postResponses);
        setBoards(res.data.postResponses);
      } catch (err) {
        console.log(err);
      }
    },
    [params]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPostList(`/team/${params.projectId}/1/`);
        console.log("res : ", res);

        setBoards(res.data.postResponses);
      } catch (err) {
        console.log("err  : ", err);
      }
    };

    const fetchTagData = async () => {
      try {
        const res = await getPostTag(
          `/team/${params.projectId}/post/tag?postId=1`
        );
        console.log("res : ", res);

        setTagLists(res.data.tagResponses);
      } catch (err) {
        console.log("err  : ", err);
      }
    };

    fetchTagData();

    // 태그가 all 일 경우
    if (activeTags.length === 0) {
      fetchData();
    }

    // 태그별 게시글 조회
    if (activeTags.length > 0 && activeTags[0].tagName !== "all") {
      fetchTagToggleData(activeTags.map((_tag) => _tag.tagId));
    }
  }, [params, activeTags, fetchTagToggleData]);

  const onTagToggle = useCallback((tag: TagType) => {
    setActiveTags((prevTags: TagType[]) =>
      prevTags.map((_tag) => _tag.tagName).includes(tag.tagName)
        ? prevTags.filter((t) => t.tagName !== tag.tagName)
        : [...prevTags, tag]
    );
  }, []);

  const onAllToggle = useCallback(() => {
    setActiveTags([]);
  }, []);

  return (
    <div>
      <title>게시판</title>
      <div className='top-box'>
        <h1>게시판</h1>
        <Link
          href={`/teamPage/${params.projectId}/teamBoard/write`}
          className='write-add-btn'
        >
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
            {tagLists?.map((tag) => {
              return (
                <button
                  key={tag.tagId}
                  className={`tag ${
                    activeTags.map((_tag) => _tag.tagName).includes(tag.tagName)
                      ? "active"
                      : ""
                  }`}
                  onClick={() => onTagToggle(tag)}
                  tag-data={tag}
                >
                  {tag.tagName}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {boards !== null ? (
        <>
          {boards.length === 0 ? (
            <p style={{ textAlign: "center", padding: "32px 0" }}>
              게시글이 없습니다.
            </p>
          ) : (
            <>
              {boards.map((board: Board) => {
                return (
                  <BoardList
                    key={board.postId}
                    projectId={params.projectId}
                    board={board}
                    type={"board"}
                  />
                );
              })}
            </>
          )}
        </>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default Page;
