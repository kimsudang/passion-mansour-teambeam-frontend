"use client";

import Link from "next/link";
import "./SideBar.scss";
import {
  BookmarkIcon,
  HomeIcon,
  LeftBtnIcon,
  MemoIcon,
  RightBtnIcon,
} from "@/app/_components/Icons";
import { useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useReducer } from "react";

export default function SideBar() {
  const init = () => {
    const isSidebar = localStorage.getItem("isSidebar");
    return isSidebar !== null ? JSON.parse(isSidebar) : true;
  };
  const [isSideToggle, toggleIsSideToggle] = useReducer(
    (state) => !state,
    undefined,
    init
  );
  const segment = useSelectedLayoutSegment();

  useEffect(() => {
    localStorage.setItem("isSidebar", JSON.stringify(isSideToggle));

    // 사이드바 토글
    if (isSideToggle) {
      document.documentElement.style.setProperty("--sideSize", `240px`);
    } else {
      document.documentElement.style.setProperty("--sideSize", `78px`);
    }
  }, [isSideToggle]);

  const handleSideBarToggle = () => {
    toggleIsSideToggle();
  };

  return (
    <nav className={`${!isSideToggle ? "noActive" : ""}`}>
      <div className='top-info'>
        <h2>개인채널</h2>
        {isSideToggle ? (
          <button type='button' onClick={handleSideBarToggle}>
            <LeftBtnIcon size={24} />
          </button>
        ) : (
          <button type='button' onClick={handleSideBarToggle}>
            <RightBtnIcon size={24} />
          </button>
        )}
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
