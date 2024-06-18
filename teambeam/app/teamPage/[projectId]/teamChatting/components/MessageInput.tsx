"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Quill CSS를 임포트

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const MessageInput: React.FC<{ onSubmit: (content: string) => void }> = ({
  onSubmit,
}) => {
  const [editorContent, setEditorContent] = useState<string>("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    setIsSubmitDisabled(content.trim() === "");
  };

  const handleSubmit = () => {
    if (editorContent.trim()) {
      onSubmit(editorContent);
      setEditorContent("");
      setIsSubmitDisabled(true);
    }
  };

  return (
    <div className="messageInput">
      <ReactQuill
        value={editorContent}
        onChange={handleEditorChange}
        className="quillEditor"
        placeholder="댓글을 입력하세요"
      />
      <button
        onClick={handleSubmit}
        className="submitButton"
        disabled={isSubmitDisabled}
      >
        등록
      </button>
    </div>
  );
};

export default MessageInput;
