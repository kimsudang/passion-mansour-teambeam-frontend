'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchMemberInfo, 
  handleUpdateMemberInfo, 
  handleSubmitPasswordChange, 
  handleConfirmMailCode, 
  handleMailChange,
  Member, deleteAccount } from '@/app/_api/mySetting';
import ProfileImageModal, { ProfileImageModalProps} from './_components/ChangeProfileImageModal';
import "./layout.scss";

const PrivateSetting = () => {
  const router = useRouter();
  const [memberInfo, setMemberInfo] = useState<Member>({
    memberId: 0,
    memberName: "",
    mail: "",
    startPage: "",
    notificationCount: 0,
    profileImage: "",
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mail, setMail] = useState("");
  const [serverCode, setServerCode] = useState<string | null>(null);
  const [confirmMailCode, setConfirmMailCode] = useState("");
  const [codeConfirmed, setCodeConfirmed] = useState<boolean>(false);
  const [message, setMessage] = useState("");

  const [accessToken, setAccessToken] = useState<string | null>(null); 
  const [refreshToken, setRefreshToken] = useState<string | null>(null); 

  const [startPage, setStartPage] = useState(memberInfo.startPage);
  const [memberName, setMemberName] = useState(memberInfo.memberName);
  const [newProfileImage, setNewProfileImage] = useState("");
  const [profileImage, setProfileImage] = useState(memberInfo.profileImage);
  const [imageInfo, setImageInfo] = useState<ProfileImageModalProps>();
  const [imageChagne, setImageChange] = useState(false);
  const [screenMode, setScreenMode] = useState(() => localStorage.getItem('screenMode') || "light");

  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const loadMemberInfo = async () => {
      try {
        const accessToken = localStorage.getItem("Authorization");
        const refreshToken = localStorage.getItem("RefreshToken");
  
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
  
        const memberData = await fetchMemberInfo();
        setMemberInfo(memberData);

        const initialStartPage = startPage || "PROJECT_SELECTION_PAGE";
        setStartPage(initialStartPage);

        setMemberName(memberData.memberName || memberInfo.memberName);
        setProfileImage(profileImage || memberInfo.profileImage);

      } catch (error) {
        console.error('Error fetching member info:', error);
        alert('회원 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };

    const loadScreenMode = () => {
      localStorage.setItem('screenMode', screenMode);
      const savedScreenMode = localStorage.getItem('screenMode');
      if (savedScreenMode) {
        setScreenMode(savedScreenMode);
      }
    };
  
    loadMemberInfo();
    loadScreenMode();
  }, [startPage, memberInfo.memberName, profileImage, memberInfo.profileImage, screenMode]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const updateProfileImage = (image: string, imageName: string) => {
    setNewProfileImage(image);
    setProfileImage(imageName);
    setMemberInfo((prevState) => ({
      ...prevState,
      profileImage: imageName,
    }));
    console.log("imageName: ", imageName);
    setImageChange(true);
  };

  // 회원 탈퇴 처리 함수
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      alert('회원 탈퇴가 완료되었습니다.');
      localStorage.clear();
      router.push('/');
    } catch (error) {
      alert('회원 탈퇴에 실패했습니다.');
    }
  };

  const handleModeChange = (mode: string) => {
    setScreenMode(mode);
    localStorage.setItem('screenMode', mode);
  };

  return (
    <div className='mySettingContainer'>
       {showModal && <ProfileImageModal closeModal={closeModal} updateProfileImage={updateProfileImage} />}
      <div className='layoutContainer'>
        <div className="title">
          <h2>정보 관리</h2>
        </div>
        <div className="otherInfo">
          <div className="profileImgArea">
            {!imageChagne ? (
              <Image 
                src={`data:image/png;base64,${memberInfo.profileImage}`} 
                alt={`${memberInfo.memberName} profile`} 
                className="memberProfileImage" 
                width={200} 
                height={200}
              /> 
            ) : (
              <Image 
                src={`data:image/png;base64,${newProfileImage}`} 
                alt={`${memberInfo.memberName} profile`} 
                className="memberProfileImage" 
                width={200} 
                height={200}
              /> 
            )}
            <button className="changeImage" onClick={openModal}>프로필 이미지 변경하기</button>
          </div>
          <div className="subInfo">
            <div className="settingName">
              <p className="pageTitle">이름 : </p>
              <input
                type="text" 
                id="memberName"
                name="memberName"
                placeholder={memberInfo.memberName}
                onChange={(e) => setMemberName(e.target.value)}
              />
            </div>
            <div className="pageSettings">
              <p className="pageTitle">페이지 설정</p>
              <div>
                <label>
                <input 
                    type="radio" 
                    name="initialStartPage" 
                    value="PROJECT_SELECTION_PAGE" 
                    checked={startPage === "PROJECT_SELECTION_PAGE"} 
                    onChange={(e) => setStartPage(e.target.value)} 
                  />
                  팀 대시보드
                </label>
              </div>
              <div>
                <label>
                  <input 
                    type="radio" 
                    name="initialStartPage" 
                    value="MY_PAGE" 
                    checked={startPage === "MY_PAGE"} 
                    onChange={(e) => setStartPage(e.target.value)} 
                  />
                  개인 대시보드
                </label>
              </div>
            </div>
            <div className="pageSettings">
              <p className="pageTitle">화면 설정</p>
              <div>
                <label>
                  <input 
                    type="radio" 
                    name="screenMode" 
                    value="light" 
                    checked={screenMode === "light"} 
                    onChange={() => handleModeChange("light")} 
                  />
                  라이트모드 (default)
                </label>
              </div>
              <div>
                <label>
                  <input 
                    type="radio" 
                    name="screenMode" 
                    value="dark" 
                    checked={screenMode === "dark"} 
                    onChange={() => handleModeChange("dark")} 
                  />
                  다크모드
                </label>
              </div>
            </div>
            <form className="mailArea">
              <div>
                <span>현재 메일 주소: </span>
                <span>{memberInfo.mail}</span>
                <div>
                <label htmlFor="mail"></label>
                  <input 
                    type="email" 
                    id="mail" 
                    placeholder="변경할 메일주소를 입력해주세요."
                    value={mail}
                    onChange={(e) => setMail(e.target.value)} />
                  <button type="button" className="changeMail" onClick={() => handleMailChange(mail, setServerCode, accessToken)}>코드 발급</button>
                </div>
                <div>
                  <label htmlFor="confirmMailCode"></label>
                  <input 
                    type="text" 
                    id="confirmMailCode" 
                    placeholder="발급받은 코드를 입력해주세요."
                    value={confirmMailCode}
                    onChange={(e) => setConfirmMailCode(e.target.value)} />
                  <button type="button" className="changeMail" onClick={(e) => handleConfirmMailCode(e, confirmMailCode, serverCode, setCodeConfirmed)}>코드 확인</button>
                </div>
              </div>
              <button type="button" className="changePart" onClick={() => handleUpdateMemberInfo(memberName, mail, profileImage, startPage, codeConfirmed, memberInfo, setMemberInfo, setCodeConfirmed)}>변경한 정보 수정하기</button>
            </form>
          </div>
        </div>
        <div className="changePassword">
          <form onSubmit={(e) => handleSubmitPasswordChange(e, oldPassword, newPassword, confirmPassword, setMessage)}>
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
        <button className="deleteAccount" onClick={() => handleDeleteAccount()}>회원탈퇴</button>
      </div>
    </div>
  );
};

export default PrivateSetting;