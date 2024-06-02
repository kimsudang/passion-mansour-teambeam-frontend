"use client";

import {
  deleteBookmark,
  getBookmarkList,
  postBookmark,
} from "@/app/_api/bookmark";
import BoardList from "@/app/_components/BoardList";
import React, { useCallback, useEffect, useState } from "react";

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

export type BookmarkType = {
  bookmarkId: number;
  member: {
    memberId: number;
    memberName: string;
    profileImage: string;
  };
  post: {
    boardId: number;
    boardName: string;
    title: string;
    contnet: string;
    bookmark: boolean;
    createDate: string;
    notice: boolean;
    postTags: { tagId: number; tagName: string }[];
    postType: string;
  };
};

const Page = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[] | null>(null);

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

        setBookmarks(res.data.bookmarkResponses);
      } catch (err) {
        console.log("err  : ", err);
      }
    };

    fetchData();
  }, []);

  // 북마크 토글
  const handleBookmark = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>, data: Board) => {
      e.preventDefault();
      e.stopPropagation();

      if (!data.bookmark) {
        try {
          const res = await postBookmark(`/my/bookmark/${data.postId}`);

          console.log("bookmark add : ", res);
          // setBookmarks(res.data.postResponses);
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const res = await deleteBookmark(`/my/bookmark/${data.postId}`);

          console.log("bookmark remove :", res);
          // setBookmarks(res.data.postResponses);
        } catch (err) {
          console.log(err);
        }
      }
    },
    []
  );

  return (
    <div>
      <title>북마크</title>
      <h1 style={{ marginBottom: "24px" }}>북마크</h1>

      {bookmarks !== null ? (
        <>
          {bookmarks.length === 0 ? (
            <p style={{ textAlign: "center", padding: "32px 0" }}>
              북마크한 게시글이 없습니다.
            </p>
          ) : (
            <>
              {bookmarks.map((bookmark: BookmarkType) => {
                return (
                  <BoardList
                    projectId={"undefined"}
                    boardId={"undefined"}
                    key={bookmark.bookmarkId}
                    board={null}
                    bookmark={bookmark}
                    handleBookmark={handleBookmark}
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
