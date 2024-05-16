import React from "react";

type Message = {
  id: string;
  text: string;
  profilePicture: string;
  username: string;
  timestamp: string;
};

type Props = {
  messageId: string;
  messages: Message[];
};

const MessageThread: React.FC<Props> = ({ messageId, messages }) => {
  return (
    <div className="message-thread">
      {messages.map((msg) => (
        <div key={msg.id} className="message">
          <img
            src={msg.profilePicture}
            alt={msg.username}
            className="profile-picture"
          />
          <div className="message-content">
            <div className="message-header">
              <span className="username">{msg.username}</span>
              <span className="timestamp">{msg.timestamp}</span>
            </div>
            <div className="message-text">{msg.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageThread;
