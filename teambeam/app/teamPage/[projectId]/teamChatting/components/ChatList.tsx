"use client";

import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import MessageThread from "./MessageThread";
import MessageInput from "./MessageInput";
import { useParams } from "next/navigation";
import Image from "next/image";
import { fetchProfileImage, fetchMessages, getUserInfo } from "@/app/_api/chat";
import { formatTimestamp } from "./utils";

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

  useEffect(() => {
    if (!projectId) return;

    const loadMessages = async () => {
      const data = await fetchMessages(projectId);
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
    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      upgrade: false,
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      try {
        const token = getToken();
        const projectIdNumber = Number(projectId);
        newSocket.emit("joinRoom", projectIdNumber, (response: any) => {
          console.log("Join room response:", response);
        });
      } catch (error) {
        console.error("Error getting token:", error);
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from socket server", reason);
    });

    newSocket.on("connect_error", (error: any) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("message", async (message: any) => {
      const profileImage =
        profileImageCache.current[message.member.memberId] ||
        (await fetchProfileImage(message.member.memberId));

      profileImageCache.current[message.member.memberId] = profileImage;

      const newMessage: Message = {
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
        console.log("Messages after adding new message:", updatedMessages); // Debug log
        setTimeout(() => {
          if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
          }
        }, 0);
        return updatedMessages;
      });
    });

    newSocket.on("messageSent", async (message: any) => {
      const profileImage =
        profileImageCache.current[message.member.memberId] ||
        (await fetchProfileImage(message.member.memberId));

      profileImageCache.current[message.member.memberId] = profileImage;

      const newMessage: Message = {
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
        console.log("Messages after messageSent event:", updatedMessages); // Debug log
        setTimeout(() => {
          if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
          }
        }, 0);
        return updatedMessages;
      });
    });

    newSocket.on("comment", async (comment: any) => {
      console.log("Received comment:", comment);

      if (
        !comment ||
        !comment.member ||
        !comment.member.memberId ||
        !comment.messageCommentId ||
        !comment.messageId
      ) {
        console.error("Invalid comment structure", comment);
        return;
      }

      const commentProfileImage =
        profileImageCache.current[comment.member.memberId] ||
        (await fetchProfileImage(comment.member.memberId));

      profileImageCache.current[comment.member.memberId] = commentProfileImage;

      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((msg) => {
          if (msg.id === comment.messageId.toString()) {
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
        console.log("Messages after comment event:", updatedMessages); // Debug log

        // Ensure activeMessage is updated if it's the current message being viewed
        setActiveMessage((prevActiveMessage) => {
          if (
            prevActiveMessage &&
            prevActiveMessage.id === comment.messageId.toString()
          ) {
            const updatedActiveMessage = updatedMessages.find(
              (msg) => msg.id === prevActiveMessage.id
            );
            console.log("Updated activeMessage:", updatedActiveMessage); // Debug log
            return updatedActiveMessage || prevActiveMessage;
          }
          return prevActiveMessage;
        });

        setTimeout(() => {
          if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
          }
        }, 0);

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

  const handleCommentSubmit = async (content: string) => {
    if (activeMessage && socketRef.current && projectId) {
      try {
        const token = getToken();
        const memberId = getMemberId();
        const newComment = {
          token,
          projectId: Number(projectId),
          messageComment: content,
          messageId: Number(activeMessage.id),
        };

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

  const handleBackButtonClick = () => {
    window.location.reload();
  };

  return (
    <div className="chatContainer">
      <div className="chatArea" ref={chatAreaRef}>
        {activeMessage ? (
          <div className="commentsView">
            <button className="backButton" onClick={handleBackButtonClick}>
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
            {messages.map((msg: Message) => (
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
