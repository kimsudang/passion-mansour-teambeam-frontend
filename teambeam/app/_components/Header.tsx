"use client";

import "./Header.scss";
import { useRouter } from "next/navigation";
import { Logo } from "./Icons";
import Link from "next/link";

export default function Header() {
  const router = useRouter();

  const handleOnClick = () => {
    router.push(`/main`);
  };

  return (
    <header>
      <Link href='/main'>
        <Logo size={88}></Logo>
      </Link>

      <div className='right_menu'>
        <div className='channel_menu'>
          <Link href='/privatePage/main'>개인채널</Link>
          <Link href='/teamPage/teamMain'>팀채널</Link>
        </div>
        <div className='setting_menu'>
          <Link href='/privatePage/mySetting'>환경설정</Link>
        </div>
      </div>
    </header>
  );
}
