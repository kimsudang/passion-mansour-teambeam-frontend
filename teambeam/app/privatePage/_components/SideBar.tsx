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
import { useEffect, useReducer, useState } from "react";
import useUserStore from "@/app/_store/useUserStore";

export default function SideBar() {
  const [isSidebar, setIsSidebar] = useState<string | null>(null);
  const { isSideBar, setIsSideBar, initializeSideBar } = useUserStore();

  useEffect(() => {
    initializeSideBar();
  }, [initializeSideBar]);

  const segment = useSelectedLayoutSegment();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sideSize",
      isSideBar ? `240px` : `78px`
    );
  }, [isSideBar]);

  const handleSideBarToggle = () => {
    setIsSideBar(!isSideBar);
  };

  return (
    <nav className={`${!isSideBar ? "noActive" : ""}`}>
      <div className='top-info'>
        <h2>개인채널</h2>
        {isSideBar ? (
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
