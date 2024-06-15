"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import "@/app/_styles/AddModal.scss";
import { postPorject } from "@/app/_api/project";

type FormType = {
  title: string;
  content: string;
};

export default function AddModal({
  onCloseModal,
}: {
  onCloseModal: () => void;
}) {
  const [form, setForm] = useState<FormType>({
    title: "",
    content: "",
  });

  const router = useRouter();

  const titleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, title: e.target.value });
    },
    [form]
  );

  const contentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setForm({ ...form, content: e.target.value });
    },
    [form]
  );

  const onSubmit = useCallback(async () => {
    try {
      const res = await postPorject("/project", form);

      alert("프로젝트 생성이 완료되었습니다.");
      router.push(`/teamPage/${res.data.project.projectId}/teamMain`);
    } catch (err) {
      console.log("err  : ", err);
      alert("프로젝트 생성에 문제가 발생했습니다");
    }
  }, [form, router]);

  return (
    <div className='modal-bg'>
      <div className='modal-wrap'>
        <form action={onSubmit}>
          <div className='modal-header'>
            <h2>새 프로젝트 생성</h2>
          </div>

          <div className='modal-content'>
            <input
              type='text'
              value={form.title}
              onChange={titleChange}
              placeholder='제목을 입력하세요'
            />
            <textarea
              value={form.content}
              onChange={contentChange}
              placeholder='내용을 입력하세요'
            ></textarea>
          </div>

          <div className='buttons'>
            <button onClick={onCloseModal}>닫기</button>
            <button type='submit'>등록</button>
          </div>
        </form>
      </div>
    </div>
  );
}
