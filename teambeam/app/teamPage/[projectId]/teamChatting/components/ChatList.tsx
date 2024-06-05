"use client";

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import MessageThread from "./MessageThread";
import MessageInput from "./MessageInput";
import { useParams } from "next/navigation";

// 로컬 스토리지에서 토큰을 가져오는 함수
const getToken = () => {
  const token = localStorage.getItem("Authorization");
  if (!token) {
    throw new Error("Authorization token is missing");
  }
  return token;
};

type Comment = {
  id: string;
  text: string;
  profilePicture: string;
  username: string;
  timestamp: string;
};

type Message = {
  id: string;
  text: string;
  profilePicture: string;
  username: string;
  timestamp: string;
  comments?: Comment[];
};

const ChatList: React.FC = () => {
  const params = useParams();
  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : params.projectId;
  const [activeMessage, setActiveMessage] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!projectId) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    const newSocket = io(socketUrl || ""); // 기본값을 빈 문자열로 설정
    socketRef.current = newSocket;

    // 소켓 연결 상태 확인
    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      console.log("Socket ID:", newSocket.id);

      try {
        const token = getToken();
        const projectIdNumber = Number(projectId); // ensure projectId is a number

        // 채팅방 입장
        console.log("Sending joinRoom event with:", projectIdNumber);
        newSocket.emit("joinRoom", projectIdNumber);
        console.log("Joined room with projectId:", projectIdNumber);
      } catch (error) {
        console.error("Error getting token:", error);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    newSocket.on("connect_error", (error: any) => {
      console.error("Socket connection error:", error);
    });

    // 채팅 메시지 수신
    newSocket.on("message", (message: any) => {
      console.log("Received message:", message);
      const newMessage = {
        id: message.messageId.toString(),
        text: message.messageContent,
        profilePicture: message.member.profileImg,
        username: message.member.memberName,
        timestamp: message.createDate,
        comments: message.messageComments.map((comment: any) => ({
          id: comment.messageCommentId.toString(),
          text: comment.messageCommentContent,
          profilePicture: comment.member.profileImg,
          username: comment.member.memberName,
          timestamp: comment.createDate,
        })),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // 서버로부터 새 메시지 전송 확인 후 UI 업데이트
    newSocket.on("messageSent", (message: any) => {
      console.log("Server acknowledged message sent:", message);
      const newMessage = {
        id: message.messageId.toString(),
        text: message.messageContent,
        profilePicture: message.member.profileImg,
        username: message.member.memberName,
        timestamp: message.createDate,
        comments: message.messageComments.map((comment: any) => ({
          id: comment.messageCommentId.toString(),
          text: comment.messageCommentContent,
          profilePicture: comment.member.profileImg,
          username: comment.member.memberName,
          timestamp: comment.createDate,
        })),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // 디버깅을 위한 추가 이벤트 리스너
    newSocket.onAny((event, ...args) => {
      console.log(`Received event ${event} with args:`, args);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [projectId]);

  const handleBackClick = () => {
    setActiveMessage(null);
  };

  const handleCommentSubmit = (content: string) => {
    if (activeMessage && socketRef.current && projectId) {
      try {
        const token = getToken();
        const newComment = {
          token,
          projectId: Number(projectId),
          messageComment: content,
          messageId: Number(activeMessage.id),
        };

        // 서버에 새로운 댓글 전송
        socketRef.current.emit("addComment", newComment);
        console.log("Sent comment:", newComment);

        // 클라이언트 측에서 UI 업데이트
        const updatedMessages = messages.map((msg) => {
          if (msg.id === activeMessage.id) {
            const updatedComments = [
              ...(msg.comments || []),
              {
                id: `${msg.id}-${(msg.comments?.length || 0) + 1}`,
                text: content,
                profilePicture: "https://via.placeholder.com/40",
                username: "현재 사용자", // 현재 사용자의 이름으로 대체
                timestamp: new Date().toISOString(),
              },
            ];
            return { ...msg, comments: updatedComments };
          }
          return msg;
        });
        setMessages(updatedMessages);
        setActiveMessage(
          updatedMessages.find((msg) => msg.id === activeMessage.id) || null
        );
        console.log(`Submitted comment: ${content}`);
      } catch (error) {
        console.error("Error getting token:", error);
      }
    }
  };

  const handleMainMessageSubmit = (content: string) => {
    if (socketRef.current && projectId) {
      try {
        const token = getToken();
        const newMessage = {
          token,
          projectId: Number(projectId),
          messageContent: content,
        };
        socketRef.current.emit("message", newMessage);
        console.log("Sent message:", newMessage);
      } catch (error) {
        console.error("Error getting token:", error);
      }
    }
  };

  const handleReplyButtonClick = (msg: Message) => {
    setActiveMessage(msg);
  };

  return (
    <div className="chatArea">
      {activeMessage ? (
        <div className="commentsView">
          <button className="backButton" onClick={handleBackClick}>
            ← Back
          </button>
          <MessageThread
            messageId={activeMessage.id}
            messages={[activeMessage]}
          />
          <MessageInput onSubmit={handleCommentSubmit} />
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <div key={msg.id} className="message">
              <img
                src={msg.profilePicture}
                alt={msg.username}
                className="profilePicture"
              />
              <div className="messageContent">
                <div className="messageHeader">
                  <span className="username">{msg.username}</span>
                  <span className="timestamp">{msg.timestamp}</span>
                </div>
                <div
                  className="messageText"
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                ></div>
                <div
                  className="replyButton"
                  onClick={() => handleReplyButtonClick(msg)}
                >
                  {msg.comments && msg.comments.length > 0
                    ? `${msg.comments.length}개의 댓글`
                    : "댓글 달기"}
                </div>
              </div>
            </div>
          ))}
          <MessageInput onSubmit={handleMainMessageSubmit} />
        </>
      )}
    </div>
  );
};

export default ChatList;
