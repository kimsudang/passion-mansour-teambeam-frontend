"use client";

import { useCallback } from "react";
import Header from "../_components/Header";
import "./Main.scss";

export default function Page() {
  const handleChange = useCallback(() => {}, []);

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
            <option value='before'>시작전</option>
            <option value='progress'>진행중</option>
            <option value='complete'>완료</option>
          </select>
        </div>

        <div className='projects_wrap'></div>
      </div>
    </div>
  );
}
