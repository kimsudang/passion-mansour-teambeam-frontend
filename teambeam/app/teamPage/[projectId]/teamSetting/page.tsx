'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from 'axios';
import "./layout.scss";
// import InviteMemberModal from "./_components/InviteMemberModal";

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

// 프로젝트 정보 API 호출 함수
const fetchProjectInfo = async (projectId: string, token: string | null, refreshToken: string | null) => {
  try {
    const response = await axios.get(`http://34.22.108.250:8080/api/team/${projectId}/setting`, {
      headers: {
        Authorization: token,
        RefreshToken: refreshToken,
      },
    });
    return response.data.project;
  } catch (error) {
    alert("프로젝트 정보를 확인할 수 없습니다.");
    console.error("Error fetching project info:", error);
    return null;
  }
};

// 멤버 정보 API 호출 함수
const fetchMembersInfo = async (projectId: string, token: string | null, refreshToken: string | null) => {
  try {
    const response = await axios.get(`http://34.22.108.250:8080/api/team/${projectId}/joinMember`, {
      headers: {
        Authorization: token,   
        RefreshToken: refreshToken,  
      },
    });
    return response.data.joinMemberList; // API 응답에서 멤버 리스트 반환
  } catch (error) {
    alert("멤버 정보를 확인할 수 없습니다.");
    console.error("Error fetching members info:", error);
    return [];                         // 에러 발생 시 빈 배열 반환
  }
};

const TeamSetting: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    projectName: '',
    description: '',
    projectStatus: '',
  });

  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('Authorization');
    const refreshToken = localStorage.getItem('RefreshToken');

    // 프로젝트 정보 가져오기
    const getProjectData = async () => {
      const projectData = await fetchProjectInfo(projectId, token, refreshToken);
      if (projectData) {
        setProjectInfo({
          projectName: projectData.projectName, 
          description: projectData.description,  
          projectStatus: projectData.projectStatus,
        });

        // 멤버 정보 가져오기
        const membersData = await fetchMembersInfo(projectId, token, refreshToken);
        setMembers(membersData);

        const currentUserEmail = membersData.mail; 
        const currentUser = membersData.find((member: MemberInfo) => member.mail === currentUserEmail);
        setIsHost(currentUser ? currentUser.host : false); 
      }
    };

    getProjectData();
  }, [projectId]);

  return (
    <div className="projectSettingContaine">
      <h1>프로젝트 관리</h1>
      <div className="projectInfoSetting">
        <form>
          <div className="projectName">
            <h4>프로젝트 이름</h4>
            {isHost ? (
              <input type="text" value={projectInfo.projectName} onChange={(e) => setProjectInfo({ ...projectInfo, projectName: e.target.value })} />
            ) : (
              <span className="functionTag">{projectInfo.projectName}</span>
            )}
          </div>
          <div className="projectDescription">
            <h4>프로젝트 설명</h4>
            {isHost ? (
              <input type="textarea" value={projectInfo.description} onChange={(e) => setProjectInfo({ ...projectInfo, description: e.target.value })} />
            ) : (
              <span className="functionTag">{projectInfo.description}</span>
            )}
          </div>
          <div className="projectStatus">
            <h4>프로젝트 상태</h4>
            {isHost ? (
              <>
                <input type="radio" name="projectState" checked={projectInfo.projectStatus === '진행중인 프로젝트'} onChange={() => setProjectInfo({ ...projectInfo, projectStatus: '진행중인 프로젝트' })} />
                <label>진행중인 프로젝트</label>
                <input type="radio" name="projectState" checked={projectInfo.projectStatus === '완료된 프로젝트'} onChange={() => setProjectInfo({ ...projectInfo, projectStatus: '완료된 프로젝트' })} />
                <label>완료된 프로젝트</label>
              </>
            ) : (
              <>
                <input type="radio" name="projectState" checked={projectInfo.projectStatus === '진행중인 프로젝트'} onChange={() => setProjectInfo({ ...projectInfo, projectStatus: 'PROCESS' })} />
                <label>진행중인 프로젝트</label>
                <input type="radio" name="projectState" checked={projectInfo.projectStatus === '완료된 프로젝트'} onChange={() => setProjectInfo({ ...projectInfo, projectStatus: '완료된 프로젝트' })} />
                <label>완료된 프로젝트</label>
              </>
            )}
          </div>
          {!isHost && <button className="settingButton">변경한 설정 저장하기</button>}
        </form>
      </div>
      <div className="memberManagement">
        <form>
          <div className="title">
            <h3>프로젝트 팀원 관리</h3>
            {!isHost ? (
              <>
                <button className="settingButton">팀원 초대</button>
              </>
            ) : <></>}
          </div>
          <div>
            <ul className="memberList">
              {members.map(member => (
                <li key={member.memberId} className="memberItem">
                  {/* <img src={member.profilePicture} alt={member.memberName} /> */}
                  <p className="memberName">{member.memberName}</p>
                  <select value={member.memberRole}>
                    <option value="leader">팀장</option>
                    <option value="follower">팀원</option>
                  </select>
                  <select value={member.memberRole}>
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
          {!isHost ? (
            <>
              <button className="settingButton changeSetting">변경한 설정 저장하기</button>
            </>
          ) : <></>}
        </form>
      </div>
      <div className="tagManagement">
        <div className="title">
          <h3>프로젝트 태그 관리</h3>
          {!isHost ? (
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
    </div>
  );

};

export default TeamSetting;