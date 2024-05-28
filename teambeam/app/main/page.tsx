"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "../_components/Header";
import "./Main.scss";
import Link from "next/link";
import AddModal from "../_components/AddModal";
import { getPorjectList } from "@/app/_api/project";

export type Project = {
  projectId: number;
  projectName: string;
  description: string;
  createDate: string;
  projectStatus: string;
};

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [lists, setLists] = useState<Project[]>([]);

  useEffect(() => {
    console.log("Access Token: ", process.env.NEXT_PUBLIC_ACCESS_TOKEN);

    const fetchData = async () => {
      try {
        const res = await getPorjectList("/projectList");
        console.log("res : ", res);

        setLists(res.data.projectList);
      } catch (err) {
        console.log("err  : ", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = useCallback(async (e: any) => {
    try {
      const res = await getPorjectList("/projectList");

      e.target.value === "all"
        ? setLists(res.data.projectList)
        : setLists(
            res.data.projectList.filter(
              (list: any) =>
                list.projectStatus?.toLocaleLowerCase() ===
                e.target.value.toLocaleLowerCase()
            )
          );
    } catch (err) {
      console.log(err);
    }
  }, []);

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
            <option value='end'>완료</option>
          </select>
        </div>

        <div className='projects_wrap'>
          <div className='write-box' onClick={handleAddBtn}>
            <p>새 프로젝트 생성</p>
            <span>+</span>
          </div>

          {lists?.map((list) => {
            return (
              <Link
                href='/teamPage/teamMain'
                key={list.projectId}
                className='project-item'
              >
                <div className='project-list-wrap'>
                  {list.projectStatus === "PROGRESS" ? (
                    <span className='progress'>진행중</span>
                  ) : null}
                  {list.projectStatus === "END" ? (
                    <span className='end'>완료</span>
                  ) : null}
                  <h4>{list.projectName}</h4>

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
