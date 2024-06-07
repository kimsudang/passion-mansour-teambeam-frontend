'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProjectInfo, fetchMembersInfo, updateMemberRole, inviteMember } from '../../../_api/teamSetting';
import "./layout.scss";
import InviteMemberModal from "./_components/InviteMemberModal";

interface ProjectInfo {
  projectName: string;
  description: string;
  projectStatus: string;
}

interface MemberInfo {
  memberId: number;
  memberName: string;
  mail: string;
  memberRole: string;
  host: boolean;
}

const TeamSetting: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    projectName: '',
    description: '',
    projectStatus: '',
  });

  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [isHost, setIsHost] = useState(false); 
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
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

        const currentUserId = localStorage.getItem("MemberId"); 
        const currentUser = membersData.find((member: MemberInfo) => member.memberId === Number(currentUserId));
        setIsHost(currentUser ? currentUser.host : false); 
      }
    };

    getProjectData();
  }, [projectId]);

  const handleInviteMember = async (mail: string) => {
    setShowInviteModal(false);

    const membersData = await fetchMembersInfo(projectId);
    setMembers(membersData.sort((a: MemberInfo, b: MemberInfo) => b.host === true ? 1 : -1));
  };

  const handleRoleChange = (memberId: number, newRole: string) => {
    const updatedMembers = members.map(member =>
      member.memberId === memberId ? { ...member, memberRole: newRole } : member
    );
    setMembers(updatedMembers);
  };

  const handleSaveSettings = async () => {
    const currentLeader = members.find(member => member.host);
    const memberRoles = members.map(member => ({
      memberId: member.memberId,
      memberRole: member.memberRole,
    }));

    if (currentLeader) {
      await updateMemberRole(projectId, currentLeader.memberId);
    }
    window.location.reload();
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
                <input type="radio" name="projectState" checked={projectInfo.projectStatus === 'PROCESS'} onChange={() => setProjectInfo({ ...projectInfo, projectStatus: 'PROCESS' })} />
                <label>진행중인 프로젝트</label>
                <input type="radio" name="projectState" checked={projectInfo.projectStatus === 'END'} onChange={() => setProjectInfo({ ...projectInfo, projectStatus: 'END' })} />
                <label>완료된 프로젝트</label>
              </>
            ) : (
              <>
                <input type="radio" name="projectState" checked={projectInfo.projectStatus === 'PROCESS'} onChange={() => setProjectInfo({ ...projectInfo, projectStatus: 'PROCESS' })} disabled  />
                <label>진행중인 프로젝트</label>
                <input type="radio" name="projectState" checked={projectInfo.projectStatus === 'END'} onChange={() => setProjectInfo({ ...projectInfo, projectStatus: 'END' })} disabled />
                <label>완료된 프로젝트</label>
              </>
            )}
          </div>
          {isHost && <button className="settingButton">변경한 설정 저장하기</button>}
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
                <select value={member.host ? "leader" : "follower"} onChange={(e) => handleRoleChange(member.memberId, e.target.value)}>
                  <option value="leader">팀장</option>
                  <option value="follower">팀원</option>
                </select>
                <select value={member.memberRole} onChange={(e) => handleRoleChange(member.memberId, e.target.value)}>
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
              <button className="settingButton changeSetting" type="button" onClick={handleSaveSettings}>변경한 설정 저장하기</button>
            </>
          ) : <></>}
        </form>
      </div>
      <div className="tagManagement">
        <div className="title">
          <h3>프로젝트 태그 관리</h3>
          {isHost ? (
            <>
              <button  className="settingButton">태그 추가</button> 
            </>
          ) : <></>}
        </div>
        <div className="tagList">
          <div className="tagItem">태그1</div>
          <div className="tagItem">태그2</div>
          <div className="tagItem">태그3</div>
          <div className="tagItem">태그4</div>
        </div>
      </div>
      {showInviteModal && <InviteMemberModal projectId={projectId} onClose={() => setShowInviteModal(false)} onInvite={handleInviteMember} />}
    </div>
  );

};

export default TeamSetting;