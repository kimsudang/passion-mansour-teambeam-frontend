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
import {
  useParams,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useCallback, useEffect, useReducer, useState } from "react";
import { deleteBoard, getBoardList } from "@/app/_api/board";
import BoardAddModal from "./BoardAddModal";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useUserStore from "@/app/_store/useUserStore";

type ProjectType = {
  projectName: string;
};

type BoardType = {
  boardId: number;
  name: string;
};

export default function SideBar() {
  const [projectData, setProjectData] = useState<ProjectType | null>(null);
  const [boardList, setBoardLists] = useState<BoardType[] | null>(null);
  const [isOpen, toggleIsOpen] = useReducer((state) => {
    return !state;
  }, false);
  const { isSideBar, setIsSideBar, initializeSideBar } = useUserStore();

  useEffect(() => {
    initializeSideBar();
  }, [initializeSideBar]);

  const segment = useSelectedLayoutSegment();
  const params = useParams<{
    projectId: string;
    boardId: string;
  }>();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sideSize",
      isSideBar ? `240px` : `78px`
    );

    // 프로젝트 조회
    const fetchProjectData = async () => {
      try {
        const res = await getBoardList(`/team/${params.projectId}/setting`);
        setProjectData(res.data.project);
      } catch (err) {
        console.log(err);
      }
    };

    // 게시판 조회
    const fetchData = async () => {
      try {
        const res = await getBoardList(`/team/${params.projectId}/board`);
        setBoardLists(res.data.boardResponses);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProjectData();
    fetchData();
  }, [params, isSideBar]);

  const handleSideBarToggle = () => {
    setIsSideBar(!isSideBar);
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
    async (e: React.MouseEvent<HTMLButtonElement>, boardId: number) => {
      e.preventDefault();
      e.stopPropagation();

      if (confirm("정말 삭제하시겠습니까?")) {
        try {
          const res = await deleteBoard(`/team/${params.projectId}/${boardId}`);

          if (res.status === 200) {
            // 삭제 성공시 게시판 리스트 재조회
            try {
              const res = await getBoardList(`/team/${params.projectId}/board`);

              alert("게시판이 삭제되었습니다.");
              setBoardLists(res.data.boardResponses);

              router.push(
                `/teamPage/${params.projectId}/teamBoard/${res.data.boardResponses[0].boardId}`
              );
            } catch (err) {
              console.log(err);
              alert("게시판이 삭제에 실패했습니다.");
            }
          }
        } catch (err) {
          console.log(err);
          window.alert("게시판 삭제에 오류가 생겼습니다.");
        }
      } else {
        return;
      }
    },
    [params, router]
  );

  const onCloseModal = useCallback(() => {
    toggleIsOpen();
  }, []);

  if (boardList === null) {
    return (
      <SkeletonTheme baseColor='#d5d5d5' highlightColor='#e1e1e1'>
        <nav className={`${!isSideBar ? "noActive" : ""}`}>
          <div className='side-menu'>
            {Array.from({ length: 7 }, (_, i) => i).map((n, i) => {
              return (
                <li style={{ marginBottom: "20px" }} key={i}>
                  <Skeleton height={50} borderRadius={10} />
                </li>
              );
            })}
          </div>
        </nav>
      </SkeletonTheme>
    );
  } else {
    return (
      <>
        <nav className={`${!isSideBar ? "noActive" : ""}`}>
          <div className='top-info'>
            <h2>{projectData?.projectName}</h2>
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
                        "menuLink " +
                        (params.boardId === String(board.boardId)
                          ? "active"
                          : "")
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
                        "menuLink " +
                        (params.boardId === String(board.boardId)
                          ? "active"
                          : "")
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
                        onClick={(e) => handleDeleteBoard(e, board.boardId)}
                      >
                        <DeleteBtnIcon size={10} />
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
