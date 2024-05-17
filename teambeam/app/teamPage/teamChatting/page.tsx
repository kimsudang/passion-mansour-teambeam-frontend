import React from 'react';
import ChatList from './components/ChatList';
import './styles/main.scss';

const TeamChatting: React.FC = () => {
  return (
    <div className="container">
        <div className="chat-area">
          <ChatList />
        </div>
      </div>
  );
};

export default TeamChatting;