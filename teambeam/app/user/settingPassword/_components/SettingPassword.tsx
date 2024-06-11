"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "../layout.scss";
import api from "@/app/_api/api";

const SettingPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setToken(token);
    } else {
      alert("유효하지 않은 토큰입니다.");
      router.push("/user/login");
    }
  }, [searchParams, router]);

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      setMessage(
        "비밀번호는 영문, 숫자, 기호로 구성된 8자리 이상이어야 합니다."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await api.post("/reset-password", {
        token,
        newPassword,
      });
      setMessage("비밀번호가 성공적으로 변경되었습니다.");
      alert("비밀번호가 수정되었습니다.");
      router.push("/user/login");
    } catch (error) {
      setMessage("비밀번호 변경 중 오류가 발생했습니다.");
      alert("비밀번호 수정 중 오류가 발생했습니다.");
      console.error("Error:", error);
      router.push("/user/login");
    }
  };

  return (
    <div className='setting_password_container'>
      <form onSubmit={handleSubmit}>
        <div className='setting_box'>
          <p className='page_title'>비밀번호 변경</p>
          <div>
            <label htmlFor='newPassword'></label>
            <input
              type='password'
              id='newPassword'
              placeholder='비밀번호를 입력해주세요.'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='confirmPassword'></label>
            <input
              type='password'
              id='confirmPassword'
              placeholder='비밀번호를 다시 입력해주세요.'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {message && <p className='warning_msg'>{message}</p>}
          <button className='change_password' type='submit'>
            비밀번호 변경하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingPassword;
