import React from "react";
import ChatList from "./components/ChatList";
import "./styles/main.scss";

const TeamChatting: React.FC = () => {
  return (
    <div className='chatContainer'>
      <div className='top-box'>
        <h1>채팅</h1>
      </div>
      <div className='chat-area'>
        <ChatList />
      </div>
    </div>
  );
};

export default TeamChatting;
