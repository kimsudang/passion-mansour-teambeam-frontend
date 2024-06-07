'use client'

import React, { useState } from 'react';
import { inviteMember } from '../../../../_api/teamSetting';
import "./InviteMemberModal.scss";

interface InviteMemberModalProps {
  projectId: string;
  onClose: () => void;
  onInvite: (mail: string) => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ projectId, onClose, onInvite }) => {
  const [mail, setMail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(mail)) {
      setIsValidEmail(false);
      setMessage('유효한 이메일 주소를 입력하세요.');
      return;
    }

    setIsSubmitted(true);
    const result = await inviteMember(projectId, mail);
    setMessage(result.message);

    if (result.success) {
      onInvite(mail);
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if ((e.target as Element).classList.contains('inviteModal')) {
      onClose();
    }
  };

  return (
    <div className="inviteModal" onClick={handleModalClick}>
      <div className="inviteModalContent">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>팀원 초대</h2>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="mail"></label>
            <input 
              type="mail" 
              id="mail"
              value={mail} 
              onChange={(e) => {
                setMail(e.target.value);
                setIsValidEmail(true);
                setMessage('');
              }} 
              placeholder='mailAddress@example.com'
              required
            />
            {!isValidEmail && <p>유효한 이메일 주소를 입력하세요.</p>}
            <button type="submit">전송</button>
          </form>
        ) : (
          <div className="inviteModalContent">
            {isSubmitted && <p>메일이 성공적으로 전송되었습니다.</p>}
            {!isSubmitted && <p>메일 전송이 실패헀습니다.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteMemberModal;
