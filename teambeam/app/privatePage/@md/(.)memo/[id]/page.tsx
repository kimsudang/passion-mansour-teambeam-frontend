"use client";

import { MemoType } from "@/app/privatePage/memo/page";
import { useCallback, useEffect, useState } from "react";
import "./MemoModal.scss";
import { useParams, useRouter } from "next/navigation";
import { getMemoList } from "@/app/_api/memo";

const MemoViewModal = () => {
  const [memo, setMemo] = useState<MemoType | undefined>();

  const router = useRouter();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMemoList(`/my/memo/${params.id}`);
        console.log("res : ", res);

        setMemo(res.data);
      } catch (err) {
        console.log("err  : ", err);
      }
    };

    fetchData();
  }, [params]);

  const onCancelBtn = useCallback(() => {
    router.back();
  }, [router]);

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
              {/* <button>수정</button> */}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default MemoViewModal;
