"use client";

import React from "react";

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

type Props = {
  messageId: string;
  messages: Message[];
};

const MessageThread: React.FC<Props> = ({ messageId, messages }) => {
  return (
    <div className="messageThread">
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
            {msg.comments && (
              <div className="comments">
                {msg.comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <img
                      src={comment.profilePicture}
                      alt={comment.username}
                      className="profilePicture"
                    />
                    <div className="commentContent">
                      <div className="commentHeader">
                        <span className="username">{comment.username}</span>
                        <span className="timestamp">{comment.timestamp}</span>
                      </div>
                      <div
                        className="commentText"
                        dangerouslySetInnerHTML={{ __html: comment.text }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageThread;
