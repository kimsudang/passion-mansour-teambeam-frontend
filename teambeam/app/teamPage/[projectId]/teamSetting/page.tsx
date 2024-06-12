'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  fetchProjectInfo, 
  fetchMembersInfo, 
  updateMemberRoles, 
  updateMemberRole, 
  inviteMember, 
  fetchProjectTags, 
  updateProjectInfo,
  ProjectInfo, 
  MemberInfo, 
  TagInfo 
} from '../../../_api/teamSetting';
import "./layout.scss";
import InviteMemberModal from "./_components/InviteMemberModal";
import AddTagModal from "./_components/AddTagModal";
import ShowTagModal from "./_components/ShowTagModal";

const TeamSetting: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    projectName: '',
    description: '',
    projectStatus: '',
  });

  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [tags, setTags] = useState<TagInfo[]>([]);
  const [selectedTag, setSelectedTag] = useState<TagInfo | null>(null);
  const [isHost, setIsHost] = useState(false); 
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("MemberId"); 
      setUserId(storedUserId);
    }

    // 프로젝트 정보 가져오기
    const getProjectData = async () => {
      const projectData = await fetchProjectInfo(projectId);
      if (projectData) {
        setProjectInfo({
          projectName: projectData.projectName, 
          description: projectData.description,  
          projectStatus: projectData.projectStatus,
        });

        // 멤버 정보 가져오기
        const membersData = await fetchMembersInfo(projectId);
        setMembers(membersData.sort((a: MemberInfo, b: MemberInfo) => b.host === true ? 1 : -1));

        // 현재 사용자가 호스트인지 확인
        const currentUser = membersData.find((member: MemberInfo) => member.memberId === Number(userId));
        setIsHost(currentUser ? currentUser.host : false); 
      }
    };

    const getTagsData = async () => {
      const tagsData = await fetchProjectTags(projectId);
      setTags(tagsData);
    };

    getProjectData();
    getTagsData();
  }, [projectId, userId]);
  
  // 프로젝트 정보 저장
  const handleProjectSaveSettings = async () => {
    try {
      await updateProjectInfo(projectId, projectInfo);
      setProjectInfo({ ...projectInfo });
      alert("프로젝트 정보가 저장되었습니다.");
    } catch (error) {
      console.error("Error updating project info:", error);
    }
  };

  // 멤버 초대
  const handleInviteMember = async (mail: string) => {
    setShowInviteModal(false);

    const membersData = await fetchMembersInfo(projectId);
    setMembers(membersData.sort((a: MemberInfo, b: MemberInfo) => b.host === true ? 1 : -1));
  };

  // 멤버 역할 변경
  const handleRoleChange = (memberId: number, newRole: string) => {
    const updatedMembers = members.map(member =>
      member.memberId === memberId ? { ...member, memberRole: newRole } : member
    );
    setMembers(updatedMembers);

    // 업데이트된 멤버의 역할 출력
    console.log(`Updated role for member ${memberId}: ${newRole}`);
  };

  // 멤버 권한 변경
  const handleAuthorityChange = (memberId: number, newAuthority: string) => {
    // 팀장 수 체크
    const currentLeaderCount = members.filter(member => member.host).length;
    if (newAuthority === "leader" && currentLeaderCount >= 1) {
      alert("팀장은 한 명만 있을 수 있습니다.");
      return;
    }

    const updatedMembers = members.map(member =>
      member.memberId === memberId ? { ...member, host: newAuthority === "leader" } : { ...member, host: false }
    );
    setMembers(updatedMembers);
  };

  // 설정 저장
  const handleMemberSaveSettings = async () => {
    // 팀장이 한 명인지 확인
    const leaders = members.filter(member => member.host);
    if (leaders.length !== 1) {
      alert("팀장은 반드시 한 명이어야 합니다.");
      return;
    }
    // 현재 리더를 찾기
    const currentLeader = members.find(member => member.host);
    // 멤버 역할 목록
    const memberRoles = members.map(member => ({
      memberId: member.memberId,
      memberRole: member.memberRole,
    }));

     try {
      if (currentLeader) {
        await updateMemberRole(projectId, currentLeader.memberId);
        await updateMemberRoles(projectId, memberRoles);
      }
      alert("변경한 설정이 저장되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handleTagAdded = async () => {
    const tagsData = await fetchProjectTags(projectId);
    setTags(tagsData);
  };

  const handleTagClick = (tag: TagInfo) => {
    setSelectedTag(tag);
  };

  const handleTagModalClose = () => {
    setSelectedTag(null);
  };


  return (
    <div className="projectSettingContainer">
      <h1>프로젝트 관리</h1>
      <div className="projectInfoSetting">
        <form>
          <div className="projectName">
            <h4>프로젝트 이름</h4>
            {isHost ? (
              <input className="projectTitle" type="text" value={projectInfo.projectName} onChange={(e) => setProjectInfo({ ...projectInfo, projectName: e.target.value })} />
            ) : (
              <span className="projectTitle">{projectInfo.projectName}</span>
            )}
          </div>
          <div className="projectDescription">
            <h4>프로젝트 설명</h4>
            {isHost ? (
              <input className="projectDis" type="textarea" value={projectInfo.description} onChange={(e) => setProjectInfo({ ...projectInfo, description: e.target.value })} />
            ) : (
              <span className="projectDis">{projectInfo.description}</span>
            )}
          </div>
          <div className="projectStatus">
            <h4>프로젝트 상태</h4>
            {isHost ? (
              <>
                <input type="radio" name="projectState" checked={projectInfo.projectStatus === 'PROGRESS'} onChange={() => setProjectInfo({ ...projectInfo, projectStatus: 'PROGRESS' })} />
                <label>진행중인 프로젝트</label>
                <input type="radio" name="projectState" checked={projectInfo.projectStatus === 'END'} onChange={() => setProjectInfo({ ...projectInfo, projectStatus: 'END' })} />
                <label>완료된 프로젝트</label>
              </>
            ) : (
              <>
                <input type="radio" name="projectState" checked={projectInfo.projectStatus === 'PROGRESS'} onChange={() => setProjectInfo({ ...projectInfo, projectStatus: 'PROGRESS' })} disabled  />
                <label>진행중인 프로젝트</label>
                <input type="radio" name="projectState" checked={projectInfo.projectStatus === 'END'} onChange={() => setProjectInfo({ ...projectInfo, projectStatus: 'END' })} disabled />
                <label>완료된 프로젝트</label>
              </>
            )}
          </div>
          {isHost && <button className="settingButton" type="button" onClick={handleProjectSaveSettings}>변경한 설정 저장하기</button>}
        </form>
      </div>
      <div className="memberManagement">
        <form>
          <div className="title">
            <h3>프로젝트 팀원 관리</h3>
            {isHost ? (
              <>
                <button className="settingButton"type="button" onClick={() => setShowInviteModal(true)}>팀원 초대</button>
              </>
            ) : <></>}
          </div>
          <div>
            <ul className="memberList">
              {members.map(member => (
                <li key={member.memberId} className="memberItem">
                <p className="memberName">{member.memberName}</p>
                <select value={member.host ? "leader" : "follower"} onChange={(e) => handleAuthorityChange(member.memberId, e.target.value)}>
                  <option value="leader">팀장</option>
                  <option value="follower">팀원</option>
                </select>
                <select value={member.memberRole || ""} onChange={(e) => handleRoleChange(member.memberId, e.target.value)}>
                  <option value="">직무</option>
                  <option value="PM">PM</option>
                  <option value="기획">기획</option>
                  <option value="FE">FE</option>
                  <option value="BE">BE</option>
                  <option value="디자인">디자인</option>
                </select>
                <p>{member.mail}</p>
              </li>
              ))}
            </ul>
          </div>
          {isHost ? (
            <>
              <button className="settingButton changeSetting" type="button" onClick={handleMemberSaveSettings}>변경한 설정 저장하기</button>
            </>
          ) : <></>}
        </form>
      </div>
      <div className="tagManagement">
        <div className="title">
          <h3>프로젝트 태그 관리</h3>
          <button className="settingButton" type="button" onClick={() => setShowAddTagModal(true)}>태그 추가</button> 
        </div>
        <div className="tagList">
          {tags.map(tag => (
            <div key={tag.tagId} className="tagItem" onClick={() => handleTagClick(tag)}>{tag.tagName}</div>
          ))}
        </div>
      </div>
      {showInviteModal && <InviteMemberModal projectId={projectId} onClose={() => setShowInviteModal(false)} onInvite={handleInviteMember} />}
      {showAddTagModal && <AddTagModal projectId={projectId} onClose={() => setShowAddTagModal(false)} onTagAdded={handleTagAdded} existingTags={tags} />}
      {selectedTag && (
        <ShowTagModal 
          projectId={projectId} 
          tag={selectedTag} 
          onClose={handleTagModalClose} 
          onTagDeleted={handleTagAdded} 
          isHost={isHost} 
        />
      )}
    </div>
  );

};

export default TeamSetting;