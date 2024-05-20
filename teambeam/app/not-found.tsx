"use client";

import Image from "next/image";
import notFound from "../public/img/not-found.png";
import Link from "next/link";
import Header from "./_components/Header";

export default function NotFound() {
  return (
    <>
      <title>Not Found</title>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: `calc(100dvh - 84px)`,
        }}
      >
        <Image
          src={notFound}
          alt='404 Page'
          width={248}
          style={{ display: "block", margin: "0 auto 24px" }}
        />
        <p
          style={{
            display: "block",
            fontSize: "16px",
            fontWeight: 500,
            color: "#242424",
            textAlign: "center",
            margin: "0 auto 64px",
          }}
        >
          해당 페이지는 없는 페이지입니다
        </p>

        <Link
          href='/main'
          style={{
            display: "padding",
            justifyContent: "center",
            alignItems: "center",
            background: `var(--primary)`,
            fontSize: "16px",
            color: "#fff",
            padding: "8px 16px",
            border: "none",
            borderRadius: "10px",
          }}
        >
          메인으로
        </Link>
      </div>
    </>
  );
}
