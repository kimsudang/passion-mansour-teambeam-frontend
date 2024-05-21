import React from "react";
import Link from "next/link";
import './layout.scss'; 

const Login = () => {
  return (
  <div className="login_container">
    <div className="login_box">
      <div className="email_login">
        <p className="page_title">로그인</p>
        <form>
          <div className="email_login_form">
            <input className="submit_email" type="text" name="useremail" placeholder="이메일를 입력해주세요."></input>
            <br />
            <input className="submit_password" type="text" name="password" placeholder="비밀번호를 입력해주세요."></input>
          </div>
        </form>
        <Link className="page_link" href="/user/join">회원가입</Link>
        <Link className="page_link" href="/user/settingPassword">비밀번호 찾기</Link>
        <br />
        <button className="login_with_email">로그인</button>
      </div>
      <div className="kakao_login">
        <p className="or_text">또는</p>
        <button className="login_with_kakao">카카오로 로그인하기</button>
      </div>
    </div>
  </div>
  );
};

export default Login;