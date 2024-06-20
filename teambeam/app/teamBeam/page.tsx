"use client";

import React, { useEffect, useState } from "react";
import mainImg from "../../public/img/intro_main.png";
import Link from "next/link";
import "./layout.scss";
import Image from "next/image";

const TeambeamHome = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("Authorization");
    setToken(storedToken || "");
  }, []);

  return (
    <>
      <div className='teamBeam_container'>
        <p className='teamBeamTop'>
          개발 프로젝트
          <br />
          통합 일정관리 서비스
        </p>
        <div className='comment_box'>
          <Image src={mainImg} width={440} alt='dfsdf' />
        </div>
        <span className='teamBeamBottom'>&quot;팀 글 벙 글&quot;</span>
        <div className='start_button'>
          {!token ? (
            <>
              <Link href='/user/join' passHref>
                <button className='join_button'>회원가입</button>
              </Link>
              <Link href='/user/login' passHref>
                <button className='login_button'>로그인</button>
              </Link>
            </>
          ) : (
            <>
              <Link href='/main' passHref>
                <button className='main_button'>시작하기</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TeambeamHome;
