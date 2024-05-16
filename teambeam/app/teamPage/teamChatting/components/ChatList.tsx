"use client";

import React, { useState } from "react";
import MessageThread from "./MessageThread";
import MessageInput from "./MessageInput";

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
  const [activeMessage, setActiveMessage] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1-1",
      text: "<p>홍길동의 메세지입니다.</p>",
      profilePicture: "https://via.placeholder.com/40",
      username: "홍길동",
      timestamp: "2024-05-16 14:31",
      comments: [
        {
          id: "1-1-1",
          text: "<p>홍길동의 메세지에 대한 댓글입니다.</p>",
          profilePicture: "https://via.placeholder.com/40",
          username: "고길동",
          timestamp: "2024-05-16 14:35",
        },
      ],
    },
    {
      id: "1-2",
      text: "<p>고길동의 메세지입니다.</p>",
      profilePicture: "https://via.placeholder.com/40",
      username: "고길동",
      timestamp: "2024-05-16 14:35",
    },
  ]);

  const handleBackClick = () => {
    setActiveMessage(null);
  };

  const handleCommentSubmit = (content: string) => {
    if (activeMessage) {
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
    }
  };

  const handleMainMessageSubmit = (content: string) => {
    const newMessage: Message = {
      id: `${messages.length + 1}`,
      text: content,
      profilePicture: "https://via.placeholder.com/40",
      username: "현재 사용자", // 현재 사용자의 이름으로 대체
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);
    console.log(`Submitted main message: ${content}`);
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
