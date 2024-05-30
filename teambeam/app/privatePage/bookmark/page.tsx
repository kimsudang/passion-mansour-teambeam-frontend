"use client";

import { getBookmarkList } from "@/app/_api/bookmark";
import BoardList from "@/app/_components/BoardList";
import React, { useEffect, useState } from "react";

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

const Page = () => {
  const [boards, setBoards] = useState<Board[] | null>(null);

  // [
  //   {
  //     postId: 1,
  //     title: "게시글 1",
  //     postType: "board",
  //     content: "게시글 1입니다.",
  //     createDate: "2024-04-12 09:51:13",
  //     updateDate: "2024-04-12 09:51:13",
  //     member: { memberId: 2, memberName: "홍길동", profileImage: "" },
  //     postTags: [
  //       { tagId: 21, tagName: "react" },
  //       { tagId: 52, tagName: "개발" },
  //       { tagId: 56, tagName: "기획" },
  //     ],
  //     notice: false,
  //     bookmark: true,
  //   }
  // ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBookmarkList(`/my/bookmark/`);
        console.log("res : ", res);

        setBoards(res.data.postResponses);
      } catch (err) {
        console.log("err  : ", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <title>북마크</title>
      <h1 style={{ marginBottom: "24px" }}>북마크</h1>

      {boards !== null ? (
        <>
          {boards.length === 0 ? (
            <p style={{ textAlign: "center", padding: "32px 0" }}>
              북마크한 게시글이 없습니다.
            </p>
          ) : (
            <>
              {boards.map((board: Board) => {
                return (
                  <BoardList
                    projectId={"undefined"}
                    key={board.postId}
                    board={board}
                    type={"bookmark"}
                  />
                );
              })}
            </>
          )}
        </>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};

export default Page;
