"use client";

import "@/app/_styles/Header.scss";
import { useRouter } from "next/navigation";
import { BellIcon, Logo } from "./Icons";
import Link from "next/link";
import Image from "next/image";
import profileDefault from "../../public/img/profile_default.png";
import { useCallback, useEffect, useState } from "react";
import api from "../_api/api";
import useUserStore from "@/app/_store/useUserStore";
import useSocketStore from "@/app/_store/useSocketStore";
import NotificationModal from "./NotificationModal";
import useNotificationStore from "../_store/useNotificationStore";

export type NotificationType = {
  title: string;
  notificationId: number;
  projectId: number;
  boardId: number;
  postId: number;
  projectName: string;
  read: boolean;
  type: string;
};

export default function Header() {
  const [isMenu, setIsMenu] = useState<boolean>(false);
  const { socket, connect, disconnect } = useSocketStore();
  const {
    notifications,
    filterNotification,
    setNotifications,
    setFilterNotification,
  } = useNotificationStore();
  const [isNotification, setIsNotification] = useState<boolean>(false);
  const {
    token,
    refreshToken,
    memberId,
    imgSrc,
    setUser,
    setImgSrc,
    clearUser,
  } = useUserStore();
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("Authorization");
    const storedRefreshToken = localStorage.getItem("RefreshToken");
    const storedMemberId = localStorage.getItem("MemberId");

    if (storedToken && storedMemberId) {
      setUser(storedToken, storedRefreshToken, storedMemberId);
    }

    const fetchData = async () => {
      if (!token) return;

      try {
        const res = await api.get(`/member/profileImage/${memberId}`);
        const dataURI = `data:image/jpeg;base64,${res.data.profileImage}`;
        setImgSrc(dataURI);
      } catch (err) {
        console.log("err  : ", err);
      }
    };

    fetchData();
  }, [token, memberId, setUser, setImgSrc]);

  useEffect(() => {
    if (!token) return;

    const fetchNotification = async () => {
      try {
        const res = await api.get("/notification");

        console.log("get notification : ", res.data.notificationList);
        setNotifications(res.data.notificationList.reverse());
        setInitialLoad(false); // 초기 로드 완료 표시
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotification();
  }, [token, setNotifications]);

  useEffect(() => {
    if (!token) return;

    const filteredNotifications = notifications.filter(
      (notification) => notification && notification.read === false
    );
    setFilterNotification(filteredNotifications);
  }, [token, notifications, setFilterNotification]);

  useEffect(() => {
    console.log("header tokkken", token);
    console.log("header mmmmId", memberId);

    // 소켓 연결
    if (token && memberId) {
      console.log("header mmmmId 22 ", memberId);
      connect(memberId, true);
    }

    // 소켓 초기화
    return () => {
      console.log("Disconnecting socket");
      disconnect();
    };
  }, [connect, disconnect, token, memberId]);

  // 소켓 이벤트 리스너 설정
  useEffect(() => {
    if (socket) {
      const handleInitialNotifications = ({
        notificationList,
      }: {
        notificationList: NotificationType[];
      }) => {
        console.log("get initial notifications: ", notificationList);

        // 데이터 역순으로 정렬
        const reversedNotifications = notificationList.reverse();
        setNotifications(reversedNotifications);
        setInitialLoad(false);
      };

      socket.on("initial_notifications", handleInitialNotifications);

      return () => {
        socket.off("initial_notifications", handleInitialNotifications);
      };
    }
  }, [socket, setNotifications]);

  // 알림 모달
  const handleNotification = useCallback(() => {
    setIsMenu(false);
    setIsNotification(!isNotification);
  }, [isNotification]);

  // 모달 메뉴
  const handleModalMenu = useCallback(() => {
    setIsNotification(false);
    setIsMenu(!isMenu);
  }, [isMenu]);

  // 세팅 메뉴
  const handleMySetting = useCallback(() => {
    setIsMenu(false);
    setIsNotification(false);
    router.push("/user/mySetting");
  }, [router]);

  // 로그아웃
  const handleLogout = useCallback(() => {
    setIsMenu(false);
    setIsNotification(false);
    setUser(null, null, null);
    clearUser();
    setImgSrc("");
    localStorage.clear();
    router.push("/user/login");
  }, [router, setUser, setImgSrc, clearUser]);

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

            <div className='notification-menu'>
              <button onClick={handleNotification} className='notificationBtn'>
                <BellIcon size={24} />
              </button>
              {filterNotification.length > 0 && (
                <div className='notificationNewCounter'>
                  {filterNotification.length}
                </div>
              )}

              {isNotification && token && refreshToken ? (
                <NotificationModal
                  memberId={memberId}
                  socket={socket}
                  notifications={notifications}
                  setNotifications={setNotifications}
                  initialLoad={initialLoad}
                />
              ) : null}
            </div>

            <div className='setting-menu'>
              <button onClick={handleModalMenu}>
                <Image
                  src={imgSrc ? imgSrc : profileDefault}
                  alt='마이 프로필'
                  className='img-profile'
                  width={48}
                  height={48}
                />
              </button>

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
          </>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
}
