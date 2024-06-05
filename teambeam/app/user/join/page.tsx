"use client";

import React, { useState, useEffect } from "react";
import useForm from "../../_hooks/useForm";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import "./layout.scss";

interface IFormValues {
  memberName: string;
  mail: string;
  confirmMailCode: string;
  password: string;
  confirmPassword: string;
}

const Join: React.FC = () => {
  const [serverCode, setServerCode] = useState<string | null>(null);
  const [codeConfirmed, setCodeConfirmed] = useState<boolean>(false);
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token"); // 라우터에서 토큰을 가져옵니다.
  
  const handleSendCode = async () => {
    try {
      // axios를 사용하여 백엔드로 이메일과 코드를 전송
      const response = await axios.post('http://34.22.108.250:8080/api/register-request', 
      {mail: values.mail}, { headers: { "Content-Type": "application/json" }}
    );
      const { code } = response.data;
      setServerCode(code); // 백엔드에서 받은 인증 코드를 상태에 저장
      alert("인증 코드 전송 성공");
      setCodeConfirmed(false);
    } catch (error) {
      alert("인증 코드 전송 실패");
    }
  };

  const handleConfirmCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (values.confirmMailCode === serverCode) {
      setCodeConfirmed(true);
      console.log("인증 코드 확인 성공");
      alert("인증 코드 확인 성공");
    } else {
      setCodeConfirmed(false);
      console.error("인증 코드가 일치하지 않습니다.");
      alert("인증 코드가 일치하지 않습니다.");
    }
  };

  // useForm 훅을 사용하여 폼 상태와 유효성 검사 로직을 관리
  const { values, errors, isLoading, handleChange, handleSubmit } =
    useForm<IFormValues>({
      // 초기값
      initialValues: {
        memberName: "",
        mail: "",
        confirmMailCode: "",
        password: "",
        confirmPassword: "",
      },
      // 폼 제출 시 실행될 함수
      onSubmit: async (data) => {
        // 더미 데이터로 테스트하기 위해 콘솔에 출력합니다.
        if (codeConfirmed === true) {
          console.log("폼 데이터:", data);

          try {
            // 폼 데이터를 서버로 전송
            const {memberName, mail, password} = data;
            await axios.post('http://34.22.108.250:8080/api/register', 
            {memberName, mail, password, token},
            { headers: { "Content-Type": "application/json" }}
          );
            console.log("회원가입 성공");
            router.push("/user/login"); // 이동할 경로 지정
          } 
          catch (error) {
            console.error("회원가입 실패:", error);
          }
        } else {
          console.error("인증 코드가 확인되지 않았습니다.");
        }
      },

      validate: (values) => {
        const errors: Partial<Record<keyof IFormValues, string>> = {};
        // 유효성 검사 로직을 구현합니다.
        if (!values.memberName) {
          errors.memberName = "사용자 이름을 입력하세요.";
        }
        if (!values.mail) {
          errors.mail = "이메일을 입력하세요.";
        } else if (!/\S+@\S+\.\S+/.test(values.mail)) {
          errors.mail = "유효한 이메일 주소를 입력하세요.";
        }
        if (!values.confirmMailCode) {
          errors.confirmMailCode = "인증 코드를 입력하세요.";
        } else if (serverCode !== values.confirmMailCode) {
          errors.confirmMailCode = "인증 코드가 일치하지 않습니다. 다시 확인해주세요.";
        }
        if (!values.password) {
          errors.password =
            "소문자와 숫자, 기호로 구성된 비밀번호를 입력하세요.";
        } else {
          const passwordPattern =
            /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
          if (!passwordPattern.test(values.password)) {
            errors.password =
              "비밀번호는 최소 8자 이상, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.";
          }
        }
        if (values.password !== values.confirmPassword) {
          errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
        }
        if (codeConfirmed !== true) {
          errors.confirmPassword = "인증 코드를 확인해주세요.";
        }
        return errors;
      },
    });

  return (
    <div className='join_container'>
      <div className='join_box'>
        <p className='page_title'>회원가입</p>
        <form onSubmit={handleSubmit}>
          <div className='email_join_form'>
            <div>
              <input
                type='text'
                name='memberName'
                placeholder='이름을 입력해주세요.'
                value={values.memberName}
                onChange={handleChange}
              />
              {errors.memberName && (
                <p className='error'>{errors.memberName}</p>
              )}
            </div>
            <div className='email_button'>
              <input
                type='text'
                name='mail'
                placeholder='이메일를 입력해주세요.'
                value={values.mail}
                onChange={handleChange}
              />
              <button type='button' onClick={handleSendCode}>
                <p className='button_name' >
                  인증코드
                  <br />
                  전송
                </p>
              </button>
              {errors.mail && <p className='error'>{errors.mail}</p>}
            </div>
            <div className='email_button'>
              <input
                type='text'
                name='confirmMailCode'
                placeholder='전송받은 코드를 입력해주세요.'
                value={values.confirmMailCode}
                onChange={handleChange}
              />
              <button type='button' onClick={handleConfirmCode}>
                <p className='button_name'>
                  인증코드
                  <br />
                  확인
                </p>
              </button>
              {errors.confirmMailCode && (
                <p className='error'>{errors.confirmMailCode}</p>
              )}
            </div>
            <div>
              <input
                type='password'
                name='password'
                placeholder='비밀번호를 입력해주세요.'
                value={values.password}
                onChange={handleChange}
              />
              {errors.password && <p className='error'>{errors.password}</p>}
            </div>
            <div>
              <input
                type='password'
                name='confirmPassword'
                placeholder='비밀번호를 다시 입력해주세요.'
                value={values.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className='error'>{errors.confirmPassword}</p>
              )}
            </div>
            <button
              className='submit_button'
              type='submit'
              disabled={isLoading}
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Join;