import api from "@/app/_api/api";
import { AxiosError } from "axios";

// 회원 정보를 나타내는 인터페이스
export interface Member {
  memberId: number;
  memberName: string;
  mail: string;
  startPage: string;
  notificationCount: number;
  profileImage: string;
}

// 프로필 이미지를 나타내는 인터페이스
export interface ProfileImage {
  imageName: string;
  base64: string;
}


// 접근 토큰만 반환하는 함수
const getAccessTokenHeader = () => {
  const accessToken = localStorage.getItem('Authorization');
  return {
    'Authorization': `${accessToken}`,
  };
};

// 회원 정보를 가져오는 함수
export const fetchMemberInfo = async (): Promise<Member> => {
  const headers = getAccessTokenHeader();
  const response = await api.get('/member', { headers });
  return response.data.member;
};

// 프로필 이미지를 가져오는 함수
export const fetchProfileImages = async (): Promise<ProfileImage[]> => {
  const headers = getAccessTokenHeader();
  const response = await api.get('/member/profileImages', { headers });
  return response.data.profileImages;
};

// 회원 정보를 업데이트하는 함수
export const updateMemberInfo = async (updatedInfo: Partial<Member>) => {
  const headers = getAccessTokenHeader();
  const response = await api.patch('/member', updatedInfo, { headers });
  return response;
};

// 비밀번호 수정하는 함수
export const updatePassword = async (passwordData: { oldPassword: string, newPassword: string }) => {
  const headers = getAccessTokenHeader();
  const response = await api.patch('/member/password', passwordData, { headers });
  return response;
};

// 회원 탈퇴를 처리하는 함수
export const deleteAccount = async () => {
  const headers = getAccessTokenHeader();
  await api.delete('/member', { headers });
};

// 비밀번호 유효성 검사 함수
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// 회원 정보 수정 함수
export const handleUpdateMemberInfo = async (
  memberName: string, mail: string, profileImage: string, startPage: string, codeConfirmed: boolean,
  memberInfo: Member, setMemberInfo: React.Dispatch<React.SetStateAction<Member>>, setCodeConfirmed: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const updatedMail = codeConfirmed ? mail : memberInfo.mail;

    // 변경된 값만 포함하는 객체 생성
    const updatedInfo: Partial<Member> = {};
    if (memberName && memberName !== memberInfo.memberName) {
      updatedInfo.memberName = memberName;
    }
    if (updatedMail && updatedMail !== memberInfo.mail) {
      updatedInfo.mail = updatedMail;
    }
    if (profileImage && profileImage !== memberInfo.profileImage) {
      updatedInfo.profileImage = profileImage;
    }
    if (startPage && startPage !== memberInfo.startPage) {
      updatedInfo.startPage = startPage;
    }

    console.log("updatedInfo: ", updatedInfo);

    // 변경된 값이 있는 경우에만 요청
    if (Object.keys(updatedInfo).length > 0) {
      const response = await updateMemberInfo(updatedInfo);

      if (response.status === 200) {
        localStorage.setItem('Authorization', response.headers.authorization);
        localStorage.setItem('RefreshToken', response.headers.refreshtoken);
        if (updatedInfo.startPage) {
          localStorage.setItem('startPage', updatedInfo.startPage);
        }

        const updatedMemberInfo = response.data.updatedMember;
        setMemberInfo(prevState => ({
          ...prevState,
          ...updatedMemberInfo
        }));

        alert('회원 정보가 성공적으로 수정되었습니다.');
        // window.location.reload();
      }
    } else {
      alert('변경된 내용이 없습니다.');
    }
  } catch (error) {
    console.error('회원 정보 수정 중 오류 발생:', error);
    alert('회원 정보 수정 중 오류가 발생했습니다.');
  }
};

// 비밀번호 변경 함수
export const handleSubmitPasswordChange = async (
  e: React.FormEvent, oldPassword: string, newPassword: string, confirmPassword: string, setMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  e.preventDefault();

  if (!validatePassword(newPassword)) {
    setMessage('비밀번호는 영문, 숫자, 기호로 구성된 8자리 이상이어야 합니다.');
    return;
  }
  if (newPassword !== confirmPassword) {
    setMessage('비밀번호가 일치하지 않습니다.');
    return;
  }

  try {
    await updatePassword({ oldPassword, newPassword });
    alert('비밀번호가 변경되었습니다.');
    window.location.reload();
  } catch (error) {
    console.error('Error:', error);
    alert('비밀번호 변경과정에서 오류가 발생했습니다.');
  }
};

// 메일 변경 함수
export const handleMailChange = async (
  mail: string, setServerCode: React.Dispatch<React.SetStateAction<string | null>>,
  accessToken: string | null
) => {
  try {
    const headers = {
      'Authorization': `${accessToken}`
    };
    const response = await api.post("/member/mail", { mail }, { headers });

    if (response.status === 200) {
      alert("코드가 발송되었습니다. 확인 후 입력해주세요.");
      const { code } = response.data;
      setServerCode(code); // 백엔드에서 받은 인증 코드를 상태에 저장
    }
  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      alert("이미 사용 중인 이메일입니다.");
    } else {
      console.error("메일 변경 요청 중 오류 발생:", error);
      alert("메일 변경 요청 중 오류가 발생했습니다.");
    }
  }
};

// 메일 인증 코드 확인 함수
export const handleConfirmMailCode = (
  e: React.MouseEvent<HTMLButtonElement>, confirmMailCode: string, serverCode: string | null, setCodeConfirmed: React.Dispatch<React.SetStateAction<boolean>>
) => {
  e.preventDefault();
  if (confirmMailCode === serverCode) {
    setCodeConfirmed(true);
    alert('인증 코드 확인 성공');
  } else {
    setCodeConfirmed(false);
    alert('인증 코드가 일치하지 않습니다.');
  }
};
