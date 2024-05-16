"use client";

import Link from "next/link";
import "./SideBar.scss";

export default function SideBar() {
  return (
    <nav>
      <div className='top_info'>
        <h3>팀 프로젝트</h3>
      </div>

      <div className='side_menu'>
        <li>
          <Link href='/teamPage/teamMain'>메인</Link>
        </li>

        <li>
          <Link href='/teamPage/teamCalendar'>캘린더</Link>
        </li>

        <li>
          <Link href='/teamPage/teamTodo'>투드리스트</Link>
        </li>

        <li>
          <Link href='/teamPage/teamBoard'>게시판</Link>
        </li>

        <li>
          <Link href='/teamPage/teamChatting'>채팅</Link>
        </li>

        <li>
          <Link href='/teamPage/teamSetting'>프로젝트 관리</Link>
        </li>
      </div>
    </nav>
  );
}
