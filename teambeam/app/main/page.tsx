"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "../_components/Header";
import "./Main.scss";
import Link from "next/link";
import AddModal from "../_components/AddModal";
import axios from "axios";

export type Project = {
  id: number;
  title: string;
  description: string;
  createAt: string;
  state: string;
};

export default function Page() {
  const [isModal, setIsModal] = useState<boolean>(false);
  const [lists, setLists] = useState<Project[]>([
    {
      id: 0,
      title: "프로젝트 A",
      description:
        "프로젝트를 진행함에 있어 필요한 서비스들을 통합시킨 프로젝트 일정관리 종합 서비스 팀글벙글 프로젝트 진행 기간: 2024.04.29 ~ 2024.06.20",
      createAt: "2024-04-12 10:12:43",
      state: "progress",
    },
    {
      id: 1,
      title: "프로젝트 B",
      description:
        "프로젝트를 진행함에 있어 필요한 서비스들을 통합시킨 프로젝트 일정관리 종합 서비스 팀글벙글 프로젝트 진행 기간: 2024.04.29 ~ 2024.06.20",
      createAt: "2024-04-12 10:12:43",
      state: "complete",
    },
    {
      id: 2,
      title: "프로젝트 C",
      description:
        "프로젝트를 진행함에 있어 필요한 서비스들을 통합시킨 프로젝트 일정관리 종합 서비스 팀글벙글 프로젝트 진행 기간: 2024.04.29 ~ 2024.06.20",
      createAt: "2024-04-12 10:12:43",
      state: "complete",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {}, []);

  const handleChange = useCallback(
    (e: any) => {
      // api 필요
      const arr = [...lists];
      setLists(arr.filter((list) => list.state === e.target.value));
    },
    [lists]
  );

  const handleAddBtn = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div>
      <title>메인페이지</title>
      <Header />
      <div className='main_container'>
        <div className='main_top'>
          <h2>팀 채널</h2>
          <select onChange={handleChange}>
            <option value='all' selected>
              전체
            </option>
            <option value='progress'>진행중</option>
            <option value='complete'>완료</option>
          </select>
        </div>

        <div className='projects_wrap'>
          <div className='write-box' onClick={handleAddBtn}>
            <p>새 프로젝트 생성</p>
            <span>+</span>
          </div>

          {lists.map((list) => {
            return (
              <Link
                href='/teamPage/teamMain'
                key={list.id}
                className='project-item'
              >
                <div className='project-list-wrap'>
                  {list.state === "progress" ? (
                    <span className='progress'>진행중</span>
                  ) : null}
                  {list.state === "complete" ? (
                    <span className='complete'>완료</span>
                  ) : null}
                  <h4>{list.title}</h4>

                  <div className='project-info'>
                    <span>프로젝트 설명</span>
                    <p>{list.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {isModalOpen ? <AddModal onCloseModal={onCloseModal} /> : null}
    </div>
  );
}
