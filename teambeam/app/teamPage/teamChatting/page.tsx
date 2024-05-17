import React from 'react';
import ChatList from './components/ChatList';
import './styles/main.scss';

const TeamChatting: React.FC = () => {
  return (
    <div className="chatContainer">
      <h2 className="chatTitle">채팅</h2>
        <div className="chat-area">
          <ChatList />
        </div>
      </div>
  );
};

export default TeamChatting;