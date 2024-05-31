"use client";

import Link from "next/link";
import "./SideBar.scss";
import {
  BoardIcon,
  CalendarIcon,
  CommentIcon,
  HomeIcon,
  SettingIcon,
  TodoIcon,
} from "@/app/_components/Icons";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState } from "react";

type BoardType = {
  boardId: number;
  boardName: string;
};

export default function SideBar() {
  const [bordLists, setBoardLists] = useState<BoardType[]>([
    {
      boardId: 1,
      boardName: "게시판",
    },
    {
      boardId: 2,
      boardName: "fsdfsdsfsad",
    },
  ]);
  const segment = useSelectedLayoutSegment();
  const params = useParams<{
    projectId: string;
    boardId: string;
  }>();

  useEffect(() => {}, []);

  return (
    <nav>
      <div className='top-info'>
        <h2>팀 프로젝트</h2>
      </div>

      <div className='side-menu'>
        <li>
          <Link
            href={`/teamPage/${params.projectId}/teamMain`}
            className={segment === "teamMain" ? "active" : ""}
          >
            <div className='icon-box'>
              <HomeIcon size={21} />
            </div>
            <span>메인</span>
          </Link>
        </li>

        <li>
          <Link
            href={`/teamPage/${params.projectId}/teamCalendar`}
            className={segment === "teamCalendar" ? "active" : ""}
          >
            <div className='icon-box'>
              <CalendarIcon size={16} />
            </div>
            <span>캘린더</span>
          </Link>
        </li>

        <li>
          <Link
            href={`/teamPage/${params.projectId}/teamTodo`}
            className={segment === "teamTodo" ? "active" : ""}
          >
            <div className='icon-box'>
              <TodoIcon size={18} />
            </div>
            <span>투두리스트</span>
          </Link>
        </li>

        {bordLists?.map((board) => {
          return (
            <li key={board.boardId}>
              <Link
                href={`/teamPage/${params.projectId}/teamBoard/${board.boardId}`}
                className={
                  params.boardId === String(board.boardId) ? "active" : ""
                }
              >
                <div className='icon-box'>
                  <BoardIcon size={18} />
                </div>
                <span>
                  {board.boardName === "" ? "게시판" : board.boardName}
                </span>
              </Link>
            </li>
          );
        })}

        <li>
          <Link
            href={`/teamPage/${params.projectId}/teamChatting`}
            className={segment === "teamChatting" ? "active" : ""}
          >
            <div className='icon-box'>
              <CommentIcon size={18} />
            </div>
            <span>채팅</span>
          </Link>
        </li>

        <li>
          <Link
            href={`/teamPage/${params.projectId}/teamSetting`}
            className={segment === "teamSetting" ? "active" : ""}
          >
            <div className='icon-box'>
              <SettingIcon size={18} />
            </div>
            <span>프로젝트 관리</span>
          </Link>
        </li>
      </div>
    </nav>
  );
}
