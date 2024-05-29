'use client'

import React, { useState } from 'react';
import axios from 'axios';

interface ForgotPasswordModalProps {
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/request-reset-password', { email });
      setMessage('비밀번호 변경 링크가 이메일로 전송되었습니다.');
    } catch (error) {
      setMessage('이메일 전송에 실패했습니다.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal_content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>비밀번호 찾기</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">이메일:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <button type="submit">전송</button>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
