"use client";

import React, { useState } from "react";
import useForm from "@/app/_hooks/useForm";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/app/_api/api";
import "../layout.scss";

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
  const token = params.get("token");

  const handleSendCode = async () => {
    try {
      const response = await api.post(
        "/register-request",
        { mail: values.mail },
        { headers: { "Content-Type": "application/json" } }
      );
      const { code } = response.data;
      setServerCode(code);
      alert("인증 코드 전송 성공");
      setCodeConfirmed(false);
    } catch (error) {
      alert("인증 코드 전송 실패");
    }
  };

  const handleConfirmCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (values.confirmMailCode === serverCode) {
      setCodeConfirmed(true);
      alert("인증 코드 확인 성공");
    } else {
      setCodeConfirmed(false);
      alert("인증 코드가 일치하지 않습니다.");
    }
  };

  const { values, errors, isLoading, handleChange, handleSubmit } =
    useForm<IFormValues>({
      initialValues: {
        memberName: "",
        mail: "",
        confirmMailCode: "",
        password: "",
        confirmPassword: "",
      },
      onSubmit: async (data) => {
        if (codeConfirmed) {
          try {
            const { memberName, mail, password } = data;
            await api.post(
              "/register",
              { memberName, mail, password, token },
              { headers: { "Content-Type": "application/json" } }
            );
            alert("회원가입 성공");
            router.push("/user/login");
          } catch (error) {
            alert("회원가입 실패");
            console.error("회원가입 실패:", error);
          }
        } else {
          alert("인증 코드가 확인되지 않았습니다.");
        }
      },
      validate: (values) => {
        const errors: Partial<Record<keyof IFormValues, string>> = {};
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
          errors.confirmMailCode =
            "인증 코드가 일치하지 않습니다. 다시 확인해주세요.";
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
    <div className='joinContainer'>
      <div className='joinBox'>
        <p className='pageTitle'>회원가입</p>
        <form onSubmit={handleSubmit}>
          <div className='emailJoinForm'>
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
            <div className='emailButton'>
              <input
                type='text'
                name='mail'
                placeholder='이메일를 입력해주세요.'
                value={values.mail}
                onChange={handleChange}
              />
              <button type='button' onClick={handleSendCode}>
                <p className='buttonName'>
                  인증코드
                  <br />
                  전송
                </p>
              </button>
              {errors.mail && <p className='error'>{errors.mail}</p>}
            </div>
            <div className='emailButton'>
              <input
                type='text'
                name='confirmMailCode'
                placeholder='전송받은 코드를 입력해주세요.'
                value={values.confirmMailCode}
                onChange={handleChange}
              />
              <button type='button' onClick={handleConfirmCode}>
                <p className='buttonName'>
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
            <button className='submitButton' type='submit' disabled={isLoading}>
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Join;
