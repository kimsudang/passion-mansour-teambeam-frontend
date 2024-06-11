"use client";

import React, {useState, useEffect} from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import "./layout.scss";
import useForm from "../../_hooks/useForm";
import ForgotPasswordModal from "../_components/ForgotPasswordModal";

interface ILoginForm {
  mail: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  // 이메일 로그인
  const { values, errors, isLoading, handleChange, handleSubmit } =
    useForm<ILoginForm>({
      initialValues: { mail: "", password: "" },
      onSubmit: async (data) => {
        try {
          const response = await axios.post("http://34.22.108.250:8080/api/login", data);

          // 헤더에서 토큰 추출
          const authorizationToken = response?.headers['authorization'];
          const refreshToken = response?.headers['refreshtoken'];

          // 본문에서 데이터 추출
          const { message, memberId } = response.data;

          // 토큰 및 사용자 정보 저장
          if (authorizationToken && refreshToken) {
            localStorage.setItem("Authorization", authorizationToken);
            localStorage.setItem("RefreshToken", refreshToken);
            localStorage.setItem("MemberId", memberId);

            console.log(message);  // "로그인 성공" 메시지 출력
            alert("로그인 성공");
            // 로그인 성공 시 대시보드 페이지로 이동
            router.push('/main');
          } else {
            console.error("로그인에 필요한 토큰이 누락되었습니다.");
          }
        } catch (error) {
          console.error("로그인 요청 실패:", error);
          alert("이메일 혹은 비밀번호가 일치하지 않습니다.");
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
    }
  );

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
          <Link className='pageLink' href="#" onClick={openModal}>
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
