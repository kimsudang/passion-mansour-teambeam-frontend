"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import "./AddModal.scss";

type FormType = {
  title: string;
  content: string;
};

const token = `eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhIiwiaWF0IjoxNzE2Mzg1MDc5LCJleHAiOjE3MTYzODU2Nzl9.qy-6-3HczlDCoN-jyWHI2Mzj7MpyFYfYqQHYAv8nYY8J2b3hAvOsHoplYzQss4S3torLahL4rMRaYcGuzHhI8A`;

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

  const onCancelBtn = useCallback(() => {}, []);

  const onSubmit = useCallback(async () => {
    // "use server";

    console.log("title : ", form.title);
    console.log("content : ", form.content);
    console.log("token", token);

    /*
    axios
      .post(
        "http://34.22.108.250:8080/api/project",
        {
          projectName: form.title,
          description: form.content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            RefreshToken: `eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhIiwiaWF0IjoxNzE2Mzg1MDc5LCJleHAiOjE3MTY5ODk4Nzl9.oAowrexnXs5b1MIO-UlIT-PRKL7fotsUmc0eSB4j8kcsgK68bhJnQzf1hm_88jdCPfO34xSz2WxGxqIienJJ6w`,
          },
        }
      )
      .then((res) => {
        if (res.status === 201) router.push("/teamPage/main");
      })
      .catch((err) => console.log(err));
      */
  }, [form]);

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
