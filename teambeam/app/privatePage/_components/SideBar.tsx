"use client";

import Link from "next/link";
import "./SideBar.scss";

export default function SideBar() {
  return (
    <nav>
      <div className='top_info'>
        <h3>개인채널</h3>
      </div>

      <div className='side_menu'>
        <li>
          <Link href='/privatePage/main'>메인</Link>
        </li>

        <li>
          <Link href='/privatePage/memo'>메모</Link>
        </li>

        <li>
          <Link href='/privatePage/bookmark'>북마크</Link>
        </li>
      </div>
    </nav>
  );
}
