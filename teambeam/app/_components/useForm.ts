"use client";

import { useEffect, useState } from "react";

// useForm 훅의 props 인터페이스를 정의합니다.
interface IFormProps<T> {
  initialValues: T;
  onSubmit: (data: T) => void;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

// useForm 훅을 정의합니다.
function useForm<T>({ initialValues, onSubmit, validate }: IFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 폼 값 변경을 처리하는 함수입니다.
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  // 폼 제출을 처리하는 함수입니다.
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // 유효성 검사를 수행합니다.
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      // 유효성 검사에 실패하면 폼 제출을 중단합니다.
      if (Object.keys(validationErrors).length > 0) {
        setIsLoading(false);
        return;
      }
    }

    // 폼 제출을 처리합니다.
    onSubmit(values);
    setIsLoading(false);
  };

  return {
    values,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
  };
}

export default useForm;
