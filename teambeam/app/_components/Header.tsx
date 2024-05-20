"use client";

import "./Header.scss";
import { useRouter } from "next/navigation";
import { Logo } from "./Icons";
import Link from "next/link";
import Image from "next/image";
import profileDefault from "../../public/img/profile_default.png";

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

      <div className='right-menu'>
        <div className='channel-menu'>
          <Link href='/privatePage/main'>개인채널</Link>
          <Link href='/main'>팀채널</Link>
        </div>
        <div className='setting-menu'>
          <Link href='/privatePage/mySetting'>
            <Image
              src={profileDefault}
              alt='마이 프로필'
              className='img-profile'
              width={48}
              height={48}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
