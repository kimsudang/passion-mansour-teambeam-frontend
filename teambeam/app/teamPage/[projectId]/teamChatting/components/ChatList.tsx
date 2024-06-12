"use client";

import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MessageThread from "./MessageThread";
import MessageInput from "./MessageInput";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  fetchParticipants,
  fetchProfileImage,
  fetchMessages,
  getUserInfo,
  Participant,
} from "@/app/_api/chat";
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
  const socketRef = useRef<Socket | null>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const profileImageCache = useRef<Record<string, string>>({});

  const tempCommentStorage: { [key: string]: string } = useRef({}).current;

  useEffect(() => {
    if (!projectId) return;

    const loadMessages = async () => {
      console.log("Fetching messages...");
      const data = await fetchMessages(projectId);
      console.log("Fetched messages:", data);
      const fetchedMessages = await Promise.all(
        data.map(async (message: any) => {
          const profileImage =
            profileImageCache.current[message.member.memberId] ||
            (await fetchProfileImage(message.member.memberId));

          profileImageCache.current[message.member.memberId] = profileImage;

          return {
            id: message.messageId.toString(),
            text: message.messageContent,
            profileImage: profileImage,
            username: message.member.memberName,
            timestamp: message.createDate,
            comments: await Promise.all(
              message.messageComments.map(async (comment: any) => {
                const commentProfileImage =
                  profileImageCache.current[comment.member.memberId] ||
                  (await fetchProfileImage(comment.member.memberId));

                profileImageCache.current[comment.member.memberId] =
                  commentProfileImage;

                return {
                  id: comment.messageCommentId.toString(),
                  text: comment.messageCommentContent,
                  profileImage: commentProfileImage,
                  username: comment.member.memberName,
                  timestamp: comment.createDate,
                };
              })
            ),
          };
        })
      );
      setMessages(fetchedMessages);
      setTimeout(() => {
        if (chatAreaRef.current) {
          chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
      }, 0);
    };

    loadMessages();

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL as string;
    console.log("Socket URL:", socketUrl);
    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      upgrade: false,
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      console.log("Socket ID:", newSocket.id);

      try {
        const token = getToken();
        const projectIdNumber = Number(projectId);

        console.log("Sending joinRoom event with:", projectIdNumber);
        newSocket.emit("joinRoom", projectIdNumber, (response: any) => {
          console.log("Join room response:", response);
        });
        console.log("Joined room with projectId:", projectIdNumber);
      } catch (error) {
        console.error("Error getting token:", error);
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from socket server", reason);
      if (reason === "io server disconnect") {
        console.log("The disconnection was initiated by the server");
      } else {
        console.log(
          "The disconnection was initiated by the client or network issues"
        );
      }
    });

    newSocket.on("connect_error", (error: any) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("message", async (message: any) => {
      console.log("Received message:", message);
      const profileImage =
        profileImageCache.current[message.member.memberId] ||
        (await fetchProfileImage(message.member.memberId));

      profileImageCache.current[message.member.memberId] = profileImage;

      const newMessage = {
        id: message.messageId.toString(),
        text: message.messageContent,
        profileImage: profileImage,
        username: message.member.memberName,
        timestamp: message.createDate,
        comments: await Promise.all(
          message.messageComments.map(async (comment: any) => {
            const commentProfileImage =
              profileImageCache.current[comment.member.memberId] ||
              (await fetchProfileImage(comment.member.memberId));

            profileImageCache.current[comment.member.memberId] =
              commentProfileImage;

            return {
              id: comment.messageCommentId.toString(),
              text: comment.messageCommentContent,
              profileImage: commentProfileImage,
              username: comment.member.memberName,
              timestamp: comment.createDate,
            };
          })
        ),
      };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        if (chatAreaRef.current) {
          chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
        return updatedMessages;
      });
    });

    newSocket.on("messageSent", async (message: any) => {
      console.log("Server acknowledged message sent:", message);
      const profileImage =
        profileImageCache.current[message.member.memberId] ||
        (await fetchProfileImage(message.member.memberId));

      profileImageCache.current[message.member.memberId] = profileImage;

      const newMessage = {
        id: message.messageId.toString(),
        text: message.messageContent,
        profileImage: profileImage,
        username: message.member.memberName,
        timestamp: message.createDate,
        comments: await Promise.all(
          message.messageComments.map(async (comment: any) => {
            const commentProfileImage =
              profileImageCache.current[comment.member.memberId] ||
              (await fetchProfileImage(comment.member.memberId));

            profileImageCache.current[comment.member.memberId] =
              commentProfileImage;

            return {
              id: comment.messageCommentId.toString(),
              text: comment.messageCommentContent,
              profileImage: commentProfileImage,
              username: comment.member.memberName,
              timestamp: comment.createDate,
            };
          })
        ),
      };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        if (chatAreaRef.current) {
          chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
        return updatedMessages;
      });
    });

    newSocket.on("comment", async (comment: any) => {
      console.log("Received comment:", comment); // 댓글 수신 로그

      if (
        !comment ||
        !comment.member ||
        !comment.member.memberId ||
        !comment.messageCommentId
      ) {
        console.error("Invalid comment structure", comment);
        return;
      }

      // 임시 저장된 messageId 가져오기
      const messageId = tempCommentStorage[comment.messageCommentContent];

      if (!messageId) {
        console.error("Message ID not found for comment:", comment);
        return;
      }

      const commentProfileImage =
        profileImageCache.current[comment.member.memberId] ||
        (await fetchProfileImage(comment.member.memberId));

      profileImageCache.current[comment.member.memberId] = commentProfileImage;

      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((msg) => {
          if (msg.id === messageId.toString()) {
            // messageId를 사용
            const updatedComments = [
              ...(msg.comments || []),
              {
                id: comment.messageCommentId.toString(),
                text: comment.messageCommentContent,
                profileImage: commentProfileImage,
                username: comment.member.memberName,
                timestamp: comment.createDate,
              },
            ];
            return { ...msg, comments: updatedComments };
          }
          return msg;
        });
        if (
          activeMessage &&
          activeMessage.id === messageId.toString() // messageId를 사용
        ) {
          const updatedActiveMessage = updatedMessages.find(
            (msg) => msg.id === activeMessage.id
          );
          if (updatedActiveMessage) {
            setActiveMessage(updatedActiveMessage);
          }
        }
        return updatedMessages;
      });

      // 사용된 messageId 삭제
      delete tempCommentStorage[comment.messageCommentContent];
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
    if (socketRef.current && activeMessage) {
      const messageRoom = `message_${activeMessage.id}`;
      console.log("Leaving message room:", messageRoom);
      socketRef.current.emit(
        "leaveMessageRoom",
        messageRoom,
        (response: any) => {
          console.log("Leave message room response:", response);
        }
      );
    }
    if (socketRef.current && projectId) {
      console.log("Rejoining project room:", projectId);
      socketRef.current.emit("joinRoom", projectId, (response: any) => {
        console.log("Rejoin project room response:", response);
      });
    }
    setActiveMessage(null);
  };

  const handleCommentSubmit = async (content: string) => {
    if (activeMessage && socketRef.current && projectId) {
      try {
        const token = getToken();
        const memberId = getMemberId();
        const userInfo = await getUserInfo(projectId, memberId);
        if (!userInfo) throw new Error("User not found");

        const newComment = {
          token,
          projectId: Number(projectId),
          messageComment: content,
          messageId: Number(activeMessage.id),
        };

        // 임시 저장
        tempCommentStorage[content] = newComment.messageId.toString();

        console.log("Sending comment:", newComment);
        socketRef.current.emit("comment", newComment, (response: any) => {
          console.log("Received response for comment event:", response);
          if (response) {
            console.log("Comment response:", response);
            if (response.status === "success") {
              console.log("Comment successfully sent");
            } else {
              console.error("Failed to send comment:", response.message);
            }
          } else {
            console.error("No response from server for comment event");
          }
        });
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
          profileImage: profileImage || "/img/memberImage.jpeg",
        };
        console.log("Sending message:", newMessage);
        socketRef.current.emit("message", newMessage, (response: any) => {
          console.log("Message response:", response);
        });
      } catch (error) {
        console.error("Error getting token or user info:", error);
      }
    }
  };

  const handleReplyButtonClick = (msg: Message) => {
    if (socketRef.current && projectId) {
      console.log("Leaving project room:", projectId);
      socketRef.current.emit("leaveRoom", projectId, (response: any) => {
        console.log("Leave project room response:", response);
      });
    }
    const messageRoom = `message_${msg.id}`;
    if (socketRef.current) {
      console.log("Joining message room:", messageRoom);
      socketRef.current.emit(
        "joinMessageRoom",
        messageRoom,
        (response: any) => {
          console.log("Join message room response:", response);
        }
      );
    }
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
                <Image
                  src={msg.profileImage || "/img/memberImage.jpeg"}
                  alt={msg.username}
                  className="profilePicture"
                  width={50}
                  height={50}
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
