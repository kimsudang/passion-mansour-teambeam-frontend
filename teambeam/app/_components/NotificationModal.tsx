"use client";

import "@/app/_styles/Modal.scss";
import { useCallback } from "react";
import { NotificationType } from "./Header";
import { Socket } from "socket.io-client";
import { BellIcon } from "./Icons";
import { useRouter } from "next/navigation";

interface INotificationModalProps {
  memberId: string | null;
  socket: Socket | null;
  notifications: NotificationType[];
  setNotifications: (notifications: NotificationType[]) => void;
  initialLoad: boolean;
}

export default function NotificationModal({
  memberId,
  socket,
  notifications,
  setNotifications,
  initialLoad,
}: INotificationModalProps) {
  const router = useRouter();

  // 알림 전체 삭제
  const handleDelteNotification = useCallback(() => {
    const notificationIds = notifications.map((item) => item.notificationId);

    console.log("delete notification");
    socket?.emit("deleteAll", Number(memberId), () => {
      console.log("232 : ", notificationIds);

      setNotifications([]);
    });
  }, [socket, memberId, notifications, setNotifications]);

  // 알림 읽음 처리 및 라우팅 작업
  const handleReadNotification = useCallback(
    (data: NotificationType) => {
      socket?.emit(
        "updateReadStatus",
        {
          memberId,
          notificationId: data.notificationId,
        },
        () => {
          console.log("write notification");

          socket?.on(
            "initial_notifications",
            ({
              notificationList,
            }: {
              notificationList: NotificationType[];
            }) => {
              console.log("socket initial_notifications");
              if (initialLoad) {
                setNotifications(notificationList.reverse());
              } else {
                setNotifications(notificationList);
              }
            }
          );
        }
      );

      if (data.type === "NOTICE") {
        router.push(
          `/teamPage/${data.projectId}/teamBoard/${data.boardId}/${data.postId}`
        );
      }
    },
    [memberId, socket, setNotifications, initialLoad, router]
  );

  return (
    <div className='notificationBox'>
      <div className='notificationHeader'>
        <h5>알림</h5>
        <button
          type='button'
          className='notificationDelete'
          onClick={handleDelteNotification}
        >
          전체삭제
        </button>
      </div>
      <div className='notificationMain'>
        {notifications.length === 0 ? (
          <div className='no_notification'>
            <BellIcon size={36} />
            <span className='no_span'>알림이 없습니다.</span>
          </div>
        ) : (
          <>
            {notifications?.map((notification) => (
              <div
                className={`notificationItem ${
                  notification.read ? "read" : ""
                }`}
                onClick={() => handleReadNotification(notification)}
                key={notification.notificationId}
              >
                <p>{notification.title}</p>
                <span>{notification.projectName}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
