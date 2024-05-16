import React from 'react';
import MessageThread from './MessageThread';

const ChatList: React.FC = () => {
  const messages = [
    {
      id: '1-1',
      text: '홍길동의 메세지입니다.',
      profilePicture: 'https://via.placeholder.com/40',
      username: '홍길동',
      timestamp: '2024-05-16 14:31',
    },
    {
      id: '1-2',
      text: '고길동의 메세지입니다.',
      profilePicture: 'https://via.placeholder.com/40',
      username: '고길동',
      timestamp: '2024-05-16 14:35',
    },
  ];

  return (
    <div className="chat-area">
      <MessageThread messageId="1" messages={messages} />
      {/* 여기에 추가적인 메시지 스레드 컴포넌트가 위치할 수 있습니다. */}
    </div>
  );
};

export default ChatList;
