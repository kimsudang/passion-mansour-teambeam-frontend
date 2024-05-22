"use client";

import Link from "next/link";
import "./SideBar.scss";
import { BookmarkIcon, HomeIcon, MemoIcon } from "@/app/_components/Icons";
import { useSelectedLayoutSegment } from "next/navigation";

export default function SideBar() {
  const segment = useSelectedLayoutSegment();

  return (
    <nav>
      <div className='top-info'>
        <h2>개인채널</h2>
      </div>

      <div className='side-menu'>
        <li>
          <Link
            href='/privatePage/main'
            className={segment === "main" ? "active" : ""}
          >
            <div className='icon-box'>
              <HomeIcon size={21} />
            </div>
            <span>메인</span>
          </Link>
        </li>

        <li>
          <Link
            href='/privatePage/memo'
            className={segment === "memo" ? "active" : ""}
          >
            <div className='icon-box'>
              <MemoIcon size={16} />
            </div>
            <span>메모</span>
          </Link>
        </li>

        <li>
          <Link
            href='/privatePage/bookmark'
            className={segment === "bookmark" ? "active" : ""}
          >
            <div className='icon-box'>
              <BookmarkIcon size={14} />
            </div>
            <span>북마크</span>
          </Link>
        </li>
      </div>
    </nav>
  );
}
