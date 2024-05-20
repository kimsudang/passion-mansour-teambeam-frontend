"use client";

import { ReactNode } from "react";
import Header from "../_components/Header";
import SideBar from "./_components/SideBar";
import "@/app/globals.scss";
import "./layout.scss";

type props = {
  children: ReactNode;
};

export default function TeamLayout({ children }: props) {
  return (
    <>
      <Header />
      <div className='layout-wrap'>
        <SideBar />
        <div className='layout-container'>{children}</div>
      </div>
    </>
  );
}
