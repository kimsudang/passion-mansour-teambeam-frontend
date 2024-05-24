"use client";

import React from "react";
import useForm from "../../_hooks/useForm";
import "./layout.scss";

interface IFormValues {
  memberName: string;
  mail: string;
  confirmMail: string;
  password: string;
  confirmPassword: string;
}

const Join: React.FC = () => {
  const { values, errors, isLoading, handleChange, handleSubmit } =
    useForm<IFormValues>({
      initialValues: {
        memberName: "",
        mail: "",
        confirmMail: "",
        password: "",
        confirmPassword: "",
      },
      onSubmit: (data) => {
        // 더미 데이터로 테스트하기 위해 콘솔에 출력합니다.
        console.log("폼 데이터:", data);

        // 통신을 위한 정보만을 추출하여 콘솔에 출력합니다.
        // const { memberName, mail, confirmMail , password } = data;
        // console.log("추출한 데이터:", { memberName, mail, confirmMail , password });
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
        if (!values.confirmMail) {
          errors.confirmMail = "이메일을 입력하세요.";
        } else if (!/\S+@\S+\.\S+/.test(values.confirmMail)) {
          errors.confirmMail = "유효한 이메일 주소를 입력하세요.";
        }
        if (!values.password) {
          errors.password =
            "소문자와 숫자, 기호로 구성된 비밀번호를 입력하세요.";
        } else {
          const passwordPattern =
            /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
          if (!passwordPattern.test(values.password)) {
            errors.password =
              "비밀번호는 최소 8자 이상이어야 하며, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.";
          }
        }
        if (values.password !== values.confirmPassword) {
          errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
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
              <button>
                <p className='button_name'>
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
                name='confirmMail'
                placeholder='전송받은 코드를 입력해주세요.'
                value={values.confirmMail}
                onChange={handleChange}
              />
              <button>
                <p className='button_name'>
                  인증코드
                  <br />
                  확인
                </p>
              </button>
              {errors.confirmMail && (
                <p className='error'>{errors.confirmMail}</p>
              )}
            </div>
            <div>
              <input
                type='text'
                name='password'
                placeholder='비밀번호를 입력해주세요.'
                value={values.password}
                onChange={handleChange}
              />
              {errors.password && <p className='error'>{errors.password}</p>}
            </div>
            <div>
              <input
                type='text'
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
