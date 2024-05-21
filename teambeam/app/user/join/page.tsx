import React from "react";
import Link from "next/link";
import './layout.scss'; 

const Join = () => {
  return (
  <div className="join_container">
    <div className="join_box">
      <p className="page_title">회원가입</p>
      <form>
        <div className="email_join_form">
          <div>
            <input type="text" name="username" placeholder="이름을 입력해주세요."></input>
            <p className="warning_msg">오류 로그</p>
          </div>
          <div className="email_button">
            <input type="text" name="useremail" placeholder="이메일를 입력해주세요."></input>
            <button>
              <p>
                인증코드
                <br />
                전송
              </p>
            </button>
            <p className="warning_msg">오류 로그</p>
          </div>
          <div className="email_button">
            <input type="text" name="check_email" placeholder="발급받은 코드를 입력해주세요."></input>
            <button>
              <p>
                인증코드
                <br />
                확인
              </p>
            </button>
            <p className="warning_msg">오류 로그</p>
          </div>
          <div>
            <input type="text" name="password" placeholder="비밀번호를 입력해주세요."></input>
            <p className="warning_msg">오류 로그</p>
          </div>
          <div>
            <input type="text" name="check_password" placeholder="비밀번호를 다시 입력해주세요."></input>
            <p className="warning_msg">오류 로그</p>
          </div>
          <button className="submit_button">회원가입</button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default Join;