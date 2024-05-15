import React from 'react';
import Header from '../../../components/header/Header';
import Sidebar from '../../../components/sidebar/Sidebar';
import ChatList from './components/ChatList';
import MessageInput from './components/MessageInput';

const teamChatting: React.FC = () => {
  return (
    <div className="chatting-page">
      <Header />
      <div className="chatting-container">
        <Sidebar />
        <div className="chatting-content">
          <ChatList />
          <MessageInput />
        </div>
      </div>
    </div>
  );
};

export default teamChatting;