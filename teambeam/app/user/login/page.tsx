"use client"

import React from "react";
import Link from "next/link";
import './layout.scss'; 
import useForm from "./../../_components/useForm";

interface ILoginForm {
  mail: string;
  password: string;
}

const Login: React.FC = () => {
  const { values, errors, isLoading, handleChange, handleSubmit } = useForm<ILoginForm>({
    initialValues: { mail: "", password: "" },
    onSubmit: (data) => {
      // 더미 데이터로 테스트하기 위해 콘솔에 출력합니다.
      console.log("폼 데이터:", data);
      
      // 이메일과 비밀번호만을 추출하여 콘솔에 출력합니다.
      // const { mail, password } = data;
      // console.log("추출한 데이터:", { mail, password });
    },
    validate: (values) => {
      const errors: Partial<Record<keyof ILoginForm, string>> = {};
      // 유효성 검사 로직을 구현합니다.
      if (!values.mail) {
        errors.mail = "이메일을 입력하세요.";
      } else if (!/\S+@\S+\.\S+/.test(values.mail)) {
        errors.mail = "유효한 이메일 주소를 입력하세요.";
      }
      if (!values.password) {
        errors.password = "비밀번호를 입력하세요.";
      }
      return errors;
    },
  });

  return (
  <div className="login_container">
    <div className="login_box">
      <div className="email_login">
        <p className="page_title">로그인</p>
        <form onSubmit={handleSubmit}>
          <div className="email_login_form">
            <input className="submit_email" type="text" name="mail" value={values.mail} onChange={handleChange} placeholder="이메일를 입력해주세요."></input>
            {errors.mail && <p className="warning_msg">{errors.mail}</p>}
            <br />
            <input className="submit_password" type="text" name="password" value={values.password} onChange={handleChange} placeholder="비밀번호를 입력해주세요."></input>
            {errors.password && <p className="warning_msg">{errors.password}</p>}
          </div>
          <button className="login_with_email" type="submit" disabled={isLoading}>로그인</button>
        </form>        
        <br />
        <Link className="page_link" href="/user/join">회원가입</Link>
        <Link className="page_link" href="/user/settingPassword">비밀번호 찾기</Link>
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