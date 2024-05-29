"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Quill CSS를 임포트

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const MessageInput: React.FC<{ onSubmit: (content: string) => void }> = ({
  onSubmit,
}) => {
  const [editorContent, setEditorContent] = useState<string>("");

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleSubmit = () => {
    onSubmit(editorContent);
    setEditorContent("");
  };

  return (
    <div className="messageInput">
      <ReactQuill
        value={editorContent}
        onChange={handleEditorChange}
        className="quillEditor"
      />
      <button onClick={handleSubmit} className="submitButton">
        전송
      </button>
    </div>
  );
};

export default MessageInput;
