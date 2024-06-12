"use client";

import React, { useState } from 'react';
import { createTag, TagInfo } from '../../../../_api/teamSetting';

interface AddTagModalProps {
  projectId: string;
  onClose: () => void;
  onTagAdded: () => void;
  existingTags: TagInfo[]; // 기존 태그 목록을 prop으로 받음
}

const AddTagModal: React.FC<AddTagModalProps> = ({ projectId, onClose, onTagAdded, existingTags }) => {
  const [tagName, setTagName] = useState('');
  const [tagCategory, setTagCategory] = useState('');

  const handleAddTag = async () => {
    if (!tagName) {
      alert('태그 이름을 입력하세요.');
      return;
    }

    if (!tagCategory || (tagCategory !== 'todo' && tagCategory !== 'post')) {
      alert('태그 카테고리를 선택하세요.');
      return;
    }

    const isDuplicate = existingTags.some(tag => tag.tagName === tagName);
    if (isDuplicate) {
      alert('태그 이름이 중복됩니다.');
      return;
    }

    try {
      await createTag(projectId, tagName, tagCategory);
      onTagAdded();
      onClose();
    } catch (error) {
      console.error('Error adding tag:', error);
      alert('태그를 추가하는 중 오류가 발생했습니다.');
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if ((e.target as Element).classList.contains('teamSettingModal')) {
      onClose();
    }
  };

  return (
    <div className="teamSettingModal" onClick={handleModalClick}>
      <div className="addTagModalContainer">
        <h2>태그 추가</h2>
        <input 
          type="text" 
          placeholder="태그 이름" 
          value={tagName} 
          onChange={(e) => setTagName(e.target.value)} 
        />
        <select value={tagCategory} onChange={(e) => setTagCategory(e.target.value)}>
          <option value="">카테고리를 선택하세요</option>
          <option value="todo">todo</option>
          <option value="post">post</option>
        </select>
        <div className="buttonBundle">
          <button className='closeTagButton' onClick={onClose}>취소</button>
          <button className='addTagButton' onClick={handleAddTag}>추가</button>
        </div>
      </div>
    </div>
  );
};

export default AddTagModal;