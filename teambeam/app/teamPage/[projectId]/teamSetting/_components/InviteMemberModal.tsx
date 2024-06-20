import React, { useState, useEffect } from "react";
import { inviteMember } from "../../../../_api/teamSetting";
import "./TeamSettingModal.scss";

interface InviteMemberModalProps {
  projectId: string;
  onClose: () => void;
  onInvite: (mail: string) => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  projectId,
  onClose,
  onInvite,
}) => {
  const [mail, setMail] = useState("");
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
      console.log("Invalid email:", mail);
      return;
    }

    console.log("Submitting email:", mail);
    const result = await inviteMember(projectId, mail);

    console.log("Invite member result:", result);

    if (result.success) {
      setIsSuccess(true);
      onInvite(mail);
    } else {
      setIsSuccess(false);
    }
    setIsSubmitted(true);
    console.log("After setting - isSubmitted:", true);
    console.log("After setting - isSuccess:", result.success);
  };

  useEffect(() => {
    console.log("Rendering - isSubmitted:", isSubmitted);
    console.log("Rendering - isSuccess:", isSuccess);
  }, [isSubmitted, isSuccess]);

  const handleModalClick = (e: React.MouseEvent) => {
    if ((e.target as Element).classList.contains("teamSettingModal")) {
      onClose();
    }
  };

  return (
    <div className="teamSettingModal" onClick={handleModalClick}>
      <div className="inviteModalContent">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>팀원 초대</h2>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="mail">이메일</label>
            <input
              type="email"
              id="mail"
              value={mail}
              onChange={(e) => {
                setMail(e.target.value);
                setIsValidEmail(true);
              }}
              placeholder="mailAddress@example.com"
              required
            />
            {!isValidEmail && <p>유효한 이메일 주소를 입력하세요.</p>}
            <button type="submit">전송</button>
          </form>
        ) : (
          <div className="inviteModalResult">
            {isSuccess ? (
              <p>메일이 성공적으로 전송되었습니다.</p>
            ) : (
              <p>메일 전송에 실패했습니다.</p>
            )}
            <button
              onClick={() => {
                setIsSubmitted(false); // 상태 초기화
                setMail(""); // 입력 필드 초기화
                setIsValidEmail(true); // 이메일 유효성 초기화
              }}
            >
              다시 시도
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteMemberModal;
