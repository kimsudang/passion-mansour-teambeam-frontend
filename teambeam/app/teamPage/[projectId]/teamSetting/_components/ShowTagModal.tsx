import React from 'react';
import { TagInfo, deleteTag } from '../../../../_api/teamSetting';

interface ShowTagModalProps {
  projectId: string;
  tag: TagInfo;
  onClose: () => void;
  onTagDeleted: () => void;
  isHost: boolean;
}

const ShowTagModal: React.FC<ShowTagModalProps> = ({ projectId, tag, onClose, onTagDeleted, isHost }) => {

  const handleDeleteTag = async () => {
    try {
      await deleteTag(projectId, tag.tagId);
      onTagDeleted();
      alert('태그가 삭제되었습니다.');
      onClose();
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert('태그를 삭제하는 중 오류가 발생했습니다.');
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if ((e.target as Element).classList.contains('teamSettingModal')) {
      onClose();
    }
  };

  return (
    <div className="teamSettingModal" onClick={handleModalClick}>
      <div className="showTodoModalContent">
      <span className="close" onClick={onClose}>&times;</span>
        <h2>태그 상세 정보</h2>
        <p>태그 이름: {tag.tagName}</p>
        <p>태그 카테고리: {tag.tagCategory}</p>
        <button onClick={handleDeleteTag}>삭제</button>
      </div>
    </div>
  );
};

export default ShowTagModal;
