import React from 'react';

const MessageInput: React.FC = () => {
  return (
    <div className="message-input">
      <input type="text" placeholder="메시지 입력..." />
      <button>보내기</button>
    </div>
  );
};

export default MessageInput;
