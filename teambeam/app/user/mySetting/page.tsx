'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./layout.scss";

interface Member {
  memberId: number;
  memberName: string;
  mail: string;
  startPage: string;
  notificationCount: number;
  profileImage: string;
}

const PrivateSetting = () => {
  const router = useRouter();
  const [memberInfo, setMemberInfo] = useState<Member>({
    memberId: 0,
    memberName: "",
    mail: "",
    startPage: "",
    notificationCount: 0,
    profileImage: ""
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mail, setMail] = useState("");
  const [serverCode, setServerCode] = useState<string | null>(null);
  const [confirmMailCode, setConfirmMailCode] = useState("");
  const [codeConfirmed, setCodeConfirmed] = useState<boolean>(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem('Authorization');
    const refreshToken = localStorage.getItem('RefreshToken');
    const headers = {
      'Authorization': `${accessToken}`,
      'RefreshToken': `${refreshToken}`
    };

    // 회원 정보를 가져오는 함수
    const fetchMemberInfo = async () => {
      try {
        const response = await axios.get("http://34.22.108.250:8080/api/member", { headers });
        setMemberInfo(response.data.member);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching member info:", error);
        alert("회원 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchMemberInfo();
  }, []);

  // 메일 변경 메일 전송
  const handleMailChange = async () => {
    try {
      const accessToken = localStorage.getItem('Authorization');
      const refreshToken = localStorage.getItem('RefreshToken');
      const headers = {
        'Authorization': `${accessToken}`,
        'RefreshToken': `${refreshToken}`
      };
      const response = await axios.post("http://34.22.108.250:8080/api/member/mail", {
        mail
      }, { headers });

      if (response.status === 200) {
        alert("코드가 발송되었습니다. 확인 후 입력해주세요.");
        const { code } = response.data;
        setServerCode(code); // 백엔드에서 받은 인증 코드를 상태에 저장
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        alert("이미 사용 중인 이메일입니다.");
      } else {
        console.error("메일 변경 요청 중 오류 발생:", error);
        alert("메일 변경 요청 중 오류가 발생했습니다.");
      }
    }
  };

  // 인증 코드 확인하기
  const handleConfirmMailCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (confirmMailCode === serverCode) {
      setCodeConfirmed(true);
      alert("인증 코드 확인 성공");
    } else {
      setCodeConfirmed(false);
      alert("인증 코드가 일치하지 않습니다.");
    }
  };

  // 회원 정보 수정하기
  const handleUpdateMemberInfo = async () => {
    if (codeConfirmed) {
      try {
        const accessToken = localStorage.getItem('Authorization');
        const refreshToken = localStorage.getItem('RefreshToken');
        const headers = {
          'Authorization': `${accessToken}`,
          'RefreshToken': `${refreshToken}`
        };

        // 회원 정보를 수정하는 API 호출
        const response = await axios.patch("http://34.22.108.250:8080/api/member", {
          memberName: memberInfo.memberName, // 현재 값을 유지
          mail, 
          profileImage: memberInfo.profileImage,// 현재 값을 유지
          startPage: memberInfo.startPage || "MY_PAGE"  // 현재 값을 유지
        }, { headers });

        const newAuthorizationToken = response?.headers['authorization'];
        const newRefreshToken = response?.headers['refreshtoken'];

        if (response.status === 200 && newAuthorizationToken && newRefreshToken) {
          localStorage.setItem("Authorization", newAuthorizationToken);
            localStorage.setItem("RefreshToken", newRefreshToken);
          setMemberInfo(response.data.updatedMember);
          alert("회원 정보가 성공적으로 수정되었습니다.");
          window.location.reload();
        }
      } catch (error) {
        console.error("회원 정보 수정 중 오류 발생:", error);
        alert("회원 정보 수정 중 오류가 발생했습니다.");
      }
    }
  };
  
  // 비밀번호 수정 기능
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      setMessage("비밀번호는 영문, 숫자, 기호로 구성된 8자리 이상이어야 합니다.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const accessToken = localStorage.getItem('Authorization');
      const refreshToken = localStorage.getItem('RefreshToken');
      const headers = {
        'Authorization': `${accessToken}`,
        'RefreshToken': `${refreshToken}`
      };

      axios.patch("http://34.22.108.250:8080/api/member/password", {
        oldPassword,
        newPassword,
      }, { headers });
      alert("비밀번호가 변경되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("비밀번호 변경과정에서 오류가 발생했습니다.");
    }
  };

  // 회원 탈퇴 기능
  const handleDeleteAccount = async () => {
    try {
      const accessToken = localStorage.getItem('Authorization');
      const refreshToken = localStorage.getItem('RefreshToken');

      // 요청 헤더에 토큰 추가
      const headers = {
        'Authorization': `${accessToken}`,
        'RefreshToken': `${refreshToken}`
      };

      await axios.delete("http://34.22.108.250:8080/api/member", { headers });
      
      alert("회원 탙퇴가 완료되었습니다.");
      localStorage.clear();
      router.push("/");
    } catch (error) {
      alert("회원 탙퇴에 실패했습니다.");
      console.error("Error:", error);
    }
  }

  return (
    <div className='mySettingContainer'>
      <div className='layoutContainer'>
        <div className="title">
          <h2>정보 관리</h2>
        </div>
        <div className="otherInfo">
          <div className="profileImgArea">
            <p>이미지</p>
          </div>
          <div className="subInfo">
            <span className="name">이름 : </span>
            <span>{memberInfo.memberName}</span>
            <hr />
            <form className="mailArea">
            <p className="pageTitle">메일 주소 수정</p>
              <div>
                <span>메일 주소: </span>
                <span>{memberInfo.mail}</span>
                <div>
                <label htmlFor="mail"></label>
                  <input 
                    type="email" 
                    id="mail" 
                    placeholder="변경할 메일주소를 입력해주세요."
                    value={mail}
                    onChange={(e) => setMail(e.target.value)} />
                  <button type="button" className="changeMail" onClick={handleMailChange}>코드 발급</button>
                </div>
                <div>
                  <label htmlFor="confirmMailCode"></label>
                  <input 
                    type="text" 
                    id="confirmMailCode" 
                    placeholder="발급받은 코드를 입력해주세요."
                    value={confirmMailCode}
                    onChange={(e) => setConfirmMailCode(e.target.value)} />
                  <button type="button" className="changeMail" onClick={handleConfirmMailCode}>코드 확인</button>
                </div>
              </div>
              <button type="button" className="changePart" onClick={handleUpdateMemberInfo}>수정하기</button>
            </form>
          </div>
        </div>
        <div className="changePassword">
        <hr />
          <form onSubmit={handleSubmit}>
            <div className="passwordArea">
              <div className="setting_box">
                <p className="pageTitle">비밀번호 변경</p>
                <div>
                  <label htmlFor="oldPassword"></label>
                  <input 
                    type="password" 
                    id="oldPassword" 
                    placeholder="현재 비밀번호를 입력해주세요."
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="newPassword"></label>
                  <input 
                    type="password" 
                    id="newPassword" 
                    placeholder="새 비밀번호를 입력해주세요."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="confirmPassword"></label>
                  <input 
                    type="password" 
                    id="confirmPassword"
                    placeholder="비밀번호를 다시 입력해주세요." 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                {message && <p className="warning_msg">{message}</p>}
                <button className="changePart" type="submit">비밀번호 변경하기</button>
              </div>
            </div>
          </form>
        </div>
        <button className="deleteAccount" onClick={handleDeleteAccount}>회원탈퇴</button>
      </div>
    </div>
  );
};

export default PrivateSetting;