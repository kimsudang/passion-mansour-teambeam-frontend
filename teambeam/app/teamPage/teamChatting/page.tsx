import React from 'react';
import Header from '../../../components/header/Header';
import Sidebar from '../../../components/sidebar/Sidebar';
import ChatList from './components/ChatList';
import './styles/main.scss';

const TeamChatting: React.FC = () => {
  return (
    <div className="container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="chat-area">
          <ChatList />
        </div>
      </div>
    </div>
  );
};

export default TeamChatting;