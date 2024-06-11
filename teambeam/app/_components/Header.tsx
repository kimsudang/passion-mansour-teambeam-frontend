"use client";

import "@/app/_styles/Header.scss";
import { useRouter } from "next/navigation";
import { Logo } from "./Icons";
import Link from "next/link";
import Image from "next/image";
import profileDefault from "../../public/img/profile_default.png";
import { useCallback, useEffect, useState } from "react";

export default function Header() {
  const [isMenu, setIsMenu] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("Authorization");
      const storedRefeshToken = localStorage.getItem("RefreshToken");
      setToken(storedToken);
      setRefreshToken(storedRefeshToken);
    }
  }, []);

  const handleModalMenu = useCallback(() => {
    setIsMenu(!isMenu);
  }, [isMenu]);

  const handleMySetting = useCallback(() => {
    setIsMenu(false);
    router.push("/user/mySetting");
  }, [router]);

  const handleLogout = useCallback(() => {
    setIsMenu(false);
    localStorage.clear();
    router.push("/user/login");
  }, [router]);

  return (
    <header>
      {token && refreshToken ? (
        <>
          <Link href='/main'>
            <Logo size={88}></Logo>
          </Link>
        </>
      ) : (
        <Link href='/'>
          <Logo size={88}></Logo>
        </Link>
      )}

      <div className='right-menu'>
        {token && refreshToken ? (
          <>
            <div className='channel-menu'>
              <Link href='/privatePage/main'>개인채널</Link>
              <Link href='/main'>팀채널</Link>
            </div>
          </>
        ) : (
          <></>
        )}

        <div className='setting-menu'>
          {token && refreshToken ? (
            <>
              <button onClick={handleModalMenu}>
                <Image
                  src={profileDefault}
                  alt='마이 프로필'
                  className='img-profile'
                  width={48}
                  height={48}
                />
              </button>
            </>
          ) : (
            <></>
          )}

          {isMenu && token && refreshToken ? (
            <>
              <div className='modalMenuWrap'>
                <ul>
                  <li onClick={handleMySetting}>
                    <span>환경설정</span>
                  </li>
                  <li onClick={handleLogout}>
                    <span>로그아웃</span>
                  </li>
                </ul>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
