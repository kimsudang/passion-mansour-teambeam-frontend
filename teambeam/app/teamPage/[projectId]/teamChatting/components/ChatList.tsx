"use client";

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import MessageThread from "./MessageThread";
import MessageInput from "./MessageInput";
import { useParams } from "next/navigation";
import axios from "axios";
import api from "@/app/_api/api";

// 로컬 스토리지에서 토큰을 가져오는 함수
const getToken = () => {
  const token = localStorage.getItem("Authorization");
  if (!token) {
    throw new Error("Authorization token is missing");
  }
  return token;
};

// 로컬 스토리지에서 memberId를 가져오는 함수
const getMemberId = () => {
  const memberId = localStorage.getItem("MemberId");
  if (!memberId) {
    throw new Error("Member ID is missing");
  }
  return memberId;
};

// Participant 타입 정의
type Participant = {
  id: string;
  name: string;
  profileImage: string;
};

// 참가자 조회 함수
export const fetchParticipants = async (
  projectId: string
): Promise<Participant[]> => {
  try {
    const token = getToken();

    const response = await api.get(`/team/${projectId}/joinMember`, {
      headers: {
        Authorization: token,
      },
    });

    console.log("Participants response:", response.data);

    if (response.data && response.data.joinMemberList) {
      const participants: Participant[] = response.data.joinMemberList.map(
        (member: any) => ({
          id: String(member.memberId),
          name: member.memberName,
          profileImage: member.profileImg, // 프로필 이미지 추가
        })
      );
      return participants;
    } else {
      throw new Error("Invalid response data format");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching participants:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching participants:", error);
    }
    throw error;
  }
};

// 사용자 정보를 가져오는 함수
const getUserInfo = async (projectId: string, memberId: string) => {
  const participants = await fetchParticipants(projectId);
  return participants.find(
    (participant: Participant) => participant.id === memberId
  );
};

type Comment = {
  id: string;
  text: string;
  profileImage: string;
  username: string;
  timestamp: string;
};

type Message = {
  id: string;
  text: string;
  profileImage: string;
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
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // 기존 채팅 메시지 불러오기
  const fetchMessages = async (projectId: string) => {
    try {
      const response = await axios.get(
        `http://34.22.108.250:8080/api/team/chat/${projectId}`
      );
      const fetchedMessages = response.data.map((message: any) => ({
        id: message.messageId.toString(),
        text: message.messageContent,
        profileImage: message.member.profileImg,
        username: message.member.memberName,
        timestamp: message.createDate,
        comments: message.messageComments.map((comment: any) => ({
          id: comment.messageCommentId.toString(),
          text: comment.messageCommentContent,
          profileImage: comment.member.profileImg,
          username: comment.member.memberName,
          timestamp: comment.createDate,
        })),
      }));
      setMessages(fetchedMessages);
      // Scroll to the bottom to show the latest messages
      setTimeout(() => {
        if (chatAreaRef.current) {
          chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
      }, 0);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (!projectId) return;

    fetchMessages(projectId);

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
        profileImage: message.member.profileImg,
        username: message.member.memberName,
        timestamp: message.createDate,
        comments: message.messageComments.map((comment: any) => ({
          id: comment.messageCommentId.toString(),
          text: comment.messageCommentContent,
          profileImage: comment.member.profileImg,
          username: comment.member.memberName,
          timestamp: comment.createDate,
        })),
      };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        if (chatAreaRef.current) {
          chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
        return updatedMessages;
      });
    });

    // 서버로부터 새 메시지 전송 확인 후 UI 업데이트
    newSocket.on("messageSent", (message: any) => {
      console.log("Server acknowledged message sent:", message);
      const newMessage = {
        id: message.messageId.toString(),
        text: message.messageContent,
        profileImage: message.member.profileImg,
        username: message.member.memberName,
        timestamp: message.createDate,
        comments: message.messageComments.map((comment: any) => ({
          id: comment.messageCommentId.toString(),
          text: comment.messageCommentContent,
          profileImage: comment.member.profileImg,
          username: comment.member.memberName,
          timestamp: comment.createDate,
        })),
      };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        if (chatAreaRef.current) {
          chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
        return updatedMessages;
      });
    });

    // 댓글 수신 및 실시간 업데이트
    newSocket.on("commentAdded", (comment: any) => {
      console.log("Received comment:", comment);
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((msg) => {
          if (msg.id === comment.messageId.toString()) {
            const updatedComments = [
              ...(msg.comments || []),
              {
                id: comment.messageCommentId.toString(),
                text: comment.messageCommentContent,
                profileImage: comment.member.profileImg,
                username: comment.member.memberName,
                timestamp: comment.createDate,
              },
            ];
            return { ...msg, comments: updatedComments };
          }
          return msg;
        });
        if (activeMessage) {
          const updatedActiveMessage = updatedMessages.find(
            (msg) => msg.id === activeMessage.id
          );
          if (updatedActiveMessage) {
            setActiveMessage(updatedActiveMessage);
          }
        }
        return updatedMessages;
      });
    });

    // 디버깅을 위한 추가 이벤트 리스너
    newSocket.onAny((event, ...args) => {
      console.log(`Received event ${event} with args:`, args);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    // 새로고침 시 활성 메시지 유지
    const storedActiveMessage = localStorage.getItem("activeMessage");
    if (storedActiveMessage) {
      setActiveMessage(JSON.parse(storedActiveMessage));
    }
  }, []);

  useEffect(() => {
    if (activeMessage) {
      localStorage.setItem("activeMessage", JSON.stringify(activeMessage));
    } else {
      localStorage.removeItem("activeMessage");
    }
  }, [activeMessage]);

  const handleBackClick = () => {
    setActiveMessage(null);
  };

  const handleCommentSubmit = async (content: string) => {
    if (activeMessage && socketRef.current && projectId) {
      try {
        const token = getToken();
        const memberId = getMemberId();
        const userInfo = await getUserInfo(projectId, memberId);
        if (!userInfo) throw new Error("User not found");
        const { name: username, profileImage } = userInfo;

        const newComment = {
          token,
          projectId: Number(projectId),
          messageComment: content,
          messageId: Number(activeMessage.id),
          username,
          profileImage,
        };

        // 서버에 새로운 댓글 전송
        socketRef.current.emit("addComment", newComment);
        console.log("Sent comment:", newComment);
      } catch (error) {
        console.error("Error getting token or user info:", error);
      }
    }
  };

  const handleMainMessageSubmit = async (content: string) => {
    if (socketRef.current && projectId) {
      try {
        const token = getToken();
        const memberId = getMemberId();
        const userInfo = await getUserInfo(projectId, memberId);
        if (!userInfo) throw new Error("User not found");
        const { name: username, profileImage } = userInfo;

        const newMessage = {
          token,
          projectId: Number(projectId),
          messageContent: content,
          username,
          profileImage,
        };
        socketRef.current.emit("message", newMessage);
        console.log("Sent message:", newMessage);
      } catch (error) {
        console.error("Error getting token or user info:", error);
      }
    }
  };

  const handleReplyButtonClick = (msg: Message) => {
    setActiveMessage(msg);
  };

  return (
    <div className="chatContainer">
      <div className="chatArea" ref={chatAreaRef}>
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
          <div className="messageList">
            {messages.map((msg) => (
              <div key={msg.id} className="message">
                <img
                  src={msg.profileImage}
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
          </div>
        )}
      </div>
      {!activeMessage && <MessageInput onSubmit={handleMainMessageSubmit} />}
    </div>
  );
};

export default ChatList;
