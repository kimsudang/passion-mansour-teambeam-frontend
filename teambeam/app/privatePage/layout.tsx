"use client";

import { ReactNode } from "react";
import Header from "../_components/Header";
import SideBar from "./_components/SideBar";
import "@/app/globals.scss";
import "./layout.scss";

type props = {
  children: ReactNode;
  md: ReactNode;
};

export default function PrivateLayout({ children, md }: props) {
  return (
    <>
      {md}
      <Header />
      <div className='layout_wrap'>
        <SideBar />
        <div className='layout-container'>{children}</div>
      </div>
    </>
  );
}
