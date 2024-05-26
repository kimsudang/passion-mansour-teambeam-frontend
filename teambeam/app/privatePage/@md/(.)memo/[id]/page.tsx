"use client";

import { MemoType } from "@/app/privatePage/memo/page";
import { useCallback, useState } from "react";
import "./MemoModal.scss";
import { useRouter } from "next/navigation";

const MemoViewModal = () => {
  const [memo, setMemo] = useState<MemoType>({
    memoId: 0,
    memoTitle: "제목입니다 1",
    memoContent: "메모내용 입니다",
    createDate: "2024-05-12 05:34:11",
    updateDate: "2024-05-12 05:34:11",
  });

  const router = useRouter();

  const onCancelBtn = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className='modal-bg'>
      <div className='modal-wrap'>
        <div className='modal-header'>
          <span>{memo.createDate}</span>
          <h2>{memo.memoTitle}</h2>
        </div>

        <div className='modal-body'>
          <p>{memo.memoContent}</p>
        </div>

        <div className='buttons'>
          <button onClick={onCancelBtn} className='closeBtn'>
            닫기
          </button>
          {/* <button>수정</button> */}
        </div>
      </div>
    </div>
  );
};

export default MemoViewModal;
