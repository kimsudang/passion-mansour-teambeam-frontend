'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./layout.scss";

interface MemberInfo {
  memberId: number;
  memberName: string;
  mail: string;
  startPage: string;
  profileImage: string;
  notificationCount: number;
  message: string;
}

const PrivateSetting = () => {
  const router = useRouter();
  const [memberInfo, setMemberInfo] = useState<MemberInfo>();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mail, setMail] = useState("");
  const [serverCode, setServerCode] = useState<string | null>(null);
  const [confirmMailCode, setConfirmMailCode] = useState("");
  const [codeConfirmed, setCodeConfirmed] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [mailMessage, setMailMessage] = useState("");
  const [changeMessage, setChangeMessage] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem('Authorization');
    const refreshToken = localStorage.getItem('RefreshToken');
    const headers = {
      'Authorization': `${accessToken}`,
      'RefreshToken': `${refreshToken}`
    };
    // 회원 정보를 가져오는 비동기 함수
    const fetchMemberInfo = async () => {
      try {
        // 회원 정보를 API로부터 가져옴
        const response = await axios.get("http://34.22.108.250:8080/api/member", { headers });
        setMemberInfo(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching member info:", error);  // 에러가 발생하면 콘솔에 출력
        setLoadingMessage("회원 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchMemberInfo();  // 컴포넌트가 마운트될 때 회원 정보를 가져오는 함수 호출
  }, []);


  console.log("memberInfo", memberInfo);
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
        setMailMessage("코드가 발송되었습니다. 확인 후 입력해주세요.");
        const { code } = response.data;
        setServerCode(code); // 백엔드에서 받은 인증 코드를 상태에 저장
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setMailMessage("이미 사용 중인 이메일입니다.");
      } else {
        console.error("메일 변경 요청 중 오류 발생:", error);
        setMailMessage("메일 변경 요청 중 오류가 발생했습니다.");
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
          memberName: memberInfo?.memberName, // 현재 값을 유지
          mail,
          profileImage: memberInfo?.profileImage || "",  // 현재 값을 유지
          startPage: memberInfo?.startPage || "MY_PAGE"  // 현재 값을 유지
        }, { headers });

        if (response.status === 200) {
          setChangeMessage("회원 정보가 성공적으로 수정되었습니다.");
          setMemberInfo(response.data.updatedMember);  // 응답 받은 수정된 회원 정보를 상태에 저장
        }
      } catch (error) {
        console.error("회원 정보 수정 중 오류 발생:", error);
        setChangeMessage("회원 정보 수정 중 오류가 발생했습니다.");
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
      setMessage("비밀번호가 성공적으로 변경되었습니다.");
      alert("비밀번호가 변경되었습니다.");
    } catch (error) {
      console.error("Error:", error);
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
  };

  // // 회원 정보가 로딩 중일 때 로딩 메시지 표시
  // if (!memberInfo) return <div>Loading...</div>;

  return (
    <div className='mySettingContainer'>
      <div className='layoutContainer'>
        <div className="title">
          <h2>정보 관리</h2>
        </div>
        <div className="otherInfo">
          <div className="profileImg">
            <p>이미지</p>
          </div>
          <div className="subInfo">
            <span>이름 : </span>
            <span>{memberInfo?.memberName}</span>
            <hr />
            <p className="pageTitle">메일 주소 수정</p>
            <form>
              <div>
                <span>메일 주소: </span>
                <span>{memberInfo?.mail}</span>
                <div>
                <label htmlFor="mail"></label>
                  <input 
                    type="email" 
                    id="mail" 
                    placeholder="변경할 메일주소를 입력해주세요."
                    value={mail}
                    onChange={(e) => setMail(e.target.value)} />
                    {mailMessage && <p className="warning_msg">{mailMessage}</p>}
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
                {changeMessage && <p className="warning_msg">{changeMessage}</p>}
              </div>
              <button type="button" className="changePart" onClick={handleUpdateMemberInfo}>수정하기</button>
              {loadingMessage && <p className="warning_msg">{loadingMessage}</p>}
            </form>
          </div>
        </div>
        <div className="changePassword">
          <form onSubmit={handleSubmit}>
            <div className="setting_box">
              <hr />
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
          </form>
        </div>
        <button className="deleteAccount" onClick={handleDeleteAccount}>회원탈퇴</button>
      </div>
    </div>
  );
};

export default PrivateSetting;