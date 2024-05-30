"use client";

import { MemoType } from "@/app/privatePage/memo/page";
import { useCallback, useEffect, useState } from "react";
import "./MemoModal.scss";
import { useParams, useRouter } from "next/navigation";
import { getMemoList, deleteMemo, editMemo } from "@/app/_api/memo";

type MemoAddType = {
  memoTitle: string;
  memoContent: string;
};
const MemoViewModal = () => {
  const [form, setForm] = useState<MemoAddType>({
    memoTitle: "",
    memoContent: "",
  });
  const [memo, setMemo] = useState<MemoType | undefined>();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const router = useRouter();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMemoList(`/my/memo/${params.id}`);
        console.log("res : ", res);

        setMemo(res.data);
        setForm({
          memoTitle: res.data.memoTitle,
          memoContent: res.data.memoContent,
        });
      } catch (err) {
        console.log("err  : ", err);
      }
    };

    fetchData();
  }, [params]);

  const onCancelBtn = useCallback(() => {
    router.back();
  }, [router]);

  // 메모 수정 모드
  const handleMemoEdit = useCallback(() => {
    setIsEdit(true);
  }, []);

  // 메모 삭제
  const handleMemoDelete = useCallback(async () => {
    try {
      const res = await deleteMemo(`/my/memo/${params.id}`);

      console.log("memo delete : ", res.data);

      alert("삭제 되었습니다");
      onCancelBtn();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, memoTitle: e.target.value });
    },
    [form]
  );

  const handleContent = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setForm({ ...form, memoContent: e.target.value });
    },
    [form]
  );

  // 메모 수정
  const onSubmit = useCallback(async () => {
    const data = {
      memoTitle: form.memoTitle,
      memoContent: form.memoContent,
    };

    try {
      const res = await editMemo(`/my/memo/${params.id}`, data);

      console.log("memo edit : ", res);

      alert("수정 되었습니다");
      setMemo(res.data);
      setIsEdit(false);
    } catch (err) {
      console.log(err);
    }
  }, [form, params]);

  if (isEdit) {
    return (
      <div className='modal-bg'>
        <div className='modal-wrap'>
          {memo !== undefined ? (
            <form action={onSubmit}>
              <div className='modal-header'>
                <input
                  type='text'
                  value={form.memoTitle}
                  onChange={handleTitle}
                />
              </div>

              <div className='modal-body'>
                <textarea value={form.memoContent} onChange={handleContent} />
              </div>

              <div className='buttons'>
                <button type='submit'>수정</button>
                <button type='button' onClick={onCancelBtn}>
                  취소
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    );
  } else {
    return (
      <div className='modal-bg'>
        <div className='modal-wrap'>
          {memo !== undefined ? (
            <>
              <div className='modal-header'>
                <span>{memo?.createDate}</span>
                <h2>{memo.memoTitle}</h2>
              </div>

              <div className='modal-body'>
                <p>{memo.memoContent}</p>
              </div>

              <div className='buttons'>
                <button onClick={onCancelBtn} className='closeBtn'>
                  닫기
                </button>
                <button type='button' onClick={handleMemoEdit}>
                  수정
                </button>
                <button type='button' onClick={handleMemoDelete}>
                  삭제
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
  }
};

export default MemoViewModal;
