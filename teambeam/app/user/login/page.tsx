"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./layout.scss";
import useForm from "../../_hooks/useForm";
import { LoginUser } from "./_components/LoginForm";
import ForgotPasswordModal from "../_components/ForgotPasswordModal";

interface ILoginForm {
  mail: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  // 카카오 로그인 환경변수
  // const CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  // const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  // 이메일 로그인
  const { values, errors, isLoading, handleChange, handleSubmit } =
    useForm<ILoginForm>({
      initialValues: { mail: "", password: "" },
      onSubmit: async (data) => {
        const result = await LoginUser(data);
        if (result.success) {
          alert("로그인에 성공했습니다.");
          router.push("/main");
        } else {
          alert(result.message);
        }
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

  // 카카오 로그인

  // 비밀번호 변경 모달
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='loginContainer'>
      <div className='loginBox'>
        <div className='emailLogin'>
          <p className='pageTitle'>로그인</p>
          <form onSubmit={handleSubmit}>
            <div className='emailLoginForm'>
              <input
                className='submitEmail'
                type='text'
                name='mail'
                value={values.mail}
                onChange={handleChange}
                placeholder='이메일를 입력해주세요.'
              ></input>
              {errors.mail && <p className='warningMsg'>{errors.mail}</p>}
              <br />
              <input
                className='submitPassword'
                type='password'
                name='password'
                value={values.password}
                onChange={handleChange}
                placeholder='비밀번호를 입력해주세요.'
              ></input>
              {errors.password && (
                <p className='warningMsg'>{errors.password}</p>
              )}
            </div>
            <button
              className='loginWithEmail'
              type='submit'
              disabled={isLoading}
            >
              로그인
            </button>
          </form>
          <br />
          <Link className='pageLink' href='/user/join'>
            회원가입
          </Link>
          <Link className='pageLink' href='#' onClick={openModal}>
            비밀번호 찾기
          </Link>
        </div>
        <div className='kakaoLogin'>
          <p className='orText'>또는</p>
          <button className='loginWithKakao'>카카오로 로그인하기</button>
        </div>
      </div>
      {isModalOpen && <ForgotPasswordModal onClose={closeModal} />}
    </div>
  );
};

export default Login;
