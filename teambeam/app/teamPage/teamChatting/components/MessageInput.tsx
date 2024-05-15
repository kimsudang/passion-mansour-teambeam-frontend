use client;

import React, { useEffect, useRef } from 'react';
import Quill from 'quill';

const MessageInput: React.FC = () => {
  const quillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (quillRef.current) {
      const quill = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image']
          ]
        },
        placeholder: '메시지 입력...',
      });

      // Quill 인스턴스에 대한 추가 설정이나 이벤트 리스너를 여기에 배치할 수 있습니다.

      return () => {
        quill.off('text-change'); // 리스너 제거, 필요한 경우 추가적인 정리 로직 구현
      };
    }
  }, []);

  return <div ref={quillRef} />;
};

export default MessageInput;
