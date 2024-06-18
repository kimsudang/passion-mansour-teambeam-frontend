import api from "@/app/_api/api";

export const LoginUser = async (data: { mail: string; password: string }) => {
  try {
    const response = await api.post("/login", data);

    // 헤더에서 토큰 추출
    const authorizationToken = response?.headers["authorization"];
    const refreshToken = response?.headers["refreshtoken"];

    // 토큰 및 사용자 정보 저장
    if (authorizationToken && refreshToken) {
      localStorage.setItem("Authorization", authorizationToken);
      localStorage.setItem("RefreshToken", refreshToken);
      localStorage.setItem("MemberId", response.data.memberId);
      localStorage.setItem("SetMain", response.data.startPage);

      return { success: true, message: "로그인에 성공했습니다." };
    } else {
      console.error("로그인에 필요한 토큰이 누락되었습니다.");
      return {
        success: false,
        message: "로그인에 필요한 토큰이 누락되었습니다.",
      };
    }
  } catch (error) {
    console.error("로그인 요청 실패:", error);
    return {
      success: false,
      message: "이메일 혹은 비밀번호가 일치하지 않습니다.",
    };
  }
};
