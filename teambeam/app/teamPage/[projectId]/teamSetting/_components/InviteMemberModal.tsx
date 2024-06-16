'use client'

import React, { useState } from 'react';
import { inviteMember } from '../../../../_api/teamSetting';
import "./TeamSettingModal.scss";

interface InviteMemberModalProps {
  projectId: string;
  onClose: () => void;
  onInvite: (mail: string) => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ projectId, onClose, onInvite }) => {
  const [mail, setMail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(mail)) {
      setIsValidEmail(false);
      return;
    }

    setIsSubmitted(true);
    const result = await inviteMember(projectId, mail);

    if (result.success) {
      setIsSuccess(true);
      onInvite(mail);
    }else {
      setIsSuccess(false);
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if ((e.target as Element).classList.contains('teamSettingModal')) {
      onClose();
    }
  };

  return (
    <div className="teamSettingModal" onClick={handleModalClick}>
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
              }} 
              placeholder='mailAddress@example.com'
              required
            />
            {!isValidEmail && <p>유효한 이메일 주소를 입력하세요.</p>}
            <button type="submit">전송</button>
          </form>
        ) : (
          <div className="inviteModalContent">
            {isSuccess ? (
              <p>메일이 성공적으로 전송되었습니다.</p>
            ) : (
              <p>메일 전송에 실패했습니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteMemberModal;
