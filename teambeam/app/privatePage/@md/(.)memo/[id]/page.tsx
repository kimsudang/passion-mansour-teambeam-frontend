"use client";

import { MemoType } from "@/app/privatePage/memo/page";
import { useCallback, useEffect, useState } from "react";
import "./MemoModal.scss";
import { useParams, useRouter } from "next/navigation";
import { getMemoList, deleteMemo, editMemo } from "@/app/_api/memo";
import { DeleteBtnIcon, EditBtnIcon } from "@/app/_components/Icons";

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
        setMemo(res.data);
        setForm({
          memoTitle: res.data.memoTitle,
          memoContent: res.data.memoContent,
        });
      } catch (err) {
        console.log("err  : ", err);
        alert("메모 조회에 실패했습니다.");
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
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        const res = await deleteMemo(`/my/memo/${params.id}`);

        alert("메모가 삭제 되었습니다.");
        onCancelBtn();
      } catch (err) {
        console.log(err);
        alert("메모 삭제에 실패했습니다.");
      }
    } else {
      return;
    }
  }, [params, onCancelBtn]);

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

      alert("메모가 수정 되었습니다.");
      setMemo(res.data);
      setIsEdit(false);
    } catch (err) {
      console.log(err);
      alert("메모 수정에 실패했습니다.");
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
                  className='titleInput'
                  value={form.memoTitle}
                  onChange={handleTitle}
                />
              </div>

              <div className='modal-body'>
                <textarea
                  className='contentInput'
                  value={form.memoContent}
                  onChange={handleContent}
                />
              </div>

              <div className='utilButtons'>
                <button type='submit'>수정</button>
                <button type='button' onClick={() => setIsEdit(false)}>
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

              <div className='memoButtons'>
                <div className='utilBtn'>
                  <button
                    type='button'
                    className='deleteBtn'
                    onClick={handleMemoDelete}
                  >
                    <DeleteBtnIcon size={13} />
                  </button>
                  <button
                    type='button'
                    className='editBtn'
                    onClick={handleMemoEdit}
                  >
                    <EditBtnIcon size={14} />
                  </button>
                </div>
                <button onClick={onCancelBtn} className='closeBtn'>
                  닫기
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
