"use client";

import Link from "next/link";
import "./SideBar.scss";
import {
  BoardIcon,
  CalendarIcon,
  CommentIcon,
  DeleteBtnIcon,
  HomeIcon,
  LeftBtnIcon,
  RightBtnIcon,
  SettingIcon,
  TodoIcon,
} from "@/app/_components/Icons";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { useCallback, useEffect, useReducer, useState } from "react";
import { deleteBoard, getBoardList } from "@/app/_api/board";
import BoardAddModal from "./BoardAddModal";

type BoardType = {
  boardId: number;
  name: string;
};

export default function SideBar() {
  const init = () => {
    const isSidebar = localStorage.getItem("isSidebar");
    return isSidebar !== null ? JSON.parse(isSidebar) : true;
  };

  const [boardList, setBoardLists] = useState<BoardType[] | null>(null);
  const [isSideToggle, toggleIsSideToggle] = useReducer(
    (state) => !state,
    undefined,
    init
  );
  const [isOpen, toggleIsOpen] = useReducer((state) => {
    return !state;
  }, false);
  const segment = useSelectedLayoutSegment();
  const params = useParams<{
    projectId: string;
    boardId: string;
  }>();

  useEffect(() => {
    localStorage.setItem("isSidebar", JSON.stringify(isSideToggle));

    // 사이드바 토글
    if (isSideToggle) {
      document.documentElement.style.setProperty("--sideSize", `240px`);
    } else {
      document.documentElement.style.setProperty("--sideSize", `78px`);
    }

    // 게시판 조회
    const fetchData = async () => {
      try {
        const res = await getBoardList(`/team/${params.projectId}/board`);
        setBoardLists(res.data.boardResponses);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [params, isSideToggle]);

  const handleSideBarToggle = () => {
    toggleIsSideToggle();
  };

  // 게시판 추가
  const handleAddBoard = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      toggleIsOpen();
    },
    []
  );

  // 게시판 삭제
  const handleDeleteBoard = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        const res = await deleteBoard(
          `/team/${params.projectId}/${params.boardId}`
        );

        if (res.status === 200) {
          // 삭제 성공시 게시판 리스트 재조회
          try {
            const res = await getBoardList(`/team/${params.projectId}/board`);
            setBoardLists(res.data.boardResponses);
          } catch (err) {
            console.log(err);
          }
        }
      } catch (err) {
        console.log(err);
        window.alert("게시판 삭제에 오류가 생겼습니다.");
      }
    },
    [params]
  );

  const onCloseModal = useCallback(() => {
    toggleIsOpen();
  }, []);

  if (boardList === null) {
    return (
      <nav className={`${!isSideToggle ? "noActive" : ""}`}>
        <div className='top-info'>
          <h2>팀 프로젝트</h2>
          <LeftBtnIcon size={24} />
        </div>

        <div className='side-menu'></div>
      </nav>
    );
  } else {
    return (
      <>
        <nav className={`${!isSideToggle ? "noActive" : ""}`}>
          <div className='top-info'>
            <h2>팀 프로젝트</h2>
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
                href={`/teamPage/${params.projectId}/teamMain`}
                className={segment === "teamMain" ? "active" : ""}
                passHref
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
                passHref
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

            {boardList?.map((board, idx: number) => {
              if (idx === 0) {
                return (
                  <li key={board.boardId}>
                    <Link
                      href={`/teamPage/${params.projectId}/teamBoard/${board.boardId}`}
                      className={
                        params.boardId === String(board.boardId) ? "active" : ""
                      }
                    >
                      <div className='menuGroup'>
                        <div className='icon-box'>
                          <BoardIcon size={18} />
                        </div>
                        <span>{board.name}</span>
                      </div>
                      <button
                        type='button'
                        className='boardUtilBtn'
                        onClick={(e) => handleAddBoard(e)}
                      >
                        +
                      </button>
                    </Link>
                  </li>
                );
              } else {
                return (
                  <li key={board.boardId}>
                    <Link
                      href={`/teamPage/${params.projectId}/teamBoard/${board.boardId}`}
                      className={
                        params.boardId === String(board.boardId) ? "active" : ""
                      }
                    >
                      <div className='menuGroup'>
                        <div className='icon-box'>
                          <BoardIcon size={18} />
                        </div>
                        <span>{board.name}</span>
                      </div>
                      <button
                        type='button'
                        className='boardUtilBtn'
                        onClick={(e) => handleDeleteBoard(e)}
                      >
                        <DeleteBtnIcon size={12} />
                      </button>
                    </Link>
                  </li>
                );
              }
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

        {isOpen && (
          <BoardAddModal
            projectId={params.projectId}
            setBoardLists={setBoardLists}
            onCloseModal={onCloseModal}
          />
        )}
      </>
    );
  }
}
