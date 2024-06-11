"use client";

import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

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

type Props = {
  messageId: string;
  messages: Message[];
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

const MessageThread: React.FC<Props> = ({ messageId, messages }) => {
  return (
    <div className="messageThread">
      {messages.map((msg) => (
        <div key={msg.id} className="message">
          <Image
            src={msg.profileImage}
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
            {msg.comments && (
              <div className="comments">
                {msg.comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <Image
                      src={comment.profileImage}
                      alt={comment.username}
                      className="profilePicture"
                      width={50}
                      height={50}
                    />
                    <div className="commentContent">
                      <div className="commentHeader">
                        <span className="username">{comment.username}</span>
                        <span className="timestamp">
                          {formatTimestamp(comment.timestamp)}
                        </span>
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
