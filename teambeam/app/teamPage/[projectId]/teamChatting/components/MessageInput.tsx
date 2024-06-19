"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Quill CSS를 임포트

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const stripHtml = (html: string): string => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const isContentEmpty = (content: string): boolean => {
  const strippedContent = stripHtml(content).trim();
  return strippedContent === "";
};

const MessageInput: React.FC<{ onSubmit: (content: string) => void }> = ({
  onSubmit,
}) => {
  const [editorContent, setEditorContent] = useState<string>("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    setIsSubmitDisabled(isContentEmpty(content));
  };

  const handleBlur = () => {
    setIsSubmitDisabled(isContentEmpty(editorContent));
  };

  const handleSubmit = () => {
    if (!isContentEmpty(editorContent)) {
      onSubmit(editorContent);
      setEditorContent("");
      setIsSubmitDisabled(true);
    }
  };

  useEffect(() => {
    setIsSubmitDisabled(isContentEmpty(editorContent));
  }, [editorContent]);

  return (
    <div className="messageInput">
      <ReactQuill
        value={editorContent}
        onChange={handleEditorChange}
        onBlur={handleBlur}
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
