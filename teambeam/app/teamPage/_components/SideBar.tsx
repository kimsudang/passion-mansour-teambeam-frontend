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

export default function SideBar() {
  return (
    <nav>
      <div className='top-info'>
        <h2>팀 프로젝트</h2>
      </div>

      <div className='side-menu'>
        <li>
          <Link href='/teamPage/teamMain'>
            <div className='icon-box'>
              <HomeIcon size={21} />
            </div>
            <span>메인</span>
          </Link>
        </li>

        <li>
          <Link href='/teamPage/teamCalendar'>
            <div className='icon-box'>
              <CalendarIcon size={16} />
            </div>
            <span>캘린더</span>
          </Link>
        </li>

        <li>
          <Link href='/teamPage/teamTodo'>
            <div className='icon-box'>
              <TodoIcon size={18} />
            </div>
            <span>투두리스트</span>
          </Link>
        </li>

        <li>
          <Link href='/teamPage/teamBoard'>
            <div className='icon-box'>
              <BoardIcon size={14} />
            </div>
            <span>게시판</span>
          </Link>
        </li>

        <li>
          <Link href='/teamPage/teamChatting'>
            <div className='icon-box'>
              <CommentIcon size={18} />
            </div>
            <span>채팅</span>
          </Link>
        </li>

        <li>
          <Link href='/teamPage/teamSetting'>
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
