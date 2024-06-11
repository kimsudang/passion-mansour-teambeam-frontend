'use client'

import React, { useState, useEffect, useRef } from 'react';
import api from "@/app/_api/api";
import { useRouter } from 'next/navigation';
import './ForgotPasswordModal.scss';

interface ForgotPasswordModalProps {
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose }) => {
  const router = useRouter();
  const [mail, setMail] = useState('');
  const [message, setMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post('/password/send-reset-link', { mail });
      const url = response.data.url;
      
      setMessage('비밀번호 변경 링크가 이메일로 전송되었습니다.');
      alert("메일 전송이 성공했습니다.");
      router.push(url);
    } catch (error) {
      setMessage('이메일 전송에 실패했습니다.');
      console.error('Error:', error);
    }
  };

  // 모달 외부를 클릭했을 때 모달을 닫기 위한 함수
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <div className="modal">
      <div className="modal_content" ref={modalRef}>
        <span className="close" onClick={onClose}>&times;</span>
        <h2>비밀번호 찾기</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="mail"></label>
          <input 
            type="mail" 
            id="mail"
            value={mail} 
            onChange={(e) => setMail(e.target.value)} 
            placeholder="가입한 메일 주소를 입력해주세요."
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
