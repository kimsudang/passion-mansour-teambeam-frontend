'use client'

import React, { useState } from "react";
import './layout.scss';

const SettingPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      setMessage("비밀번호는 영문, 숫자, 기호로 구성된 8자리 이상이어야 합니다.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    // API 호출 대신에 비밀번호 변경 성공 메시지 출력
    setMessage("비밀번호가 성공적으로 변경되었습니다.");
  };

  return (
    <div className="setting_password_container">
      <form onSubmit={handleSubmit}>
        <div className="setting_box">
          <p className="page_title">비밀번호 변경</p>
          <div>
            <label htmlFor="newPassword"></label>
            <input
              type="password"
              id="newPassword"
              placeholder="비밀번호를 입력해주세요."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword"></label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="비밀번호를 다시 입력해주세요."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {message && <p>{message}</p>}
          <button className="change_password" type="submit">
            비밀번호 변경하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingPassword;
