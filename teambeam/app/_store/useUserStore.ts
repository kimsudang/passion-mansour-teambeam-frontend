import { create } from "zustand";

interface IUserState {
  token: string | null;
  refreshToken: string | null;
  memberId: string | null;
  imgSrc: string | null;
  isSideBar: boolean;
  setUser: (
    token: string | null,
    refreshToken: string | null,
    memberId: string | null
  ) => void;
  setImgSrc: (imgSrc: string) => void;
  clearUser: () => void; // 로그아웃 처리를 위한 함수 추가
  setIsSideBar: (isSideBar: boolean) => void;
  initializeSideBar: () => void; // 함수 추가
}

const useUserStore = create<IUserState>()((set) => ({
  token: null,
  refreshToken: null,
  memberId: null,
  imgSrc: null,
  isSideBar: true, // 기본값을 true로 설정
  setUser: (token, refreshToken, memberId) =>
    set({ token, refreshToken, memberId }),
  setImgSrc: (imgSrc) => set({ imgSrc }),
  clearUser: () =>
    set({ token: null, refreshToken: null, memberId: null, imgSrc: null }),
  setIsSideBar: (isSideBar) => {
    localStorage.setItem("isSidebar", JSON.stringify(isSideBar));
    set({ isSideBar });
  },
  initializeSideBar: () => {
    const storedIsSidebar = localStorage.getItem("isSidebar");
    if (storedIsSidebar !== null) {
      set({ isSideBar: JSON.parse(storedIsSidebar) });
    }
  },
}));

export default useUserStore;
