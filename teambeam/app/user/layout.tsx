import { ReactNode } from "react";
import Header from "../_components/Header";
import "@/app/globals.scss";
import "./layout.scss";

type props = {
  children: ReactNode;
};

export default function PrivateLayout({ children }: props) {
  return (
    <>
      <Header />
      <div className='layout_wrap'>
        <div className='container'>{children}</div>
      </div>
    </>
  );
}
