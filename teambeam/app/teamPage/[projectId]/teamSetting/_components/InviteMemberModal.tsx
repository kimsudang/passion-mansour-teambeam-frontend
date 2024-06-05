'use client'

import React, { useState } from 'react';
import axios from 'axios';
import "./InviteMemberModal.scss";

interface InviteMemberModalProps {
  projectId: string;
  onClose: () => void;
  onInvite: (mail: string) => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ projectId, onClose, onInvite }) => {
  const [mail, setMail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`http://34.22.108.250:8080/api/team/${projectId}/setting/member`, { mail }, {
        headers: {
          Authorization: localStorage.getItem('Authorization'),
          RefreshToken: localStorage.getItem('RefreshToken'),
        },
      });
      onInvite(mail);
      setMessage('메일 전송이 성공했습니다.');
    } catch (error) {
      setMessage('메일 전송에 실패했습니다.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="inviteModal">
      <div className="inviteModalContent">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>팀원 초대</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="mail"></label>
          <input 
            type="mail" 
            id="mail"
            value={mail} 
            onChange={(e) => setMail(e.target.value)} 
            required 
          />
          <button type="submit">전송</button>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;
