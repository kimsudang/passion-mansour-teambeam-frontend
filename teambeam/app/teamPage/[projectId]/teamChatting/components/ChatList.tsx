"use client";

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MessageThread from "./MessageThread";
import MessageInput from "./MessageInput";
import { useParams } from "next/navigation";
import axios from "axios";
import api from "@/app/_api/api";

dayjs.extend(relativeTime);

const getToken = () => {
  const token = localStorage.getItem("Authorization");
  if (!token) {
    throw new Error("Authorization token is missing");
  }
  return token;
};

const getMemberId = () => {
  const memberId = localStorage.getItem("MemberId");
  if (!memberId) {
    throw new Error("Member ID is missing");
  }
  return memberId;
};

type Participant = {
  id: string;
  name: string;
  profileImage: string;
};

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
          profileImage: member.profileImg || "/img/memberImage.jpeg", // 기본 이미지 경로 설정
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

const formatTimestamp = (timestamp: string) => {
  const date = dayjs(timestamp);
  const now = dayjs();
  const differenceInDays = now.diff(date, "day");

  if (differenceInDays < 1) {
    return date.fromNow();
  } else {
    return date.format("YYYY-MM-DD HH:mm");
  }
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

  const fetchMessages = async (projectId: string) => {
    try {
      const response = await axios.get(
        `http://34.22.108.250:8080/api/team/chat/${projectId}`
      );
      const fetchedMessages = response.data.map((message: any) => ({
        id: message.messageId.toString(),
        text: message.messageContent,
        profileImage: message.member.profileImg || "/img/memberImage.jpeg", // 기본 이미지 경로 설정
        username: message.member.memberName,
        timestamp: message.createDate,
        comments: message.messageComments.map((comment: any) => ({
          id: comment.messageCommentId.toString(),
          text: comment.messageCommentContent,
          profileImage: comment.member.profileImg || "/img/memberImage.jpeg", // 기본 이미지 경로 설정
          username: comment.member.memberName,
          timestamp: comment.createDate,
        })),
      }));
      setMessages(fetchedMessages);
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
    const newSocket = io(socketUrl || "");
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      console.log("Socket ID:", newSocket.id);

      try {
        const token = getToken();
        const projectIdNumber = Number(projectId);

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

    newSocket.on("message", (message: any) => {
      console.log("Received message:", message);
      const newMessage = {
        id: message.messageId.toString(),
        text: message.messageContent,
        profileImage: message.member.profileImg || "/img/memberImage.jpeg", // 기본 이미지 경로 설정
        username: message.member.memberName,
        timestamp: message.createDate,
        comments: message.messageComments.map((comment: any) => ({
          id: comment.messageCommentId.toString(),
          text: comment.messageCommentContent,
          profileImage: comment.member.profileImg || "/img/memberImage.jpeg", // 기본 이미지 경로 설정
          username: comment.member.memberName,
          timestamp: comment.createDate,
        })),
      };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        console.log(
          "Updated messages after receiving message:",
          updatedMessages
        );
        if (chatAreaRef.current) {
          chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
        return updatedMessages;
      });
    });

    newSocket.on("messageSent", (message: any) => {
      console.log("Server acknowledged message sent:", message);
      const newMessage = {
        id: message.messageId.toString(),
        text: message.messageContent,
        profileImage: message.member.profileImg || "/img/memberImage.jpeg", // 기본 이미지 경로 설정
        username: message.member.memberName,
        timestamp: message.createDate,
        comments: message.messageComments.map((comment: any) => ({
          id: comment.messageCommentId.toString(),
          text: comment.messageCommentContent,
          profileImage: comment.member.profileImg || "/img/memberImage.jpeg", // 기본 이미지 경로 설정
          username: comment.member.memberName,
          timestamp: comment.createDate,
        })),
      };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        console.log("Updated messages after sending message:", updatedMessages);
        if (chatAreaRef.current) {
          chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
        return updatedMessages;
      });
    });

    // commentAdded 이벤트 핸들러 등록
    newSocket.on("commentAdded", (comment: any) => {
      console.log("Received comment:", comment); // 로그 추가
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((msg) => {
          if (msg.id === comment.messageId.toString()) {
            const updatedComments = [
              ...(msg.comments || []),
              {
                id: comment.messageCommentId.toString(),
                text: comment.messageCommentContent,
                profileImage:
                  comment.member.profileImg || "/img/memberImage.jpeg", // 기본 이미지 경로 설정
                username: comment.member.memberName,
                timestamp: comment.createDate,
              },
            ];
            return { ...msg, comments: updatedComments };
          }
          return msg;
        });
        console.log("Updated messages after adding comment:", updatedMessages);
        if (
          activeMessage &&
          activeMessage.id === comment.messageId.toString()
        ) {
          const updatedActiveMessage = updatedMessages.find(
            (msg) => msg.id === activeMessage.id
          );
          if (updatedActiveMessage) {
            setActiveMessage(updatedActiveMessage);
            console.log(
              "Updated activeMessage after adding comment:",
              updatedActiveMessage
            );
          }
        }
        return updatedMessages;
      });
    });

    newSocket.onAny((event, ...args) => {
      console.log(`Received event ${event} with args:`, args);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    const storedActiveMessage = localStorage.getItem("activeMessage");
    if (storedActiveMessage) {
      setActiveMessage(JSON.parse(storedActiveMessage));
      console.log(
        "Restored activeMessage from localStorage:",
        storedActiveMessage
      );
    }
  }, []);

  useEffect(() => {
    if (activeMessage) {
      localStorage.setItem("activeMessage", JSON.stringify(activeMessage));
      console.log("Stored activeMessage in localStorage:", activeMessage);
    } else {
      localStorage.removeItem("activeMessage");
      console.log("Removed activeMessage from localStorage");
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
          profileImage: profileImage || "/img/memberImage.jpeg", // 기본 이미지 경로 설정
        };

        console.log("Sending comment:", newComment);

        socketRef.current.emit("addComment", newComment);
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
          profileImage: profileImage || "/img/memberImage.jpeg", // 기본 이미지 경로 설정
        };
        console.log("Sending message:", newMessage);
        socketRef.current.emit("message", newMessage);
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
                  src={msg.profileImage || "/img/memberImage.jpeg"} // 기본 이미지 경로 설정
                  alt={msg.username}
                  className="profilePicture"
                />
                <div className="messageContent">
                  <div className="messageHeader">
                    <span className="username">{msg.username}</span>
                    <span className="timestamp">
                      {formatTimestamp(msg.timestamp)}
                    </span>
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
