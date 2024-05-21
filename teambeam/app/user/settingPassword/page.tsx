import React from "react";
import './layout.scss';

const SettingPassword = () => {
  return (
    <div className="setting_password_container">
      <form>
        <div className="setting_box">
          <p className="page_title">비밀번호 변경</p>
          <input type="text" name="password" placeholder="비밀번호를 입력해주세요." />
          <p className="warning_msg">오류 로그</p>
          <input type="text" name="check_password" placeholder="비밀번호를 다시 입력해주세요." />
          <p className="warning_msg">오류 로그</p>
        <button className="change_password">비밀번호 변경하기</button>
      </div>
      </form>
    </div>
  );
};

export default SettingPassword;
