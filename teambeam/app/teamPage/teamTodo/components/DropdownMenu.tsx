"use client";

import React from "react";

type DropdownMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: () => void;
  onViewPastGoals: () => void;
  onDeleteGoal: () => void;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onClose,
  onAddGoal,
  onViewPastGoals,
  onDeleteGoal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="dropdownMenu">
      <div className="dropdownItem" onClick={onAddGoal}>목표 등록</div>
      <div className="dropdownItem" onClick={onViewPastGoals}>지난 목표</div>
      <div className="dropdownItem" onClick={onDeleteGoal}>목표 삭제</div>
    </div>
  );
};

export default DropdownMenu;
